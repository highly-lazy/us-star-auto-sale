import { createContext, useContext, useEffect, useState, useCallback } from "react";

const KEY = "usstar_lang";

// Translation dictionary. Keys are stable identifiers; English is the source.
const STRINGS = {
  en: {
    // top bar / header
    "top.financing": "Apply Financing",
    "top.text": "Text Us",
    "nav.home": "Home",
    "nav.inventory": "Inventory",
    "nav.allVehicles": "All Vehicles",
    "nav.newCars": "New Arrivals",
    "nav.usedCars": "Used Vehicles",
    "nav.saved": "Saved Vehicles",
    "nav.financing": "Financing",
    "nav.getApproved": "Get Pre‑Approved",
    "nav.creditApp": "Credit Application",
    "nav.tradein": "Trade‑In Value",
    "nav.services": "Services",
    "nav.testdrive": "Schedule Test Drive",
    "nav.contact": "Contact",
    "nav.contactUs": "Contact Us",
    "cta.preApproved": "Get Pre‑Approved",
    "cta.callNow": "Call Now",

    // hero
    "hero.kicker": "Premium Used Cars • Knoxville, TN",
    "hero.title": "A better way to buy your next car.",
    "hero.badge.quality": "Quality‑Inspected Vehicles",
    "hero.badge.ship": "Get quote to ship your vehicle",
    "hero.badge.carfax": "CARFAX Available",
    "hero.badge.cargurus": "CarGurus Dealer",

    // search panel
    "search.title": "Find Your Vehicle",
    "search.make": "Make",
    "search.anyMake": "Any Make",
    "search.model": "Model",
    "search.anyModel": "Any Model",
    "search.year": "Year (from)",
    "search.anyYear": "Any Year",
    "search.maxPrice": "Max Price",
    "search.noMax": "No Max",
    "search.maxMiles": "Max Mileage",
    "search.color": "Color",
    "search.anyColor": "Any Color",
    "search.transmission": "Transmission",
    "search.any": "Any",
    "search.automatic": "Automatic",
    "search.manual": "Manual",
    "search.submit": "Search Inventory",


    // sections
    "section.featured": "Featured Inventory",
    "section.newArrivals": "New Arrivals",
    "section.viewAll": "View All",
    "section.services": "Our Services",
    "section.servicesSub": "Everything you need to drive away happy — under one roof.",
    "about.title": "About US Star Auto Sale",
    "about.subtitle": "Your trusted partner for quality vehicles and flexible financing across the United States.",
    "about.p1": "US Star Auto Sale is a customer-focused auto dealership dedicated to helping people find reliable, high-quality vehicles at competitive prices. We believe buying a car should be simple, transparent, and stress-free.",
    "about.p2": "With access to multiple lenders nationwide, we offer flexible financing options for all credit types — good, bad, or no credit.",
    "about.applyBtn": "Apply for Financing",
    "about.browseBtn": "Browse Inventory",
    "about.stat.sold": "Cars Sold",
    "about.stat.approval": "Approval Process",
    "about.stat.fast": "Fast",
    "about.stat.network": "Lender Network",
    "about.stat.nationwide": "Nationwide",

    // services
    "svc.ship.title": "Nationwide Shipping",
    "svc.ship.text": "Tap to call and get a fast shipping quote anywhere in the USA.",
    "svc.ship.btn": "Call for Quote",
    "svc.finance.title": "Financing Options",
    "svc.finance.text": "Flexible financing tailored to your needs with easy approval for all credit types.",
    "svc.finance.btn": "Apply Now",
    "svc.test.title": "Test Drive",
    "svc.test.text": "Book a test drive and experience your car before you buy.",
    "svc.test.btn": "Book Test Drive",
    "svc.trade.title": "Trade‑In",
    "svc.trade.text": "Get top value for your current vehicle toward your next one.",
    "svc.trade.btn": "Get Value",

    // lead form
    "lead.title": "Can't find the right vehicle? We'll find it for you.",
    "lead.text": "Tell us what you're looking for and our team will match you with the best options from our nationwide network — often within 24 hours.",
    "lead.point1": "Financing for all credit types",
    "lead.point2": "CARFAX reports available",
    "lead.point3": "Nationwide vehicle shipping",
    "lead.cardTitle": "Request More Information",
    "lead.cardSub": "No obligation · We respond fast",
    "lead.firstName": "First name",
    "lead.lastName": "Last name",
    "lead.phone": "Phone number",
    "lead.email": "Email address",
    "lead.vehicle": "Vehicle you're interested in (make / model)",
    "lead.message": "Anything else we should know? (budget, trade-in, timing…)",
    "lead.send": "Send Request",
    "lead.sending": "Sending…",
    "lead.ok": "Thank you! We received your request and will be in touch shortly.",

    // inventory
    "inv.title": "Vehicle Inventory",
    "inv.subtitle": "Knoxville, TN · Premium Pre-Owned Vehicles",
    "inv.available": "Available",
    "inv.sold": "Sold",
    "inv.all": "All Vehicles",
    "inv.new": "New Arrivals",
    "inv.used": "Used",

    // footer
    "footer.hours": "Working Hours",
    "footer.address": "Address",
    "footer.email": "Email",
    "footer.quickLinks": "Quick Links",
    "footer.rights": "All rights reserved",

    // hero / CTA
    "cta.viewInventory": "View Inventory",

    // trust strip
    "trust.inspected": "Quality Inspected",
    "trust.inspectedSub": "Every vehicle checked before it lists",

    // browse tiles
    "browse.eyebrow": "Start here",
    "browse.title": "Shop our inventory",
    "browse.byPrice": "By price",
    "browse.byStyle": "By body style",
    "browse.byMake": "By make",
    "browse.vehicle": "vehicle",
    "browse.vehicles": "vehicles",

    // section eyebrows
    "section.justIn": "Just arrived",
    "section.inStock": "Available now",
    "section.howWeHelp": "How we help",

    // reviews
    "reviews.eyebrow": "What customers say",
    "reviews.title": "Customer Reviews",
    "reviews.readAll": "Read all reviews",
    "reviews.fallback": "Our customers leave their reviews on Google, CARFAX and CarGurus. Read what they say about buying from US Star Auto Sale — or add yours.",

    // about
    "about.eyebrow": "About us",
    "about.stat.inStock": "Vehicles In Stock",

    // extra services
    "svc.credit.title": "Online Credit Application",
    "svc.credit.text": "Apply through our secure lender portal and get a decision without visiting the lot.",
    "svc.credit.btn": "Start application",
    "svc.history.title": "Vehicle History",
    "svc.history.text": "CARFAX or AutoCheck report available on request for any vehicle in our inventory.",
    "svc.history.btn": "Request a report",

    // legal
    "legal.priceDisclaimer": "Prices exclude tax, title, license and a dealer documentation fee. Vehicles are sold as-is; availability and pricing are subject to change. Mileage and equipment are believed accurate but are not guaranteed — please verify with our team.",

    // brand strip
    "brands.label": "Brands we stock",

    // financing band
    "fin.eyebrow": "Financing",
    "fin.title": "Approved in minutes — every credit type welcome.",
    "fin.text": "We work with a nationwide lender network, so a thin file or past credit trouble doesn't stop you. Apply online and most applicants hear back the same day.",
    "fin.point1": "Good credit, bad credit, first-time buyer — all welcome",
    "fin.point2": "Soft inquiry to check options, no impact to start",
    "fin.point3": "Low down payments and flexible terms",
    "fin.point4": "Trade-in value applied straight to your down payment",
    "fin.portalBtn": "Secure Lender Portal",
    "fin.step1.title": "Tell us about you",
    "fin.step1.text": "A short form — income, employment, and the vehicle you have in mind. About five minutes.",
    "fin.step2.title": "We shop your file",
    "fin.step2.text": "Our finance team sends it to multiple lenders and comes back with the strongest offer.",
    "fin.step3.title": "Sign and drive",
    "fin.step3.text": "Review the terms, pick your payment, and take the vehicle home the same day.",

    // reviews
    "reviews.titleCount": "Over {n} satisfied customers and counting!",
    "reviews.sub": "Real reviews from people who bought their vehicle at US Star Auto Sale.",
    "reviews.prev": "Previous review",
    "reviews.next": "Next review",

    // hero (v2)
    "hero.titleA": "Quality used cars in",
    "hero.titleB": "Knoxville, TN",
    "hero.subtext": "{n} inspected vehicles on the lot right now — with financing for every credit type and a vehicle history report on every listing.",
    "hero.subtextPlain": "Inspected vehicles, financing for every credit type, and a vehicle history report on every listing.",
    "hero.stat.inStock": "Vehicles in stock",
    "hero.stat.allCredit": "Credit types financed",
    "hero.stat.allCreditV": "All",
    "hero.stat.history": "Vehicle history",
    "hero.stat.historyV": "CARFAX",
    "hero.scroll": "Scroll",

    // search bar
    "search.barTitle": "Find your vehicle",

    // FAQ
    "faq.eyebrow": "Questions",
    "faq.title": "Buying a car here — answered.",
    "faq.sub": "The things Knoxville buyers ask us most. If yours isn't here, call or text us and we'll answer it straight.",
    "faq.credit.q": "Can I get financed with bad credit or no credit history?",
    "faq.credit.a": "Yes. We submit your application to a nationwide network of lenders that includes subprime and first-time-buyer programs, so a thin file, past repossession or bankruptcy doesn't automatically disqualify you. Approval terms depend on the lender, the vehicle and your income — we'll tell you exactly what you qualify for before you come in.",
    "faq.bring.q": "What do I need to bring to get approved?",
    "faq.bring.a": "A valid driver's license, proof of income (recent pay stubs or bank statements), proof of residence (a utility bill or lease), proof of insurance, and your down payment. Some lenders also ask for references or proof of a working phone number in your name.",
    "faq.down.q": "How much do I need for a down payment?",
    "faq.down.a": "It depends on the vehicle, the lender and your credit profile — there's no single number. Apply online or call us and we'll give you the exact down payment your approval requires before you make the trip.",
    "faq.trade.q": "Do you accept trade-ins?",
    "faq.trade.a": "Yes. We'll appraise your current vehicle and apply its value straight to your down payment, and you can still trade in a vehicle you owe money on. Start with our online trade-in form for a free, no-obligation estimate.",
    "faq.history.q": "Can I see a vehicle history report before I buy?",
    "faq.history.a": "Yes. A CARFAX or AutoCheck report is available on request for any vehicle in our inventory. Ask our team for the report on the listing you're interested in and we'll send it to you.",
    "faq.asis.q": "Are your vehicles sold as-is, or is there a warranty?",
    "faq.asis.a": "Our vehicles are sold as-is unless a written warranty is included in your sale documents. Extended service contracts are available on many vehicles — ask us which ones qualify and what the coverage costs.",
    "faq.inspect.q": "Can I have the car inspected by my own mechanic?",
    "faq.inspect.a": "Absolutely, and we encourage it. Arrange a pre-purchase inspection with a shop you trust before you sign anything — just let us know so we can have the vehicle ready.",
    "faq.fees.q": "Does the advertised price include tax and fees?",
    "faq.fees.a": "No. Advertised prices exclude sales tax, title, license and registration, and a dealer documentation fee. Ask us for an out-the-door figure and we'll break down every line before you sign.",
    "faq.ship.q": "I live out of state — can I still buy from you?",
    "faq.ship.a": "Yes. We work with buyers across the United States and can arrange shipping to your door. Call or text us with the listing you want and your ZIP code and we'll quote the delivery cost.",
    "faq.apply.q": "Can I apply for financing before I visit the lot?",
    "faq.apply.a": "Yes — that's the fastest way to buy. The online application takes about five minutes and most applicants hear back the same business day, so you can arrive knowing your budget and terms.",

    "reviews.basedOn": "Based on {n} Google reviews",
    "reviews.write": "Leave us a review",
  },
  es: {
    "top.financing": "Solicitar Financiamiento",
    "top.text": "Envíanos un Texto",
    "nav.home": "Inicio",
    "nav.inventory": "Inventario",
    "nav.allVehicles": "Todos los Vehículos",
    "nav.newCars": "Nuevos Ingresos",
    "nav.usedCars": "Vehículos Usados",
    "nav.saved": "Guardados",
    "nav.financing": "Financiamiento",
    "nav.getApproved": "Pre‑Aprobación",
    "nav.creditApp": "Solicitud de Crédito",
    "nav.tradein": "Valor de Intercambio",
    "nav.services": "Servicios",
    "nav.testdrive": "Agendar Prueba de Manejo",
    "nav.contact": "Contacto",
    "nav.contactUs": "Contáctanos",
    "cta.preApproved": "Pre‑Aprobación",
    "cta.callNow": "Llámanos",

    "hero.kicker": "Autos Usados Premium • Knoxville, TN",
    "hero.title": "Una mejor forma de comprar tu próximo auto.",
    "hero.badge.quality": "Vehículos Inspeccionados",
    "hero.badge.ship": "Cotiza el envío de tu vehículo",
    "hero.badge.carfax": "CARFAX Disponible",
    "hero.badge.cargurus": "Distribuidor CarGurus",

    "search.title": "Encuentra tu Vehículo",
    "search.make": "Marca",
    "search.anyMake": "Cualquier Marca",
    "search.model": "Modelo",
    "search.anyModel": "Cualquier Modelo",
    "search.year": "Año (desde)",
    "search.anyYear": "Cualquier Año",
    "search.maxPrice": "Precio Máx.",
    "search.noMax": "Sin Límite",
    "search.maxMiles": "Millaje Máx.",
    "search.color": "Color",
    "search.anyColor": "Cualquier Color",
    "search.transmission": "Transmisión",
    "search.any": "Cualquiera",
    "search.automatic": "Automática",
    "search.manual": "Manual",
    "search.submit": "Buscar Inventario",


    "section.featured": "Inventario Destacado",
    "section.newArrivals": "Nuevos Ingresos",
    "section.viewAll": "Ver Todo",
    "section.services": "Nuestros Servicios",
    "section.servicesSub": "Todo lo que necesitas para manejar feliz — en un solo lugar.",
    "about.title": "Sobre US Star Auto Sale",
    "about.subtitle": "Tu socio de confianza para vehículos de calidad y financiamiento flexible en todo Estados Unidos.",
    "about.p1": "US Star Auto Sale es un concesionario enfocado en el cliente, dedicado a ayudar a las personas a encontrar vehículos confiables y de alta calidad a precios competitivos. Creemos que comprar un auto debe ser simple, transparente y sin estrés.",
    "about.p2": "Con acceso a múltiples prestamistas a nivel nacional, ofrecemos opciones de financiamiento flexibles para todo tipo de crédito — bueno, malo o sin crédito.",
    "about.applyBtn": "Solicitar Financiamiento",
    "about.browseBtn": "Ver Inventario",
    "about.stat.sold": "Autos Vendidos",
    "about.stat.approval": "Proceso de Aprobación",
    "about.stat.fast": "Rápido",
    "about.stat.network": "Red de Prestamistas",
    "about.stat.nationwide": "Nacional",

    "svc.ship.title": "Envío Nacional",
    "svc.ship.text": "Llama y obtén una cotización rápida de envío a cualquier parte de EE. UU.",
    "svc.ship.btn": "Llamar para Cotizar",
    "svc.finance.title": "Opciones de Financiamiento",
    "svc.finance.text": "Financiamiento flexible adaptado a ti, con aprobación fácil para todo tipo de crédito.",
    "svc.finance.btn": "Solicitar Ahora",
    "svc.test.title": "Prueba de Manejo",
    "svc.test.text": "Agenda una prueba de manejo y siente tu auto antes de comprar.",
    "svc.test.btn": "Agendar Prueba",
    "svc.trade.title": "Intercambio",
    "svc.trade.text": "Obtén el mejor valor por tu vehículo actual para tu próximo auto.",
    "svc.trade.btn": "Obtener Valor",

    "lead.title": "¿No encuentras el vehículo ideal? Lo encontramos por ti.",
    "lead.text": "Dinos qué buscas y nuestro equipo te conectará con las mejores opciones de nuestra red nacional — a menudo en 24 horas.",
    "lead.point1": "Financiamiento para todo tipo de crédito",
    "lead.point2": "Reportes CARFAX disponibles",
    "lead.point3": "Envío de vehículos a nivel nacional",
    "lead.cardTitle": "Solicitar Más Información",
    "lead.cardSub": "Sin compromiso · Respondemos rápido",
    "lead.firstName": "Nombre",
    "lead.lastName": "Apellido",
    "lead.phone": "Número de teléfono",
    "lead.email": "Correo electrónico",
    "lead.vehicle": "Vehículo de interés (marca / modelo)",
    "lead.message": "¿Algo más que debamos saber? (presupuesto, intercambio, fecha…)",
    "lead.send": "Enviar Solicitud",
    "lead.sending": "Enviando…",
    "lead.ok": "¡Gracias! Recibimos tu solicitud y te contactaremos pronto.",

    "inv.title": "Inventario de Vehículos",
    "inv.subtitle": "Knoxville, TN · Vehículos Premium Seminuevos",
    "inv.available": "Disponibles",
    "inv.sold": "Vendidos",
    "inv.all": "Todos",
    "inv.new": "Nuevos Ingresos",
    "inv.used": "Usados",

    "footer.hours": "Horario",
    "footer.address": "Dirección",
    "footer.email": "Correo",
    "footer.quickLinks": "Enlaces Rápidos",
    "footer.rights": "Todos los derechos reservados",

    "cta.viewInventory": "Ver Inventario",

    "trust.inspected": "Inspección de Calidad",
    "trust.inspectedSub": "Cada vehículo revisado antes de publicarse",

    "browse.eyebrow": "Empieza aquí",
    "browse.title": "Explora nuestro inventario",
    "browse.byPrice": "Por precio",
    "browse.byStyle": "Por tipo de carrocería",
    "browse.byMake": "Por marca",
    "browse.vehicle": "vehículo",
    "browse.vehicles": "vehículos",

    "section.justIn": "Recién llegados",
    "section.inStock": "Disponible ahora",
    "section.howWeHelp": "Cómo te ayudamos",

    "reviews.eyebrow": "Lo que dicen los clientes",
    "reviews.title": "Opiniones de Clientes",
    "reviews.readAll": "Ver todas las opiniones",
    "reviews.fallback": "Nuestros clientes dejan sus opiniones en Google, CARFAX y CarGurus. Lee lo que dicen sobre comprar en US Star Auto Sale — o deja la tuya.",

    "about.eyebrow": "Sobre nosotros",
    "about.stat.inStock": "Vehículos en Inventario",

    "svc.credit.title": "Solicitud de Crédito en Línea",
    "svc.credit.text": "Aplica en nuestro portal seguro y recibe una respuesta sin venir al lote.",
    "svc.credit.btn": "Iniciar solicitud",
    "svc.history.title": "Historial del Vehículo",
    "svc.history.text": "Reporte CARFAX o AutoCheck disponible a solicitud para cualquier vehículo del inventario.",
    "svc.history.btn": "Solicitar reporte",

    "legal.priceDisclaimer": "Los precios no incluyen impuestos, título, placas ni la cuota de documentación del concesionario. Los vehículos se venden \u201cas-is\u201d; la disponibilidad y los precios pueden cambiar. El millaje y el equipamiento se consideran correctos pero no están garantizados — verifícalos con nuestro equipo.",

    "brands.label": "Marcas disponibles",

    "fin.eyebrow": "Financiamiento",
    "fin.title": "Aprobación en minutos — todo tipo de crédito.",
    "fin.text": "Trabajamos con una red nacional de prestamistas, así que poco historial o problemas de crédito no te detienen. Aplica en línea y la mayoría recibe respuesta el mismo día.",
    "fin.point1": "Buen crédito, mal crédito, primer comprador — todos bienvenidos",
    "fin.point2": "Consulta suave para ver opciones, sin afectar tu crédito",
    "fin.point3": "Enganches bajos y plazos flexibles",
    "fin.point4": "El valor de tu intercambio se aplica al enganche",
    "fin.portalBtn": "Portal Seguro",
    "fin.step1.title": "Cuéntanos sobre ti",
    "fin.step1.text": "Un formulario corto — ingresos, empleo y el vehículo que te interesa. Unos cinco minutos.",
    "fin.step2.title": "Buscamos tu mejor opción",
    "fin.step2.text": "Nuestro equipo envía tu solicitud a varios prestamistas y regresa con la mejor oferta.",
    "fin.step3.title": "Firma y maneja",
    "fin.step3.text": "Revisa los términos, elige tu pago y llévate el vehículo el mismo día.",

    "reviews.titleCount": "¡Más de {n} clientes satisfechos y contando!",
    "reviews.sub": "Opiniones reales de personas que compraron su vehículo en US Star Auto Sale.",
    "reviews.prev": "Opinión anterior",
    "reviews.next": "Siguiente opinión",

    "hero.titleA": "Autos usados de calidad en",
    "hero.titleB": "Knoxville, TN",
    "hero.subtext": "{n} vehículos inspeccionados disponibles ahora — con financiamiento para todo tipo de crédito y reporte de historial en cada publicación.",
    "hero.subtextPlain": "Vehículos inspeccionados, financiamiento para todo tipo de crédito y reporte de historial en cada publicación.",
    "hero.stat.inStock": "Vehículos disponibles",
    "hero.stat.allCredit": "Tipos de crédito",
    "hero.stat.allCreditV": "Todos",
    "hero.stat.history": "Historial del vehículo",
    "hero.stat.historyV": "CARFAX",
    "hero.scroll": "Desliza",

    "search.barTitle": "Encuentra tu vehículo",

    "faq.eyebrow": "Preguntas",
    "faq.title": "Comprar un auto aquí — sin rodeos.",
    "faq.sub": "Lo que más nos preguntan los compradores en Knoxville. Si tu duda no está aquí, llámanos o mándanos un mensaje.",
    "faq.credit.q": "¿Puedo financiar con mal crédito o sin historial?",
    "faq.credit.a": "Sí. Enviamos tu solicitud a una red nacional de prestamistas que incluye programas para crédito bajo y primeros compradores, así que poco historial, una repossession o una bancarrota no te descalifican automáticamente. Los términos dependen del prestamista, el vehículo y tus ingresos — te decimos exactamente para qué calificas antes de que vengas.",
    "faq.bring.q": "¿Qué necesito traer para la aprobación?",
    "faq.bring.a": "Licencia de conducir vigente, comprobante de ingresos (talones de pago o estados de cuenta), comprobante de domicilio (un recibo o contrato de renta), comprobante de seguro y tu enganche. Algunos prestamistas también piden referencias o un teléfono a tu nombre.",
    "faq.down.q": "¿Cuánto necesito de enganche?",
    "faq.down.a": "Depende del vehículo, del prestamista y de tu perfil de crédito — no hay una cifra única. Aplica en línea o llámanos y te damos el enganche exacto que pide tu aprobación antes de que hagas el viaje.",
    "faq.trade.q": "¿Aceptan intercambios?",
    "faq.trade.a": "Sí. Valuamos tu vehículo actual y aplicamos su valor directamente a tu enganche, e incluso puedes intercambiar un vehículo que aún debes. Empieza con nuestro formulario en línea para un estimado gratis y sin compromiso.",
    "faq.history.q": "¿Puedo ver el historial del vehículo antes de comprar?",
    "faq.history.a": "Sí. Hay un reporte CARFAX o AutoCheck disponible a solicitud para cualquier vehículo de nuestro inventario. Pídenos el reporte de la unidad que te interesa y te lo enviamos.",
    "faq.asis.q": "¿Los vehículos se venden \u201cas-is\u201d o tienen garantía?",
    "faq.asis.a": "Nuestros vehículos se venden as-is salvo que se incluya una garantía por escrito en tus documentos de venta. En muchas unidades hay contratos de servicio extendido disponibles — pregúntanos cuáles califican y cuánto cuesta la cobertura.",
    "faq.inspect.q": "¿Puedo llevarlo con mi propio mecánico?",
    "faq.inspect.a": "Por supuesto, y lo recomendamos. Agenda una inspección previa a la compra con un taller de tu confianza antes de firmar — solo avísanos para tener el vehículo listo.",
    "faq.fees.q": "¿El precio anunciado incluye impuestos y cuotas?",
    "faq.fees.a": "No. Los precios anunciados no incluyen impuesto sobre la venta, título, placas y registro, ni la cuota de documentación del concesionario. Pídenos el precio final y desglosamos cada línea antes de firmar.",
    "faq.ship.q": "Vivo en otro estado — ¿puedo comprarles?",
    "faq.ship.a": "Sí. Trabajamos con compradores en todo Estados Unidos y podemos coordinar el envío a tu puerta. Llámanos o mándanos un mensaje con la unidad y tu código postal y te cotizamos la entrega.",
    "faq.apply.q": "¿Puedo aplicar al financiamiento antes de visitarlos?",
    "faq.apply.a": "Sí — es la forma más rápida de comprar. La solicitud en línea toma unos cinco minutos y la mayoría recibe respuesta el mismo día hábil, así que llegas sabiendo tu presupuesto y tus términos.",

    "reviews.basedOn": "Basado en {n} opiniones de Google",
    "reviews.write": "Déjanos una opinión",
  },
};

const LangContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved === "en" || saved === "es") return saved;
      if ((navigator.language || "").toLowerCase().startsWith("es")) return "es";
    } catch { /* ignore */ }
    return "en";
  });

  useEffect(() => {
    try { localStorage.setItem(KEY, lang); } catch { /* ignore */ }
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l) => setLangState(l), []);
  const t = useCallback(
    (key) => (STRINGS[lang] && STRINGS[lang][key]) || STRINGS.en[key] || key,
    [lang],
  );

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) return { lang: "en", setLang: () => {}, t: (k) => STRINGS.en[k] || k };
  return ctx;
}
