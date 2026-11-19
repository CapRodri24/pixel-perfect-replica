import { Heart, Users, Trees, Newspaper, ShoppingBag, MapPin, ArrowUpRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "@/i18n/I18nProvider";
import { DonationForm } from "@/components/DonationForm";
export const contactSections = [
 {id:"donaciones",es:"Donaciones y membresía",en:"Donations & membership",icon:Heart},
 {id:"turismo",es:"Turismo y reservas",en:"Tourism & reserves",icon:Trees},
 {id:"prensa",es:"Contacto prensa",en:"Press contact",icon:Newspaper},
 {id:"souvenirs",es:"Souvenirs",en:"Souvenirs",icon:ShoppingBag},
 {id:"oficinas",es:"Oficinas",en:"Offices",icon:MapPin},
 {id:"guiadecampoaves",es:"Guía de campo Aves de Bolivia",en:"Birds of Bolivia field guide",icon:BookOpen},
] as const;
const links = {turismo:"visitanuestrasreservas",prensa:"prensa",souvenirs:"souvenirs",oficinas:"oficinas",guiadecampoaves:"guiadecampoaves"} as const;
export default function SeccionesContacto(){const {lang}=useI18n();const es=lang==="es";return <><section id="donaciones" className="section"><div className="container-site grid items-start gap-8 lg:grid-cols-[1fr_1.1fr]"><div className="rounded-3xl bg-secondary p-6 sm:p-10"><Users className="size-10 text-primary"/><h2 className="mt-5 font-display text-3xl text-brand-deep">{es?"Hazte miembro":"Become a member"}</h2><p className="mt-4 text-muted-foreground">{es?"Elige tu plan y forma parte de nuestra comunidad de conservación.":"Choose your plan and join our conservation community."}</p><Link to="/contacto/haztemiembro" className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">{es?"Conocer los planes":"Explore plans"}</Link></div><div className="min-w-0 rounded-3xl border border-border bg-background p-4 shadow-card sm:p-8"><DonationForm/></div></div></section><div className="bg-muted/40"><div className="container-site grid gap-5 py-12 sm:grid-cols-2 lg:grid-cols-3">{contactSections.filter(s=>s.id!=="donaciones").map(s=>{const Icon=s.icon;return <section key={s.id} id={s.id} className="rounded-3xl border border-border bg-background p-6"><Icon className="size-8 text-primary"/><h2 className="mt-4 font-display text-2xl text-brand-deep">{es?s.es:s.en}</h2><Link to={`/contacto/${links[s.id]}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">{es?"Conocer más":"Learn more"}<ArrowUpRight className="size-4"/></Link></section>})}</div></div></>;}
