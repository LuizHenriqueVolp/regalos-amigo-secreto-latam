# Lazo y Mano — +60 Regalos Caseros para Amigo Secreto

Página de ventas mobile-first (LATAM, español neutro) para el infoproducto digital de US$ 9.

- `/` → página de ventas
- `/gracias` → página de agradecimiento con oferta única (upsell US$ 15)
- `/api/event` → función serverless que guarda visitas, clics y leads en Neon (Postgres)

Stack: HTML + CSS + JS puro (sin build), imágenes WebP con lazy load, video MP4 cargado solo al tocar play. Deploy en Vercel vía GitHub.

## Estructura

```
index.html            página de ventas
gracias.html          página de gracias + upsell
assets/config.js      ← LINKS DE CHECKOUT, UPSELL Y PIXEL (editar aquí)
assets/styles.css     estilos; colores y fuentes en variables CSS al inicio (:root)
assets/app.js         tracking (Meta Pixel + Neon), carrusel, animaciones, sticky CTA
assets/img/           logo y portadas del material
assets/muestras/      páginas REALES del material (carrusel "Mira por dentro")
assets-ia/            imágenes generadas por IA (siempre con "Imagen ilustrativa")
assets/video/         video ilustrativo comprimido + póster
api/event.js          función serverless → Neon
sql/schema.sql        tablas visits, clicks, leads
```

## Pendientes [PREENCHER]

| Dónde | Qué |
|---|---|
| `assets/config.js` → `CHECKOUT_URL` | Link del checkout Cakto (US$ 9) |
| `assets/config.js` → `UPSELL_URL` | Link del upsell Kit de Canastas (US$ 15) |
| `index.html` / `gracias.html` | Días de garantía (buscar `[PREENCHER]`), cómo pedir reembolso, medios de pago, contacto, aviso legal, privacidad |
| `index.html` carrusel | Fotos REALES de canastas armadas (no usar IA) |
| `index.html` prueba social | Solo testimonios reales. Hoy la sección está omitida |

Busca todo lo pendiente con: `grep -rn "PREENCHER" --include=*.html --include=*.js .`

## Deploy en Vercel (paso a paso)

1. **Neon**: crea un proyecto en https://console.neon.tech → *SQL Editor* → pega y ejecuta `sql/schema.sql`.
2. Copia la *connection string* (Dashboard → Connect → `postgresql://...?sslmode=require`).
3. **Vercel**: https://vercel.com/new → *Import Git Repository* → `LuizHenriqueVolp/regalos-amigo-secreto-latam`.
   - Framework Preset: **Other**
   - Build Command: *(vacío)* · Output Directory: *(vacío / raíz)*
4. En *Environment Variables* agrega `DATABASE_URL` = la string de Neon (Production y Preview). **No la pongas en el código.**
5. *Deploy*. Cada `git push` a `main` vuelve a publicar.
6. Prueba: abre `https://TU-DOMINIO/?utm_source=fb&utm_campaign=test&src=ad1`, toca un botón y revisa en Neon:
   ```sql
   SELECT * FROM visits ORDER BY id DESC LIMIT 5;
   SELECT * FROM clicks ORDER BY id DESC LIMIT 5;
   ```

### Local
```bash
npm i -g vercel
vercel link
vercel env pull .env    # baja DATABASE_URL a .env (ignorado por git)
vercel dev
```
Sin `vercel dev` puedes ver solo el front con cualquier servidor estático (`npx serve .`); `/api/event` responderá error y la página sigue funcionando.

## Cakto

- **Checkout**: pega el link en `CHECKOUT_URL`. Todos los CTAs lo usan y reenvían `utm_source, utm_medium, utm_campaign, utm_content, utm_term, src, sck, fbclid` de la URL de la página.
- **Order bump** "Dinámicas de Amigo Secreto" US$ 5: se configura en la Cakto (la página solo lo avisa).
- **Página de obrigado**: en la Cakto, configura la URL de redirección después del pago a `https://TU-DOMINIO/gracias`.
- **Upsell**: crea la oferta de US$ 15 en la Cakto y pega el link en `UPSELL_URL`.
- **Purchase**: lo ideal es activar la integración nativa de Meta Pixel en la Cakto (ID `1882099482975493`), que dispara Purchase con el valor real. Si la Cakto no lo permite, cambia `FIRE_PURCHASE_ON_THANKS` a `true` en `config.js` (dispara una sola vez por navegador en `/gracias`). No actives los dos o contarás doble.

## Eventos de tracking

| Evento | Pixel | Neon |
|---|---|---|
| Carga de la página | `PageView` | fila en `visits` (UTMs, src, país vía `x-vercel-ip-country`, dispositivo, referrer) |
| Precio visible | `ViewContent` (US$ 9) | `clicks.cta = 'view_price'` |
| Clic en cada CTA | `InitiateCheckout` (`content_name` = hero / incluye / precio / faq / sticky) | `clicks.cta` = nombre del botón |
| Play en video | `VideoPlay` (custom) | `clicks.cta = 'video_play'` |
| Visita a /gracias | `PageView` + `UpsellView` (custom) | `visits` |
| Clic en upsell | `InitiateCheckout` + `UpsellClick` | `clicks.cta = 'upsell_si'` / `'upsell_no'` |
| Lead (si se agrega captura) | — | `leads` vía `window.LYM_logLead(email)` |

## Cambiar identidad visual

Todo está en `:root` al inicio de `assets/styles.css` (`--vino`, `--dorado`, `--crema`, `--verde`, `--cacao`, `--font-title`, `--font-body`). Los valores actuales vienen del Manual de Marca Lazo y Mano (Fraunces + Nunito).

## Reglas de contenido (checklist)

- Números iguales en todas las secciones: +60 ideas (20/20/20), 12 canastas, US$ 9 / US$ 5 / US$ 15.
- Imágenes de IA solo como ilustrativas y con la leyenda "Imagen ilustrativa"; nunca en el carrusel de muestras.
- Sin testimonios, cronómetros, cupos ni números inventados. Sin mención a alcohol.
- Ninguna credencial en el repositorio (`.env` está en `.gitignore`).
