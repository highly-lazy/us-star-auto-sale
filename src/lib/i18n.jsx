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
    "hero.subtext": "Shop our curated inventory, schedule a test drive, and get pre‑approved — fast.",
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

    // promo marquee
    "promo.1": "🔥 Financing for ALL credit types — good, bad or none",
    "promo.2": "🚗 Quality‑inspected vehicles with CARFAX",
    "promo.3": "💳 Fast pre‑approval in minutes",
    "promo.4": "🚚 Nationwide shipping available",
    "promo.5": "⭐ Top‑rated CarGurus dealer in Knoxville, TN",
    "promo.6": "✅ Drive today — low down payments",

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
    "lead.ok": "✅ Thank you! We received your request and will be in touch shortly.",

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
    "hero.subtext": "Explora nuestro inventario, agenda una prueba de manejo y obtén pre‑aprobación — rápido.",
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

    "promo.1": "🔥 Financiamiento para TODO tipo de crédito — bueno, malo o ninguno",
    "promo.2": "🚗 Vehículos inspeccionados con CARFAX",
    "promo.3": "💳 Pre‑aprobación rápida en minutos",
    "promo.4": "🚚 Envío disponible a todo el país",
    "promo.5": "⭐ Distribuidor mejor calificado en CarGurus, Knoxville, TN",
    "promo.6": "✅ Maneja hoy — enganches bajos",

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
    "lead.ok": "✅ ¡Gracias! Recibimos tu solicitud y te contactaremos pronto.",

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
