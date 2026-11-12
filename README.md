# Lazo y Mano — +60 Regalos Caseros para Amigo Secreto

**En producción:** https://regalosamigosecreto.vercel.app (el dominio antiguo regalos-amigo-secreto-latam.vercel.app redirige con 308) (proyecto Vercel `regalos-amigo-secreto-latam`, base Neon `regalos-amigo-secreto-latam`). Cada push a `main` publica automáticamente.

Página de ventas mobile-first (LATAM, español neutro) para el infoproducto digital de US$ 7.

- `/` → página de ventas
- `/gracias` → página de agradecimiento con oferta única (upsell US$ 14)
- `/aviso-legal`, `/privacidad` → páginas legales
- `/api/event` → función serverless que guarda visitas, clics y leads en Neon (Postgres)

Stack: HTML + CSS + JS puro con un build mínimo (`scripts/build.mjs`: embute CSS/config en el HTML y genera `dist/`), imágenes WebP con lazy load, video MP4 cargado solo al tocar play. Deploy en Vercel vía GitHub.

## Estructura

```
index.html            página de ventas
gracias.html          página de gracias + upsell
assets/config.js      ← LINKS DE CHECKOUT, UPSELL Y PIXEL (editar aquí)
assets/styles.css     estilos; colores y fuentes en variables CSS al inicio (:root)
assets/app.js         tracking (Meta Pixel + Neon), carrusel, animaciones, sticky CTA
assets/img/           logo, portadas y mockups del producto y bonos
assets/regalos-v2/    fotos de ejemplos (Unsplash) para la franja que pasa sin parar
assets/muestras/      páginas REALES del material (carrusel "Mira por dentro")
assets-ia/            imágenes generadas por IA (uso ilustrativo, sin leyenda)
assets/video/         video ilustrativo comprimido + póster
api/event.js          función serverless → Neon
sql/schema.sql        tablas visits, clicks, leads
```

## Oferta actual

| Producto | Precio | Checkout Cakto |
|---|---|---|
| +60 Regalos Caseros (+ Empieza aquí, Etiquetas, Guía de canastas) + 5 bonos (Planificador de Diciembre, Organizador de Regalos, 50 Mensajes, Papeles de Regalo, Moldes de Cajitas — marcados como "Incluido") | de US$ 9 por **US$ 7** | https://pay.cakto.com.br/372iq4v_1313944 |
| Order bump: Dinámicas de Amigo Secreto | US$ 5 (dentro del checkout) | https://pay.cakto.com.br/rvfj6tj_1313965 |
| Upsell en /gracias: Kit de Canastas para Vender | de US$ 15 por **US$ 14** | https://pay.cakto.com.br/vuusuyd_1313973 |

Garantía: 7 días. Contacto: WhatsApp (link `wa.me` en el footer, garantía y FAQ).

## Pendientes

- Fotos reales de canastas armadas por compradores (agregar en "Mira por dentro").
- Testimonios: solo reales. Hoy la sección está omitida.

Busca pendientes con: `grep -rn "PREENCHER" --include=*.html --include=*.js .`

## Créditos de imágenes

- `assets/regalos-v2/*` — fotos de [Unsplash](https://unsplash.com/license) (licencia gratuita, uso comercial). Cada foto corresponde a una ficha real del ebook: 01 vela de soya, 25 jabones de avena y miel, 46 galletas con glasé, 21 mermelada de frutilla, 04 sales de baño, 06 chocolate caliente en frasco, 10 granola, 12 trufas de galleta, 22 bombas de baño, 15 maceta pintada con suculenta, 60 canasta dulce de Navidad, 23 kit de café en frasco, 30 alfajores, 37 cocadas, 34 galletas de avena y chocolate.
- `assets-ia/*` — generadas por IA (la aclaración está en /aviso-legal).
- `assets/muestras-v2/*` — páginas reales del material (recortadas al contenido, 4:5). `assets/img/mockup-*.webp` — montados con las portadas reales.

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

- **Checkout**: ya configurado en `CHECKOUT_URL`. Todos los CTAs lo usan y reenvían `utm_source, utm_medium, utm_campaign, utm_content, utm_term, src, sck, fbclid` de la URL de la página.
- **Order bump** "Dinámicas de Amigo Secreto" US$ 5: debe estar asociado como order bump al producto principal en la Cakto (la página solo lo avisa).
- **Página de obrigado**: en la Cakto, configura la URL de redirección después del pago a `https://TU-DOMINIO/gracias`.
- **Upsell** US$ 14: ya configurado en `UPSELL_URL`.
- **Purchase**: lo ideal es activar la integración nativa de Meta Pixel en la Cakto (ID `1882099482975493`), que dispara Purchase con el valor real. Si la Cakto no lo permite, cambia `FIRE_PURCHASE_ON_THANKS` a `true` en `config.js` (dispara una sola vez por navegador en `/gracias`). No actives los dos o contarás doble.

## Pixel Utmify

Instalado en `index.html` (`<head>`): define `pixelId = 6af5c2d57b52ae267eff15a5` y carga `https://cdn.utmify.com.br/scripts/pixel/pixel.js`. Envía eventos y lead a `tracking.utmify.com.br`. No duplica el PageView de Meta.

## Eventos de tracking

| Evento | Pixel | Neon |
|---|---|---|
| Carga de la página | `PageView` | fila en `visits` (UTMs, src, país vía `x-vercel-ip-country`, dispositivo, referrer) |
| Precio visible | `ViewContent` (US$ 7) | `clicks.cta = 'view_price'` |
| Clic en cada CTA | `InitiateCheckout` (`content_name` = hero / ejemplos / bonos / precio / faq / sticky) | `clicks.cta` = nombre del botón |
| Play en video | `VideoPlay` (custom) | `clicks.cta = 'video_play'` |
| Visita a /gracias | `PageView` + `UpsellView` (custom) | `visits` |
| Clic en upsell | `InitiateCheckout` + `UpsellClick` | `clicks.cta = 'upsell_si'` / `'upsell_no'` |
| Lead (si se agrega captura) | — | `leads` vía `window.LYM_logLead(email)` |

## Cambiar identidad visual

Todo está en `:root` al inicio de `assets/styles.css` (`--vino`, `--dorado`, `--crema`, `--verde`, `--cacao`, `--font-title`, `--font-body`). Estilo actual: fondo blanco, títulos Montserrat y texto Nunito, colores navideños + vino de la marca.

## Reglas de contenido (checklist)

- Números iguales en todas las secciones: +60 ideas (20/20/20), 12 canastas, US$ 7 / US$ 5 / US$ 14.
- Imágenes de IA solo como ilustrativas (aclarado en /aviso-legal); nunca en el carrusel de muestras.
- Sin testimonios, cronómetros, cupos ni números inventados. Sin mención a alcohol.
- Ninguna credencial en el repositorio (`.env` está en `.gitignore`).

## Rendimiento (mobile)

Lighthouse mobile: Performance 94–98, LCP ~1,9 s, CLS 0.
- Fuentes alojadas en `assets/fonts/` (Montserrat y Nunito variables, latin) con fallback calibrado.
- CSS embutido en cada HTML durante el build; `app.js` versionado (`?v=hash`).
- CTAs: todos llevan (scroll suave) a la Oferta de Navidad; solo el botón dentro de la oferta abre el checkout.
- Meta Pixel: PageView queda en cola y el script se carga 2,5 s después del `load` o en el primer toque; los CTAs esperan a que cargue antes de ir al checkout.
- Imágenes en `assets/` y `assets-ia/` con caché de 1 año (`immutable`): **si cambias una imagen, usa un nombre de archivo nuevo**.
