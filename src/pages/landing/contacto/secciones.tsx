import { Heart, Trees, Newspaper, ShoppingBag, MapPin, ArrowUpRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "@/i18n/I18nProvider";
export const contactSections = [
 {id:"donaciones",es:"Donaciones y membresía",en:"Donations & membership",icon:Heart},
 {id:"turismo",es:"Turismo y reservas",en:"Tourism & reserves",icon:Trees},
 {id:"prensa",es:"Contacto prensa",en:"Press contact",icon:Newspaper},
 {id:"souvenirs",es:"Souvenirs",en:"Souvenirs",icon:ShoppingBag},
 {id:"oficinas",es:"Oficinas",en:"Offices",icon:MapPin},
 {id:"guiadecampoaves",es:"Guía de campo Aves de Bolivia",en:"Birds of Bolivia field guide",icon:BookOpen},
] as const;
const links = {turismo:"visitanuestrasreservas",prensa:"prensa",souvenirs:"souvenirs",oficinas:"oficinas",guiadecampoaves:"guiadecampoaves"} as const;
const descriptions = {
  donaciones: {es:"Tu aporte ayuda a proteger las aves y sus hábitats en Bolivia.",en:"Your contribution helps protect Bolivia’s birds and their habitats."},
  oficinas: {es:"Encuentra nuestras oficinas en Cochabamba, Santa Cruz y Trinidad, sus direcciones y canales de contacto.",en:"Find our offices in Cochabamba, Santa Cruz and Trinidad, their addresses and contact details."},
} as const;
export default function SeccionesContacto() {
  const {lang} = useI18n();
  const es = lang === "es";
  return <div className="bg-muted/40"><div className="container-site py-12">
    <div className="grid gap-5 md:grid-cols-2">
      {contactSections.filter(s => s.id === "donaciones" || s.id === "oficinas").map(s => {
        const Icon = s.icon;
        const donation = s.id === "donaciones";
        return <Link key={s.id} id={donation ? "apoyanos" : "oficinas"} to={donation ? "/donar" : "/contacto/oficinas"} className={`group relative isolate flex min-h-64 flex-col items-start justify-end overflow-hidden rounded-3xl p-7 text-white shadow-card sm:p-9 ${donation ? "bg-[#226344]" : "bg-[#185e91]"}`}>
          <div className="absolute inset-0 -z-10 bg-linear-to-br from-white/10 to-black/15"/>
          <Icon className="absolute right-6 top-6 size-24 opacity-10" aria-hidden="true"/>
          <span className="grid size-12 place-items-center rounded-2xl bg-white/15"><Icon className="size-6"/></span>
          <h2 className="mt-5 font-display text-3xl font-bold">{donation ? (es ? "Apoya la conservación" : "Support conservation") : (es ? "Nuestras oficinas" : "Our offices")}</h2>
          <p className="mt-3 max-w-lg text-white/95 leading-relaxed">{es ? descriptions[s.id].es : descriptions[s.id].en}</p>
          <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-semibold text-[#185e91]">{donation ? (es ? "Cómo donar" : "How to donate") : (es ? "Conoce nuestras oficinas" : "Explore our offices")}<ArrowUpRight className="size-5 transition-transform group-hover:translate-x-1"/></span>
        </Link>;
      })}
    </div>
    <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {contactSections.filter(s => s.id !== "donaciones" && s.id !== "oficinas").map(s => {
        const Icon = s.icon;
        return <section key={s.id} id={s.id} className="rounded-3xl border border-border bg-background p-6"><Icon className="size-8 text-primary"/><h2 className="mt-4 font-display text-2xl text-brand-deep">{es ? s.es : s.en}</h2><Link to={`/contacto/${links[s.id]}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">{es ? "Conocer más" : "Learn more"}<ArrowUpRight className="size-4"/></Link></section>;
      })}
    </div>
  </div></div>;
}
