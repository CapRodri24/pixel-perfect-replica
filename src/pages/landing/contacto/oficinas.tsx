import { MapPin, Phone, MessageCircle, ArrowUpRight, Mail, Heart, Trees } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "@/i18n/I18nProvider";
import { ContactPage } from "./comun";

const channels = [
  { es: "Información general", en: "General information", value: "armonia@armonia-bo.org", href: "mailto:armonia@armonia-bo.org", icon: Mail },
  { es: "Donaciones", en: "Donations", value: "tboorsma@armonia-bo.org", href: "mailto:tboorsma@armonia-bo.org", icon: Heart },
  { es: "Ecoturismo", en: "Ecotourism", value: "reservations@armonia-bo.org", href: "mailto:reservations@armonia-bo.org", icon: Trees },
  { es: "WhatsApp", en: "WhatsApp", value: "+591 72149863", href: "https://wa.me/59172149863", icon: MessageCircle },
] as const;
const offices = [
  { city: "Cochabamba", address: "Calle Fausto Reynaga entre Pantaleón Dalence y 27 de Julio – Colcapirhua – Cochabamba", phone: "72130361", whatsapp: "71091062", map: "https://www.google.com/maps/place/Asociaci%C3%B3n+Civil+Armon%C3%ADa/@-17.384461,-66.2196773,296m/data=!3m1!1e3!4m12!1m5!3m4!2zMTfCsDIzJzA0LjQiUyA2NsKwMTMnMDYuMSJX!8m2!3d-17.3845556!4d-66.2183611!3m5!1s0x93e3730036686db3:0xf8fe3caf621b5723!8m2!3d-17.3845564!4d-66.2184627!16s%2Fg%2F11lnwv7yfv?hl=en&entry=ttu" },
  { city: "Santa Cruz", address: "Avenida Lomas de Arena Nº 400. Barrio Palmira 8. Zona Palmasola. Casilla de correo 3566. Santa Cruz de la Sierra, Bolivia", phone: "72149863", whatsapp: "72149863", map: "https://www.google.com/maps/place//@-17.875953,-63.1928139,14.96z/data=!4m6!1m5!3m4!2zMTfCsDUyJzM5LjgiUyA2M8KwMTEnMDguMiJX!8m2!3d-17.877723!4d-63.1856078?entry=ttu" },
  { city: "Trinidad", address: "Av. Principal N°10 Urbanización El Palmar", phone: "72149863", whatsapp: "72149863", map: "https://maps.app.goo.gl/gWu8LxgDWmXtwXsYA" },
] as const;

export function CanalesContacto() {
  const {lang} = useI18n(); const es = lang === "es";
  return <section id="donaciones" className="section"><div className="container-site">
    <h2 className="font-display text-3xl font-bold text-brand-deep sm:text-4xl">{es ? "Estamos para ayudarte" : "We are here to help"}</h2>
    <p className="mt-4 max-w-4xl text-lg leading-relaxed text-muted-foreground">{es ? "Póngase en contacto con nosotros para cualquier información sobre el apoyo a la conservación de la biodiversidad en Bolivia o si desea visitar nuestras reservas naturales. Estaremos encantados de ayudarle." : "Please contact us for any information about supporting biodiversity conservation in Bolivia or if you would like to visit our nature reserves. We will be happy to help."}</p>
    <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{channels.map(({es:label,en,value,href,icon:Icon}) => <a key={value} href={href} target={href.startsWith("https:") ? "_blank" : undefined} rel={href.startsWith("https:") ? "noopener noreferrer" : undefined} className="group min-w-0 rounded-3xl border border-border bg-background p-6 shadow-card transition-all hover:border-primary motion-safe:hover:-translate-y-1">
      <span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary"><Icon className="size-6"/></span><h3 className="mt-4 font-display text-xl font-bold text-brand-deep">{es ? label : en}</h3><p className="mt-2 break-all text-base text-muted-foreground">{value}</p><span className="mt-4 inline-flex items-center gap-2 font-semibold text-primary">{href.startsWith("mailto:") ? (es ? "Escribir correo" : "Send email") : (es ? "Enviar mensaje" : "Send message")}<ArrowUpRight className="size-4"/></span>
    </a>)}</div>

  </div></section>;
}

export function TarjetasOficinas() {
  const {lang} = useI18n(); const es = lang === "es";
  return <>
    <div className="grid gap-6 lg:grid-cols-3">{offices.map(office => <article key={office.city} className="flex min-w-0 flex-col overflow-hidden rounded-3xl border border-border bg-background shadow-card">
      <div className="flex items-center gap-3 bg-primary p-6 text-primary-foreground"><MapPin className="size-7 shrink-0"/><h2 className="font-display text-2xl font-bold">{office.city}</h2></div>
      <div className="flex flex-1 flex-col p-6"><h3 className="font-bold text-brand-deep">{es ? "Dirección" : "Address"}</h3><p className="mt-2 leading-relaxed text-muted-foreground">{office.address}</p><h3 className="mt-5 font-bold text-brand-deep">{es ? "Teléfono corporativo" : "Office phone"}</h3><a href={`tel:+591${office.phone}`} className="mt-2 inline-flex items-center gap-2 text-primary hover:underline"><Phone className="size-5"/>+591 {office.phone}</a><div className="mt-6 flex flex-1 flex-col justify-end gap-3"><a href={office.map} target="_blank" rel="noopener noreferrer" className="armonia-subindice inline-flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 font-semibold text-primary hover:bg-secondary"><MapPin className="size-5"/>{es ? "Ver ubicación" : "View location"}<ArrowUpRight className="size-4"/></a><a href={`https://wa.me/591${office.whatsapp}`} target="_blank" rel="noopener noreferrer" className="armonia-subindice inline-flex flex-wrap items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 font-semibold text-primary hover:bg-secondary"><MessageCircle className="size-5"/>WhatsApp <span>+591 {office.whatsapp}</span></a></div></div>
    </article>)}</div>
    <p className="mt-6 text-muted-foreground">{es ? "Consulta previamente los horarios y la disponibilidad de atención." : "Please enquire about opening hours and availability in advance."}</p>
    <Link to="/contacto#consultas" className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground">{es ? "Realizar una consulta" : "Make an enquiry"}</Link>
  </>;
}

export default function Oficinas() {
  const {lang} = useI18n(); const es = lang === "es";
  return <ContactPage title={es ? "Oficinas" : "Offices"} description={es ? "Conoce nuestros canales de atención institucional." : "Find our institutional contact channels."}><TarjetasOficinas/></ContactPage>;
}
