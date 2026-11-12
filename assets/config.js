/* =========================================================
   CONFIGURACIÓN — edita solo este archivo para los [PREENCHER]
   ========================================================= */
window.LYM_CONFIG = {
  // Link de checkout de la Cakto (producto principal US$ 9).
  // Todas las UTMs, src y fbclid de la URL se reenvían automáticamente.
  CHECKOUT_URL: "[PREENCHER link checkout Cakto]",

  // Link de la oferta única (upsell) en /gracias — Kit de Canastas para Vender US$ 15.
  UPSELL_URL: "[PREENCHER link do upsell]",

  // Pixel de Meta
  META_PIXEL_ID: "1882099482975493",

  // Dispara Purchase en /gracias. Déjalo en false si la integración nativa
  // de Pixel de la Cakto ya envía Purchase (evita contar dos veces).
  FIRE_PURCHASE_ON_THANKS: false,
  PURCHASE_VALUE: 9,
  CURRENCY: "USD",

  // Endpoint serverless que guarda en Neon (no cambies salvo que muevas la API)
  EVENT_ENDPOINT: "/api/event"
};
