import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CalendarDays, Camera, PenLine } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import type { BloquePublico } from "@/api/paisajesPublicosApi";
import { obtenerNoticiaPublica, imagenNoticiaUrl, type NoticiaPublicaDetalle } from "@/api/noticiasPublicasApi";
import { EditorialContent, type EditorialBlock } from "./formato_programa";
import { youtubeId } from "@/lib/enlaces";
import { fechaNoticia } from "./noticias-publicas";
function textoPlano(valor: string) {
  return new DOMParser().parseFromString(valor, "text/html").body.textContent?.trim() || "";
}
function bloquesEditoriales(bloques: BloquePublico[], es: boolean): EditorialBlock[] {
  const out: EditorialBlock[] = [];
  const leyenda = (...values: (string | null | undefined)[]) => values.filter(Boolean).join(" · ");
  for (const b of bloques) {
    const text = (es ? b.texto_es : b.texto_en) || "";
    const pie = (es ? b.pie_es : b.pie_en) || "";
    switch (b.tipo) {
      case "parrafo": out.push({type:"paragraph",text,html:true}); break;
      case "subtitulo": out.push({type:"heading",text:textoPlano(text)}); break;
      case "imagen": out.push({type:"image",src:imagenNoticiaUrl(b.id_imagen)||"",alt:pie,caption:leyenda(pie,b.imagen?.credito)}); break;
      case "carrusel": out.push({type:"gallery",images:(b.imagenes||[]).map(f=>({src:imagenNoticiaUrl(f.id_imagen)||"",alt:(es?f.pie_es:f.pie_en)||pie,caption:leyenda((es?f.pie_es:f.pie_en)||pie,f.credito)}))}); break;
      case "enlace": case "video": {
        if (!b.url) break;
        try {
          const url = new URL(b.url);
          if (!["https:", "http:"].includes(url.protocol)) break;
          const id = youtubeId(url);
          if (id) {
            const video = {id,title:"YouTube"};
            const last = out[out.length-1];
            if (last?.type === "videos") last.videos.push(video);
            else out.push({type:"videos",videos:[video]});
          } else out.push({type:"embed",url:url.href}); // SoundCloud, Genially, PDF o página web
        } catch { /* URL inválida: omitir */ }
        break;
      }
      case "pdf":
        if (b.id_archivo_pdf) out.push({type:"pdf",id:b.id_archivo_pdf,name:b.pdf_nombre||"documento.pdf",size:b.pdf_tamano??null});
        break;
    }
  }
  return out;
}

export default function FormatoNoticias({id}:{id:string}) {
  const {lang}=useI18n();const es=lang==="es";
  const [data,setData]=useState<NoticiaPublicaDetalle|null>(null);
  const [estado,setEstado]=useState<"cargando"|"listo"|"error"|"no-encontrado">("cargando");
  const [intento,setIntento]=useState(0);
  useEffect(()=>{const controller=new AbortController();setData(null);setEstado("cargando");
    obtenerNoticiaPublica(id,controller.signal).then(n=>{if(!controller.signal.aborted){setData(n);setEstado("listo");}}).catch(e=>{if(!controller.signal.aborted)setEstado(e instanceof Error&&e.message==="NOT_FOUND"?"no-encontrado":"error");});
    return ()=>controller.abort();
  },[id,intento]);
  return <article className="min-h-[65vh] overflow-x-clip bg-background"><div className="container-site py-8 sm:py-16"><div className="mx-auto max-w-4xl">
    <Link to="/noticias" className="mb-7 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary hover:underline"><ArrowLeft className="size-4"/>{es?"Volver a noticias":"Back to news"}</Link>
    {estado==="cargando"&&<p role="status" className="text-muted-foreground">{es?"Cargando noticia…":"Loading news…"}</p>}
    {estado==="error"&&<div role="status" className="rounded-2xl border border-border bg-muted/40 p-8 text-center"><p>{es?"No pudimos cargar la noticia. Comprueba tu conexión.":"We couldn't load this article. Check your connection."}</p><button type="button" onClick={()=>setIntento(n=>n+1)} className="mt-4 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground">{es?"Reintentar":"Try again"}</button></div>}
    {estado==="no-encontrado"&&<p role="status">{es?"Noticia no encontrada.":"News article not found."}</p>}
    {estado==="listo"&&data&&<><div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground"><span className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary">{es?data.categoria_es:data.categoria_en}</span><span className="inline-flex items-center gap-2"><CalendarDays className="size-4"/>{fechaNoticia(data.fecha_publicacion,es)}</span></div>
      <h1 className="mb-6 font-display text-3xl leading-tight text-brand-deep sm:text-5xl">{es?data.titulo_es:data.titulo_en}</h1>
      {data.id_programa&&<Link to={`/programas?programa=${encodeURIComponent(data.id_programa)}`} className="mb-6 inline-block text-sm font-semibold text-primary hover:underline">{es?data.programa_titulo_es:data.programa_titulo_en}</Link>}
      <EditorialContent key={id} blocks={bloquesEditoriales(data.bloques,es)}/>
      {!data.bloques.length&&<p className="text-muted-foreground">{es?"Próximamente compartiremos más información.":"More information will be available soon."}</p>}
      {(data.fotos_por?.trim()||data.autor?.trim())&&<div className="mt-10 space-y-2 border-t border-border pt-6 text-sm text-muted-foreground sm:text-base">
        {data.fotos_por?.trim()&&<p className="flex flex-wrap items-center gap-2"><Camera aria-hidden="true" className="size-4 shrink-0 text-primary"/><span className="italic">{es?"Fotos por:":"Photos by:"}</span><span className="font-semibold text-brand-deep">{data.fotos_por.trim()}</span></p>}
        {data.autor?.trim()&&<p className="flex flex-wrap items-center gap-2"><PenLine aria-hidden="true" className="size-4 shrink-0 text-primary"/><span className="italic">{es?"Texto escrito por:":"Written by:"}</span><span className="font-semibold text-brand-deep">{data.autor.trim()}</span></p>}
      </div>}
    </>}
  </div></div></article>;
}
