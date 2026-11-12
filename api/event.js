// Vercel Serverless Function: POST /api/event → guarda en Neon (Postgres)
// Conexión SOLO por variable de entorno DATABASE_URL (nunca en el código).
import { neon } from "@neondatabase/serverless";

const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;

const s = (v, max = 200) => (typeof v === "string" && v.trim() ? v.trim().slice(0, max) : null);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const DEVICES = new Set(["mobile", "tablet", "desktop"]);

function parseBody(req) {
  let b = req.body;
  if (typeof b === "string") { try { b = JSON.parse(b); } catch { b = null; } }
  return b && typeof b === "object" ? b : null;
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "method_not_allowed" });
  if (!sql) return res.status(503).json({ ok: false, error: "db_not_configured" });

  const b = parseBody(req);
  if (!b) return res.status(400).json({ ok: false, error: "bad_body" });

  const country = s(req.headers["x-vercel-ip-country"], 8);

  try {
    if (b.type === "visit") {
      let ref = s(b.referrer, 500);
      const rows = await sql`
        INSERT INTO visits (utm_source, utm_medium, utm_campaign, utm_content, src, country, device, referrer)
        VALUES (${s(b.utm_source)}, ${s(b.utm_medium)}, ${s(b.utm_campaign)}, ${s(b.utm_content)},
                ${s(b.src)}, ${country}, ${DEVICES.has(b.device) ? b.device : null}, ${ref})
        RETURNING id`;
      return res.status(200).json({ ok: true, id: rows[0].id });
    }

    if (b.type === "click") {
      const vid = /^\d{1,18}$/.test(String(b.visit_id || "")) ? String(b.visit_id) : null;
      const cta = s(b.cta, 60);
      if (!cta) return res.status(400).json({ ok: false, error: "missing_cta" });
      await sql`
        INSERT INTO clicks (visit_id, cta, utm_campaign, src)
        VALUES ((SELECT id FROM visits WHERE id = ${vid}::bigint), ${cta}, ${s(b.utm_campaign)}, ${s(b.src)})`;
      return res.status(200).json({ ok: true });
    }

    if (b.type === "lead") {
      const email = s(b.email, 254);
      if (!email || !EMAIL_RE.test(email)) return res.status(400).json({ ok: false, error: "bad_email" });
      await sql`INSERT INTO leads (email, country, utm_campaign) VALUES (${email.toLowerCase()}, ${country}, ${s(b.utm_campaign)})`;
      return res.status(200).json({ ok: true });
    }

    return res.status(400).json({ ok: false, error: "unknown_type" });
  } catch (err) {
    console.error("event error", err && err.message);
    return res.status(500).json({ ok: false, error: "db_error" });
  }
}
