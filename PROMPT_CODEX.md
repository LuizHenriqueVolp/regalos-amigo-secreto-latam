# Prompt original do projeto

OBJETIVO
Criar e publicar a página de vendas mobile-first da marca "Lazo y Mano" para o infoproduto "+60 Regalos Caseros para Amigo Secreto" (digital, US$ 9, pago único). Mercado: LATAM (Chile e Colômbia primeiro), espanhol neutro, tratando o leitor de "tú". Meta: conversão máxima no celular.

PERFIL VISUAL
Mesmo perfil da página de referência https://licoresartesanales.lovable.app/?src=ad17: página curta e direta, hero com promessa concreta, preço de impulso visível cedo, lista de itens, bônus, CTA repetido e FAQ. NÃO copie textos nem o layout exato. A identidade é própria: paleta natalina quente (vinho #6B1E2E, dourado #C9A24B, crema #FBF4E8, texto #2B1B17), tipografia Google Fonts legível (título serifado suave, texto sans), mínimo 16 px. Se a identidade do @marca chegar depois (logo, HEX, fontes), deixe tudo em variáveis CSS fáceis de trocar.

REPOSITÓRIO (fazer primeiro)
1. Executar: gh repo create LuizHenriqueVolp/regalos-amigo-secreto-latam --public --clone
   Se o gh não estiver autenticado, parar e me avisar para eu criar o repositório vazio em github.com/new com esse nome.
2. Criar no repositório: o código, README.md com passos de deploy na Vercel, .env.example, .gitignore (incluir .env) e este prompt como PROMPT_CODEX.md.
3. Commit e push na branch main. Informar o link do repositório.
4. NUNCA subir credenciais, string do Neon nem tokens.

STACK
Site estático rápido (Vite + React ou HTML/CSS/JS puro), deploy na Vercel via GitHub. Imagens em WebP/AVIF com lazy load (exceto a do hero). Lighthouse mobile ≥ 90, LCP < 2,5 s. Sem rolagem horizontal em 390 px.

IMAGENS
Usar as imagens geradas por IA que estarão na pasta /assets-ia (cestas de café e caneca) SOMENTE como visual ilustrativo (hero e seção "Dos usos"), sempre com legenda discreta "Imagen ilustrativa". O carrossel de amostras NÃO pode usar imagem de IA: usar placeholders [PREENCHER 4 a 6 imagens reais de páginas do material e de cestas montadas].

COPY (usar exatamente)

TOPO: logo/nome "Lazo y Mano" [PREENCHER logo]

HERO
- Etiqueta: "Amigo secreto 2026"
- H1: "Queda bien en tu amigo secreto con un regalo hecho a mano. Gastando desde US$ 3."
- Sub: "+60 ideas de regalos caseros con costo estimado por ítem, paso a paso y etiquetas listas para imprimir."
- CTA: "Quiero las ideas por solo US$ 9"
- Microtexto: "Acceso inmediato · Pago único · Garantía de [PREENCHER] días"
- Visual: imagem ilustrativa da cesta + legenda "Imagen ilustrativa".

PARA QUIÉN ES
"Para ti si tienes un amigo secreto, un intercambio de oficina o una cena de fin de año y quieres un regalo con tu toque personal, sin gastar de más ni salir corriendo a la tienda."

EL PROBLEMA
"Los regalos de tienda salen caros y todos se parecen. Buscar ideas en internet toma horas y casi nunca te dicen cuánto cuesta cada una. Aquí tienes cada idea con su costo estimado, para elegir según tu presupuesto."

QUÉ INCLUYE (4 ítems; mesmos números em todas as seções)
1. +60 ideas de regalos caseros (20 de US$ 3, 20 de US$ 5 y 20 de US$ 10): velas, jabones, conservas, frascos decorados y más, con costo estimado y paso a paso.
2. Guía "Empieza aquí": elige tu regalo según presupuesto, tiempo y habilidad.
3. Etiquetas imprimibles para presentar tu regalo.
4. Guía de canastas de regalo: 12 modelos, cómo armarlas y tabla de costo × precio de venta, para regalar o para vender.

CARRUSEL DE MUESTRAS (deslizável, com indicadores)
Título: "Mira por dentro". Placeholders [PREENCHER imagens reais].

DOS USOS
"Úsalo para regalar o para vender: muchas personas arman canastas para ganar un extra en diciembre. Los resultados dependen de cada persona." (Sem prometer ganho.)

BUMP (apenas aviso na página; o bump real é no checkout da Cakto)
"En el pago podrás agregar 'Dinámicas de Amigo Secreto' por solo US$ 5: pistas, juegos, mensajes para el grupo de WhatsApp y reglas del sorteo."

PRECIO
- "US$ 9 pago único". Sem preço "de" inventado.
- "Precio en dólares. Tu banco convierte a moneda local."
- Meios de pagamento: [PREENCHER conforme a Cakto].
- CTA: "Quiero mi acceso ahora"

GARANTÍA
"[PREENCHER prazo e como pedir reembolso]". Repetir perto de cada CTA.

PRUEBA SOCIAL
Seção de depoimentos apenas com conteúdo real: [PREENCHER]. Se estiver vazio, OMITIR a seção. Proibido inventar depoimentos, número de clientes ou avaliações.

URGENCIA REAL
"El intercambio de regalos suele ser hasta mediados de diciembre; prepara los tuyos con tiempo." Sem cronômetro, sem vagas falsas.

FAQ
- ¿Cómo recibo el material? Acceso inmediato por email después del pago.
- ¿Necesito experiencia? No, cada idea tiene paso a paso.
- ¿Los costos son exactos? Son estimaciones de referencia y varían según tu país.
- ¿Sirve para vender? Incluye una guía de canastas con tabla de costo y precio. Los resultados dependen de cada persona.
- ¿Es seguro? Las recetas incluyen avisos de seguridad.
- ¿Qué pasa si no me gusta? [PREENCHER garantia].
Rodapé: aviso legal, política de privacidad, contacto [PREENCHER].

PÁGINA DE OBRIGADO (/gracias) COM UPSELL
- Título: "¡Gracias! Tu acceso ya está en camino."
- Oferta única: "Kit de Canastas para Vender" por US$ 15: tabla de costo × precio editable, guion de WhatsApp, fotos-modelo y tarjetas editables.
- Texto: "Si quieres vender tus canastas en diciembre, este kit te ahorra tiempo. Los resultados dependen de cada persona."
- CTA: "Sí, quiero el kit por US$ 15" → [PREENCHER link do upsell]. Link secundário: "No, gracias".
- Disparar evento de Pixel na visita e no clique.

LAYOUT MOBILE
Ordem: hero (CTA visível sem rolar) → para quién es → problema → qué incluye → carrossel → dos usos → bump → precio + CTA → garantía → FAQ. CTA sticky no rodapé (≥ 48 px). Preço visível em no máximo 2 rolagens. Plano único.

ANIMAÇÕES (obrigatório)
Entrada suave das seções ao rolar, contadores animados (60, 12, 3 presupuestos), pulse/brilho discreto nos CTAs, carrossel com deslize, transição nos cards. Respeitar prefers-reduced-motion e não prejudicar a velocidade.

NEON (obrigatório)
Função serverless na Vercel (/api/event) gravando no Neon (Postgres). Conexão via variável DATABASE_URL, nunca no código. Registrar visitas com UTMs/src, cliques em cada CTA, país e dispositivo, e e-mail se houver captura. SQL:
CREATE TABLE visits (id bigserial primary key, created_at timestamptz default now(), utm_source text, utm_medium text, utm_campaign text, utm_content text, src text, country text, device text, referrer text);
CREATE TABLE clicks (id bigserial primary key, created_at timestamptz default now(), visit_id bigint references visits(id), cta text, utm_campaign text, src text);
CREATE TABLE leads (id bigserial primary key, created_at timestamptz default now(), email text, country text, utm_campaign text);

TRACKING
Pixel da Meta ID 1882099482975493: PageView na carga, ViewContent ao ver o preço e InitiateCheckout no clique de cada CTA. Repassar todas as UTMs e o src ao link de checkout da Cakto: [PREENCHER link]. Configurar a URL de obrigado [PREENCHER] e o evento Purchase conforme a Cakto permitir.

CHECKLIST DE ACEITE
- Números e itens iguais em todas as seções (60 ideias, 20/20/20, 12 canastas, US$ 9 / US$ 5 / US$ 15).
- Todos os CTAs com o link de checkout testado.
- 390 px sem rolagem horizontal; texto ≥ 16 px; botões ≥ 48 px.
- LCP < 2,5 s; animações funcionando; Lighthouse mobile ≥ 90.
- Imagens de IA sempre com "Imagen ilustrativa" e fora do carrossel de amostras.
- Nenhum depoimento, cronômetro ou número inventado.
- Nenhuma menção a álcool.
- Nenhuma credencial no repositório.

ENTREGA
Repositório público LuizHenriqueVolp/regalos-amigo-secreto-latam com código, README de deploy e .env.example. Informar o link ao final.

Observação adicional do pedido: incluir o vídeo da pasta do projeto na página, de forma semelhante ao vídeo do site de referência (vertical, logo abaixo do título, com botão de play).
