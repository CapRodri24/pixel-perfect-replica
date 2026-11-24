import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, ImageOff } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { imagenNoticiaUrl, listarNoticiasPublicas, type NoticiaPublicaResumen } from "@/api/noticiasPublicasApi";

export type NewsItem = { id: string; category: string; categoryLabel: string; title: string; text: string; date: string; image: string; programId: string | null };
export function fechaNoticia(fecha: string, es: boolean) {
  // El servidor entrega la fecha civil de Bolivia, sin convertirla a UTC.
  const [y,m,d] = fecha.slice(0,10).split("-");
  if (!y || !m || !d) return "";
  return es ? `${d}/${m}/${y}` : `${m}/${d}/${y}`;
}
function textoPlano(html: string) { return new DOMParser().parseFromString(html,"text/html").body.textContent?.trim() || ""; }
export function useNoticiasPublicas() {
  const { lang } = useI18n(); const es = lang === "es";
  const [data,setData] = useState<NoticiaPublicaResumen[]>([]);
  const [estado,setEstado] = useState<"cargando"|"listo"|"error">("cargando");
  const [intento,setIntento] = useState(0);
  useEffect(() => {
    const controller = new AbortController(); setEstado("cargando");
    listarNoticiasPublicas(controller.signal).then(rows=>{if(!controller.signal.aborted){setData(rows);setEstado("listo");}}).catch(()=>{if(!controller.signal.aborted)setEstado("error");});
    return ()=>controller.abort();
  },[intento]);
  const items: NewsItem[] = data.map(n=>({id:n.id_noticia,category:n.id_categoria_noticia,categoryLabel:es?n.categoria_es:n.categoria_en,title:es?n.titulo_es:n.titulo_en,text:textoPlano((es?n.descripcion_es:n.descripcion_en)||""),date:n.fecha_publicacion,image:imagenNoticiaUrl(n.id_imagen_portada),programId:n.id_programa}));
  return {items,estado,reintentar:()=>setIntento(n=>n+1)};
}
export function useNewsItems() { return useNoticiasPublicas().items; }
export function NewsCard({item,featured=false}:{item:NewsItem;featured?:boolean}) {
  const {lang}=useI18n();const es=lang==="es";
  const [fallo,setFallo]=useState(false);
  useEffect(()=>setFallo(false),[item.image]);
  return <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-background transition-all duration-300 hover:border-primary/50 hover:shadow-card">
    <Link to={`/noticias/${encodeURIComponent(item.id)}`} className={`relative block overflow-hidden bg-muted ${featured?"aspect-[16/7]":"aspect-[16/10]"}`}>
      {item.image&&!fallo?<img src={item.image} alt={item.title} loading="lazy" decoding="async" className="size-full object-cover transition-transform duration-500 group-hover:scale-105" onError={()=>setFallo(true)}/>:<div className="grid size-full place-items-center text-muted-foreground"><ImageOff className="size-10 opacity-40" aria-hidden="true"/></div>}
      <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">{item.categoryLabel}</span>
    </Link>
    <div className="flex flex-1 flex-col p-5"><span className="flex items-center gap-2 text-xs text-muted-foreground"><CalendarDays className="size-4"/>{fechaNoticia(item.date,es)}</span>
      <h3 className="mt-3 font-display text-xl leading-tight text-brand-deep sm:text-2xl"><Link to={`/noticias/${encodeURIComponent(item.id)}`}>{item.title}</Link></h3>
      {item.text&&<p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{item.text}</p>}
      <Link to={`/noticias/${encodeURIComponent(item.id)}`} className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-primary hover:underline">{es?"Leer más":"Read more"}<ArrowRight className="size-4"/></Link>
    </div>
  </article>;
}
export function RelatedNews({programId}:{programId:string}) {
  const {lang}=useI18n();const es=lang==="es";const {items,estado,reintentar}=useNoticiasPublicas();
  const related=items.filter(n=>n.programId===programId);
  if(estado==="cargando" || (estado==="listo"&&!related.length)) return null;
  return <section className="mt-12 border-t border-border pt-8" id="noticias-relacionadas"><h2 className="font-display text-2xl text-brand-deep sm:text-3xl">{es?"Noticias relacionadas":"Related news"}</h2>
    {estado==="error"?<div className="mt-4 rounded-xl bg-muted p-4 text-sm text-muted-foreground" role="status">{es?"No se pudieron cargar las noticias relacionadas.":"Related news could not be loaded."} <button type="button" onClick={reintentar} className="font-semibold text-primary underline">{es?"Reintentar":"Try again"}</button></div>:<div className="mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 sm:grid sm:grid-cols-2 sm:overflow-visible">{related.map(item=><div key={item.id} className="w-[86%] shrink-0 snap-center sm:w-auto"><NewsCard item={item}/></div>)}</div>}
  </section>;
}
