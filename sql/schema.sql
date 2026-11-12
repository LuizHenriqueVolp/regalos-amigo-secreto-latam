-- Ejecutar una vez en el SQL Editor de Neon
CREATE TABLE IF NOT EXISTS visits (id bigserial primary key, created_at timestamptz default now(), utm_source text, utm_medium text, utm_campaign text, utm_content text, src text, country text, device text, referrer text);
CREATE TABLE IF NOT EXISTS clicks (id bigserial primary key, created_at timestamptz default now(), visit_id bigint references visits(id), cta text, utm_campaign text, src text);
CREATE TABLE IF NOT EXISTS leads (id bigserial primary key, created_at timestamptz default now(), email text, country text, utm_campaign text);

CREATE INDEX IF NOT EXISTS visits_created_idx ON visits (created_at);
CREATE INDEX IF NOT EXISTS clicks_visit_idx ON clicks (visit_id);

-- Consultas útiles
-- Visitas y clics por campaña:
-- SELECT v.utm_campaign, count(DISTINCT v.id) visitas, count(c.id) FILTER (WHERE c.cta NOT IN ('view_price','video_play')) clics_cta
-- FROM visits v LEFT JOIN clicks c ON c.visit_id = v.id GROUP BY 1 ORDER BY 2 DESC;
-- CTR por botón:
-- SELECT cta, count(*) FROM clicks GROUP BY 1 ORDER BY 2 DESC;
