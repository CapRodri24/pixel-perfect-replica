import { useEffect, useState, type ReactNode, type FormEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { Button } from "@/components/ui/button";
export const field = "mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring";
export function ContactPage({title,description,children}: {title:string;description:string;children:ReactNode}) {
 const {lang}=useI18n(); const {pathname}=useLocation();
 useEffect(()=>{window.scrollTo({top:0,behavior:"instant"});},[pathname]);
 return <main className="min-h-[70vh]"><header className="bg-secondary"><div className="container-site py-10 sm:py-16"><Link to="/contacto" className="inline-flex items-center gap-2 text-sm font-semibold text-primary"><ArrowLeft className="size-4"/>{lang==="es"?"Volver a contacto":"Back to contact"}</Link><h1 className="mt-5 font-display text-4xl text-brand-deep sm:text-6xl">{title}</h1><p className="mt-3 max-w-3xl text-lg text-muted-foreground">{description}</p></div></header><div className="container-site py-10 sm:py-14">{children}</div></main>;
}
export function DemoForm({title,children,submitLabel}: {title:string;children?:ReactNode;submitLabel:string}) {
 const {lang}=useI18n(); const es=lang==="es"; const [done,setDone]=useState(false);
 function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();setDone(true);}
 return <form onSubmit={submit} className="rounded-3xl border border-border bg-background p-5 shadow-card sm:p-8"><h2 className="font-display text-2xl text-brand-deep">{title}</h2><p className="mt-2 text-xs text-muted-foreground">{es?"Formulario de prueba. No se envían ni se guardan datos.":"Demo form. No data is sent or stored."}</p><div className="mt-6 grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium sm:col-span-2">{es?"Nombre completo":"Full name"}<input required name="name" autoComplete="name" className={field}/></label><label className="text-sm font-medium">{es?"Correo electrónico":"Email"}<input required type="email" name="email" autoComplete="email" className={field}/></label><label className="text-sm font-medium">{es?"Teléfono":"Phone"}<input required type="tel" name="phone" autoComplete="tel" className={field}/></label>{children}<label className="flex items-start gap-2 text-sm sm:col-span-2"><input required type="checkbox" className="mt-1 accent-primary"/>{es?"Entiendo que esta es una demostración sin registro real.":"I understand this is a demonstration without real registration."}</label><Button type="submit" variant="hero" className="w-fit rounded-full sm:col-span-2">{submitLabel}</Button>{done&&<p role="status" className="flex items-center gap-2 text-sm text-primary sm:col-span-2"><CheckCircle2 className="size-5 shrink-0"/>{es?"Solicitud de prueba completada. No se realizó ningún registro ni cobro.":"Demo request completed. No registration or payment was made."}</p>}</div></form>;
}
