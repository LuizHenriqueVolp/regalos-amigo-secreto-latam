/* =========================================================
   CONFIGURACIÓN — edita solo este archivo para los [PREENCHER]
   ========================================================= */
window.LYM_CONFIG = {
  // Link de checkout de la Cakto (producto principal US$ 7).
  // Todas las UTMs, src y fbclid de la URL se reenvían automáticamente.
  CHECKOUT_URL: "https://pay.cakto.com.br/372iq4v_1313944",

  // Link de la oferta única (upsell) en /gracias — Kit de Canastas para Vender US$ 14.
  UPSELL_URL: "https://pay.cakto.com.br/vuusuyd_1313973",

  // Order bump (US$ 5): se agrega DENTRO del checkout principal en la Cakto.
  // La página no enlaza aquí; queda como referencia.
  BUMP_URL: "https://pay.cakto.com.br/rvfj6tj_1313965",

  // Pixel de Meta
  META_PIXEL_ID: "1882099482975493",

  // Quién envía ViewContent / InitiateCheckout a Meta:
  //  "utmify" -> solo el Pixel de Utmify (evita eventos duplicados). Este sitio
  //              sigue enviando PageView y eventos propios (VideoPlay, Upsell*).
  //  "site"    -> los envía este sitio (usar si quitas el Pixel de Meta del panel de Utmify).
  META_STANDARD_EVENTS_BY: "utmify",

  // Dispara Purchase en /gracias. Déjalo en false si la integración nativa
  // de Pixel de la Cakto ya envía Purchase (evita contar dos veces).
  FIRE_PURCHASE_ON_THANKS: false,
  PURCHASE_VALUE: 7,
  CURRENCY: "USD",

  // Endpoint serverless que guarda en Neon (no cambies salvo que muevas la API)
  EVENT_ENDPOINT: "/api/event"
};
