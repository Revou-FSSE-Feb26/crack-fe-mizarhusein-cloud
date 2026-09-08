"use client";

import { useState } from "react";
import type { ContactFormData, FormStatus } from "../types";

export default function Contact() {
  const [form, setForm] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<FormStatus>("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = (await res.json()) as { success?: boolean; error?: string };

      if (res.ok && data.success) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="pt-40 pb-28 px-6 bg-cream">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16">
        <div className="fade-left">
          <p className="uppercase tracking-[4px] text-sm mb-4 text-navy/70 font-sans">
            Get In Touch
          </p>
          <h2 className="font-serif text-4xl md:text-6xl font-normal mb-8 leading-tight text-navy">
            Contact Us
          </h2>
          <ul className="space-y-3 text-gray-700 text-lg">
            <li>+62 812 3456 7890</li>
            <li>hello@salunabeachclub.com</li>
            <li>Bali, Indonesia</li>
            <li>Mon – Sun: 10:00 – 22:00</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 fade-right">
          <input
            name="name"
            type="text"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full bg-white border border-navy/20 rounded px-4 py-3 text-sm text-navy placeholder-gray-400 focus:outline-none focus:border-navy/60 transition"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full bg-white border border-navy/20 rounded px-4 py-3 text-sm text-navy placeholder-gray-400 focus:outline-none focus:border-navy/60 transition"
          />
          <textarea
            name="message"
            placeholder="Message"
            value={form.message}
            onChange={handleChange}
            required
            rows={5}
            className="w-full bg-white border border-navy/20 rounded px-4 py-3 text-sm text-navy placeholder-gray-400 focus:outline-none focus:border-navy/60 transition resize-none"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-navy text-white py-3 text-sm uppercase tracking-[2px] hover:bg-navy-dark transition duration-300 disabled:opacity-50 rounded"
          >
            {status === "loading" ? "Sending..." : "Send"}
          </button>

          {status === "success" && (
            <p className="text-green-600 text-sm">Pesan berhasil dikirim!</p>
          )}
          {status === "error" && (
            <p className="text-red-600 text-sm">Gagal mengirim. Coba lagi.</p>
          )}
        </form>
      </div>
    </section>
  );
}
