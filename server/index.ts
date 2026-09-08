import { menuItems, restaurantInfo } from "./data/menuData";
import { join } from "path";

const PORT = Number(process.env.PORT) || 3001;
const IS_PROD = process.env.NODE_ENV === "production";
const DIST_DIR = join(import.meta.dir, "../dist");

function corsHeaders(origin: string): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function jsonResponse(
  data: unknown,
  status = 200,
  extraHeaders: Record<string, string> = {}
): Response {
  return Response.json(data, {
    status,
    headers: {
      ...corsHeaders(IS_PROD ? "*" : "http://localhost:5173"),
      ...extraHeaders,
    },
  });
}

const server = Bun.serve({
  port: PORT,

  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const origin = IS_PROD ? "*" : "http://localhost:5173";

    // Preflight CORS
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(origin),
      });
    }

    // ── API Routes ──────────────────────────────────────────────────────────

    if (url.pathname === "/api/menu" && req.method === "GET") {
      const category = url.searchParams.get("category");
      const items = category
        ? menuItems.filter((m) => m.category === category)
        : menuItems;
      return jsonResponse(items);
    }

    if (url.pathname === "/api/restaurant" && req.method === "GET") {
      return jsonResponse(restaurantInfo);
    }

    if (url.pathname === "/api/contact" && req.method === "POST") {
      const body = (await req.json()) as {
        name?: string;
        email?: string;
        message?: string;
      };

      const { name, email, message } = body;

      if (!name?.trim() || !email?.trim() || !message?.trim()) {
        return jsonResponse({ error: "Semua field harus diisi." }, 400);
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return jsonResponse({ error: "Format email tidak valid." }, 400);
      }

      // In production: send to email service / save to DB
      console.log(`[Contact] ${new Date().toISOString()} — ${name} <${email}>: ${message}`);

      return jsonResponse({ success: true, message: "Pesan berhasil dikirim!" });
    }

    // ── Static Files (Production) ───────────────────────────────────────────

    if (IS_PROD) {
      const pathname = url.pathname === "/" ? "/index.html" : url.pathname;
      const file = Bun.file(join(DIST_DIR, pathname));

      if (await file.exists()) {
        return new Response(file);
      }

      // SPA fallback — let React Router handle unknown paths
      return new Response(Bun.file(join(DIST_DIR, "index.html")));
    }

    return jsonResponse({ error: "Not found" }, 404);
  },
});

console.log(`Server berjalan di http://localhost:${server.port}`);
if (IS_PROD) {
  console.log(`Mode: production — melayani file dari ${DIST_DIR}`);
}
