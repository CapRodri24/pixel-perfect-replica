import { useEffect, useState } from "react";
import { Users, Landmark, Handshake, UserRound } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { listarNosotros, listarCategorias, type Profile, type Category, type Role } from "@/api/nosotrosApi";

const sections = {
  "junta-directiva": {id:"junta-directiva",es:"Junta directiva",en:"Board of directors",icon:Landmark},
  equipo: {id:"equipo",es:"Nuestro equipo",en:"Our team",icon:Users},
  socios: {id:"socios",es:"Socios y aliados",en:"Partners and allies",icon:Handshake},
};
const partnerSections = [
  {id:"socios_financieros",anchor:"socios-financieros",es:"Socios financieros",en:"Funding partners"},
  {id:"aliados_estrategicos",anchor:"aliados-estrategicos",es:"Aliados estratégicos",en:"Strategic allies"},
  {id:"miembros_corporativos",anchor:"miembros-corporativos",es:"Miembros corporativos",en:"Corporate members"},
];
function Foto({p}:{p:Profile}){const [failed,setFailed]=useState(false);useEffect(()=>setFailed(false),[p.image]);return <div className={`relative grid w-full place-items-center overflow-hidden bg-secondary ${p.category==="socios"?"aspect-[16/10]":"aspect-[4/3]"}`}><UserRound className="absolute size-12 text-muted-foreground" aria-hidden="true"/>{!failed&&p.image&&<img src={p.image} alt={p.name} loading="lazy" onError={()=>setFailed(true)} className={`relative size-full bg-secondary ${p.category==="socios"?"object-contain p-6":"object-cover"}`}/>}</div>;}
function Cards({items,es}:{items:Profile[];es:boolean}){return <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{items.map(p=><article key={p.id} className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm"><Foto p={p}/><div className="space-y-2 p-5"><h3 className="font-display text-xl font-bold text-brand-deep">{p.name}</h3>{p.category==="equipo"&&<p className="text-sm font-semibold text-primary">{es?p.role:p.roleEn||p.role}</p>}<p className="whitespace-pre-line text-sm leading-relaxed text-foreground">{es?p.description:p.descriptionEn||p.description}</p></div></article>)}</div>;}
export default function NosotrosRegistros({category}:{category:Category}){
 const {lang}=useI18n();const es=lang==="es";const section=sections[category];const Icon=section.icon;
 const [items,setItems]=useState<Profile[]>([]);const [categories,setCategories]=useState<Role[]>([]);const [loading,setLoading]=useState(true);const [error,setError]=useState(false);const [attempt,setAttempt]=useState(0);
 useEffect(()=>{let active=true;setLoading(true);setError(false);Promise.all([listarNosotros(),category==="socios"?listarCategorias():Promise.resolve([] as Role[])]).then(([rows,cats])=>{if(active){setItems(rows.filter(p=>p.category===category));setCategories(cats);}}).catch(()=>{if(active)setError(true);}).finally(()=>{if(active)setLoading(false);});return()=>{active=false;};},[category,attempt]);
 return <section id={section.id} className="scroll-mt-28 border-b border-border py-12 sm:py-16"><div className="container-site space-y-7"><div className="flex items-center gap-3"><Icon className="size-7 text-primary"/><h2 className="font-display text-3xl text-brand-deep sm:text-4xl">{es?section.es:section.en}</h2></div>
 {loading?<p role="status" className="text-muted-foreground">{es?"Cargando información…":"Loading information…"}</p>:error?<div role="status" className="rounded-xl border border-border p-5"><p>{es?"No se pudo cargar la información en este momento.":"Information could not be loaded right now."}</p><button type="button" className="mt-3 rounded-xl bg-primary px-4 py-2 text-primary-foreground" onClick={()=>setAttempt(v=>v+1)}>{es?"Reintentar":"Try again"}</button></div>:category!=="socios"?items.length?<Cards items={items} es={es}/>:<p className="text-muted-foreground">{es?"Todavía no hay información disponible.":"No information is available yet."}</p>:null}
 {category==="socios"&&partnerSections.map(c=>{const label=categories.find(x=>x.id===c.id);const records=items.filter(p=>p.partnerCategory===c.id);return <div key={c.id} id={c.anchor} className="scroll-mt-28 space-y-4"><h3 className="font-display text-2xl text-brand-deep">{es?label?.name||c.es:label?.nameEn||c.en}</h3>{!loading&&!error&&(records.length?<Cards items={records} es={es}/>:<p className="text-muted-foreground">{es?"Todavía no hay información disponible.":"No information is available yet."}</p>)}</div>;})}
 </div></section>;
}
