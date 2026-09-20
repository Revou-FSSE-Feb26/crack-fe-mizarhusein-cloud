"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { formatRupiah } from "../../lib/format";
import type { NotificationFeed, NotificationItem } from "../../types";
import { IconBell } from "./icons";

const POLL_MS = 10_000;
const TOAST_MS = 6_000;
const SOUND_KEY = "saluna.admin.bellSound";

// Fired whenever new activity is detected, so other parts of the page (the
// dashboard numbers) can refresh straight away instead of waiting for their timer.
export const ADMIN_ACTIVITY_EVENT = "saluna:admin-activity";

interface Toast {
  id: number;
  text: string;
}

const itemKey = (i: NotificationItem) => `${i.type}-${i.id}`;

function describe(item: NotificationItem) {
  if (item.type === "reservation") {
    return {
      title: "Reservasi baru",
      detail: `${item.customerName} · ${item.partySize} tamu`,
    };
  }
  const who = [item.customerName, item.tableNumber && `Meja ${item.tableNumber}`]
    .filter(Boolean)
    .join(" · ");
  return {
    title: `Order baru #${item.id}`,
    detail: `${who ? `${who} · ` : ""}${item.itemCount} item · ${formatRupiah(item.total)}`,
  };
}

function timeAgo(iso: string) {
  const seconds = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return "baru saja";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} menit lalu`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} jam lalu`;
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

export default function NotificationBell() {
  const router = useRouter();
  const [feed, setFeed] = useState<NotificationFeed | null>(null);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState<Set<string>>(new Set());
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [soundOn, setSoundOn] = useState(true);

  const rootRef = useRef<HTMLDivElement>(null);
  const openRef = useRef(false);
  const knownKeys = useRef<Set<string> | null>(null); // null until the first poll
  const audioRef = useRef<AudioContext | null>(null);
  const soundRef = useRef(true);
  const toastId = useRef(0);

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  // remember the sound preference
  useEffect(() => {
    try {
      if (localStorage.getItem(SOUND_KEY) === "off") {
        setSoundOn(false);
        soundRef.current = false;
      }
    } catch {
      /* storage unavailable, keep the default */
    }
  }, []);

  // Browsers only allow sound after the user has interacted with the page once.
  useEffect(() => {
    function unlock() {
      try {
        if (!audioRef.current) {
          const Ctx =
            window.AudioContext ??
            (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
          if (Ctx) audioRef.current = new Ctx();
        }
        void audioRef.current?.resume();
      } catch {
        /* no audio support */
      }
    }
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  const playTing = useCallback(() => {
    if (!soundRef.current) return;
    const ctx = audioRef.current;
    if (!ctx || ctx.state !== "running") return; // not unlocked yet: stay silent
    try {
      const now = ctx.currentTime;
      [880, 1320].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        const start = now + i * 0.12;
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(0.06, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.35);
        osc.connect(gain).connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.4);
      });
    } catch {
      /* ignore audio errors */
    }
  }, []);

  const markSeen = useCallback(async () => {
    try {
      await fetch("/api/admin/notifications/seen", { method: "POST" });
    } catch {
      /* the next poll will show the real state */
    }
  }, []);

  const pushToasts = useCallback((fresh: NotificationItem[]) => {
    // Many at once collapse into a single toast instead of a wall of them.
    const list =
      fresh.length > 3
        ? [`${fresh.length} notifikasi baru`]
        : fresh.map((item) => {
            const { title, detail } = describe(item);
            return `${title}: ${detail}`;
          });

    list.forEach((text) => {
      const id = ++toastId.current;
      setToasts((prev) => [...prev, { id, text }].slice(-3));
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), TOAST_MS);
    });
  }, []);

  const poll = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/notifications", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as NotificationFeed;

      const keys = data.items.map(itemKey);
      if (knownKeys.current === null) {
        // First look: just remember what exists, don't announce old activity.
        knownKeys.current = new Set(keys);
      } else {
        const fresh = data.items
          .filter((i) => !knownKeys.current!.has(itemKey(i)))
          .reverse(); // oldest first
        keys.forEach((k) => knownKeys.current!.add(k));

        if (fresh.length > 0) {
          window.dispatchEvent(new Event(ADMIN_ACTIVITY_EVENT));
          if (openRef.current) {
            // The admin is looking at the list right now: it counts as seen.
            void markSeen();
            data.unreadCount = 0;
          } else {
            pushToasts(fresh);
            playTing();
          }
        }
      }

      if (openRef.current) data.unreadCount = 0;
      setFeed(data);
    } catch {
      /* offline or backend restarting: try again on the next tick */
    }
  }, [markSeen, playTing, pushToasts]);

  useEffect(() => {
    void poll();
    const timer = setInterval(() => void poll(), POLL_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") void poll();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [poll]);

  // click outside closes the dropdown
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) close();
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  function close() {
    setOpen(false);
    setHighlight(new Set());
  }

  function toggle() {
    if (open) {
      close();
      return;
    }
    // Opening the bell: remember which entries were new (to highlight them while
    // the list is open), then clear the badge and tell the server.
    setHighlight(new Set((feed?.items ?? []).filter((i) => i.isNew).map(itemKey)));
    setFeed((prev) => (prev ? { ...prev, unreadCount: 0 } : prev));
    setToasts([]);
    setOpen(true);
    void markSeen();
  }

  function toggleSound() {
    const next = !soundOn;
    setSoundOn(next);
    soundRef.current = next;
    try {
      localStorage.setItem(SOUND_KEY, next ? "on" : "off");
    } catch {
      /* ignore */
    }
    if (next) playTing(); // let the admin hear what it sounds like
  }

  const unread = feed?.unreadCount ?? 0;

  return (
    <div ref={rootRef} className="relative">
      <button
        onClick={toggle}
        aria-label={unread > 0 ? `Notifikasi, ${unread} baru` : "Notifikasi"}
        aria-expanded={open}
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-navy/70 transition hover:bg-navy/5"
      >
        <IconBell className="w-5 h-5" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] leading-none text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {/* toasts, just below the bell */}
      {!open && toasts.length > 0 && (
        <div
          className="absolute right-0 top-full z-50 mt-2 flex w-72 flex-col gap-2"
          aria-live="polite"
        >
          {toasts.map((toast) => (
            <button
              key={toast.id}
              onClick={toggle}
              className="rounded-xl bg-navy px-4 py-3 text-left text-sm font-sans text-white shadow-lg"
            >
              {toast.text}
            </button>
          ))}
        </div>
      )}

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-navy/10">
          <div className="border-b border-navy/10 px-4 py-3">
            <p className="font-serif text-base font-semibold text-navy">Notifikasi</p>
          </div>

          {feed && feed.items.length > 0 ? (
            <ul className="max-h-96 overflow-y-auto">
              {feed.items.map((item) => {
                const { title, detail } = describe(item);
                const isNew = highlight.has(itemKey(item));
                return (
                  <li key={itemKey(item)}>
                    <button
                      onClick={() => {
                        close();
                        router.push(item.type === "reservation" ? "/admin/reservation" : "/admin/orders");
                      }}
                      className={`block w-full border-b border-navy/5 px-4 py-3 text-left font-sans transition hover:bg-navy/5 ${
                        isNew ? "bg-blue-50/70" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-navy">
                          {isNew && (
                            <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-red-500 align-middle" />
                          )}
                          {title}
                        </span>
                        <span className="shrink-0 text-xs text-navy/40">{timeAgo(item.createdAt)}</span>
                      </div>
                      <p className="mt-0.5 text-xs text-navy/60">{detail}</p>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="px-4 py-8 text-center text-sm font-sans text-navy/50">
              Belum ada reservasi atau pesanan.
            </p>
          )}

          <div className="flex items-center justify-between border-t border-navy/10 px-4 py-2.5">
            <span className="text-xs font-sans text-navy/50">Diperbarui otomatis</span>
            <button
              onClick={toggleSound}
              aria-pressed={soundOn}
              className="rounded-full border border-navy/15 px-3 py-1 text-xs font-sans text-navy/70 transition hover:bg-navy/5"
            >
              Suara: {soundOn ? "ON" : "OFF"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
