import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { FileText, Pencil, Trash2, Search, Plus, ImagePlus, Download, Check, ChevronDown, ArrowUp, ArrowDown, Map as MapIcon } from "lucide-react";
import { AdminHeading, Field, Notice, Confirm, Empty, field, primary, secondary, panel, CloseButton } from "./ui";
import { withTranslator, translationNotice } from "./traduccion";
import { listarRecursos, listarTiposRecurso, guardarRecurso, borrarRecurso, imagenRecursoUrl, descargarPdf, type Recurso, type CategoriaRecurso, type PdfRecurso } from "@/api/recursosApi";
type Option = { id: string; label: string; count?: number };

function AdminDropdown({
  label,
  value,
  options,
  onChange,
  placeholder = "Seleccionar opción",
  disabled = false,
  required = false,
}: {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [open, setOpen] = useState(false);
  const [focusIndex, setFocusIndex] = useState(0);
  const selected = options.find((option) => option.id === value);
  const selectedIndex = Math.max(0, options.findIndex((option) => option.id === value));

  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);

  useEffect(() => {
    if (open) optionRefs.current[focusIndex]?.focus();
  }, [open, focusIndex]);

  function show() {
    if (disabled) return;
    if (!open) setFocusIndex(selectedIndex);
    setOpen((previous) => !previous);
  }

  function choose(option: Option) {
    onChange(option.id);
    setOpen(false);
    trigger.current?.focus();
  }

  return (
    <div ref={root} className="relative min-w-0">
      <span id={`${id}-label`} className="mb-2 block text-sm font-semibold text-brand-deep">
        {label}
      </span>
      <button
        ref={trigger}
        type="button"
        disabled={disabled}
        aria-labelledby={`${id}-label ${id}-value`}
        aria-required={required || undefined}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? `${id}-listbox` : undefined}
        onClick={show}
        onKeyDown={(event) => {
          if (!open && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
            event.preventDefault();
            setFocusIndex(selectedIndex);
            setOpen(true);
          }
        }}
        className={`flex min-h-[68px] w-full items-center gap-3 rounded-2xl border bg-white px-4 text-left shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2381C4]/30 disabled:cursor-not-allowed disabled:opacity-50 ${open ? "border-[#2381C4] ring-2 ring-[#2381C4]/15" : "border-[#dbe6ef] hover:border-[#2381C4]/60"}`}
      >
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#eaf4fc] text-[#2381C4]">
          <MapIcon className="size-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span id={`${id}-value`} className="block truncate text-sm font-semibold text-brand-deep sm:text-base">
            {selected?.label ?? placeholder}
          </span>
          {selected?.count !== undefined && (
            <span className="block text-xs text-muted-foreground">
              {selected.count} {selected.count === 1 ? "registro" : "registros"}
            </span>
          )}
        </span>
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#eaf4fc] text-[#2381C4]">
          <ChevronDown className={`size-5 transition-transform ${open ? "rotate-180" : ""}`} />
        </span>
      </button>
      {open && (
        <div
          id={`${id}-listbox`}
          role="listbox"
          aria-labelledby={`${id}-label`}
          className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-[#dbe6ef] bg-white p-2 shadow-[0_16px_50px_rgba(18,60,96,0.18)]"
        >
          <div className="border-b border-border px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[#2381C4]">
            Selecciona una opción
          </div>
          <div className="max-h-72 space-y-1 overflow-y-auto overscroll-contain py-2">
            {options.map((option, index) => {
              const active = option.id === value;
              return (
                <button
                  key={option.id}
                  ref={(node) => { optionRefs.current[index] = node; }}
                  role="option"
                  aria-selected={active}
                  type="button"
                  onClick={() => choose(option)}
                  onKeyDown={(event) => {
                    if (event.key === "ArrowDown") {
                      event.preventDefault();
                      setFocusIndex((index + 1) % options.length);
                    } else if (event.key === "ArrowUp") {
                      event.preventDefault();
                      setFocusIndex((index - 1 + options.length) % options.length);
                    } else if (event.key === "Home") {
                      event.preventDefault();
                      setFocusIndex(0);
                    } else if (event.key === "End") {
                      event.preventDefault();
                      setFocusIndex(options.length - 1);
                    }
                  }}
                  className={`flex min-h-14 w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#2381C4]/40 ${active ? "bg-[#eaf4fc] text-[#185e91]" : "text-brand-deep hover:bg-[#f2f7fb] focus:bg-[#f2f7fb]"}`}
                >
                  <span className={`grid size-9 shrink-0 place-items-center rounded-xl ${active ? "bg-[#2381C4] text-white" : "bg-[#eef3f7] text-[#5980b9]"}`}>
                    <MapIcon className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block break-words text-sm font-semibold leading-snug">{option.label}</span>
                    {option.count !== undefined && (
                      <span className="mt-1 block text-xs text-muted-foreground">
                        {option.count} {option.count === 1 ? "registro" : "registros"}
                      </span>
                    )}
                  </span>
                  {active && (
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#2381C4] text-white">
                      <Check className="size-4" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}


const blank=(type:string):Recurso=>({id:"",type,title:"",titleEn:"",description:"",descriptionEn:"",imageId:"",date:"",files:[]});
const message=(e:unknown)=>e instanceof Error?e.message:"No se pudo completar la operación.";
function readFile(f:File):Promise<string>{return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(String(r.result));r.onerror=()=>reject(new Error("No se pudo leer el archivo."));r.readAsDataURL(f);});}
function Cover({src,title}:{src:string;title:string}){const [failed,setFailed]=useState(false);useEffect(()=>setFailed(false),[src]);return <div className="grid aspect-[16/10] place-items-center overflow-hidden bg-[#edf6fc]">{src&&!failed?<img src={src} alt={title} onError={()=>setFailed(true)} className="size-full object-cover"/>:<FileText className="size-14 text-primary"/>}</div>;}
export default function RecursosAdmin(){
 const [items,setItems]=useState<Recurso[]>([]),[cats,setCats]=useState<CategoriaRecurso[]>([]),[draft,setDraft]=useState<Recurso|null>(null),[category,setCategory]=useState("informes"),[query,setQuery]=useState(""),[error,setError]=useState(""),[success,setSuccess]=useState(""),[busy,setBusy]=useState(false),[loading,setLoading]=useState(true),[failed,setFailed]=useState(false),[english,setEnglish]=useState(false),[pending,setPending]=useState<{type:"save"|"delete";resource:Recurso}|null>(null);
 async function load(){setLoading(true);setFailed(false);setError("");try{const [r,c]=await Promise.all([listarRecursos(true),listarTiposRecurso(true)]);setItems(r);setCats(c);setCategory(old=>c.some(x=>x.id===old)?old:c[0]?.id||"");}catch(e){setFailed(true);setError(message(e));}finally{setLoading(false);}}
 useEffect(()=>{void load();},[]);
 const patch=(p:Partial<Recurso>)=>setDraft(d=>d?{...d,...p}:null);
 function open(r?:Recurso){setDraft(r?{...r,files:r.files.map(f=>({...f}))}:blank(category));setEnglish(false);setError("");setSuccess("");}
 async function upload(files:FileList|null,cover:boolean){if(!files?.length||!draft||busy)return;setBusy(true);setError("");try{if(cover){const f=files[0];if(!f)return;if(!/^image\/(jpeg|png|webp|gif)$/.test(f.type)||f.size>5*1024*1024)throw new Error("Selecciona una imagen JPEG, PNG, WebP o GIF de hasta 5 MB.");patch({imageData:await readFile(f)});}else{if(draft.files.length+files.length>15)throw new Error("Máximo 15 PDF por recurso.");const next:PdfRecurso[]=[];for(const f of Array.from(files)){if(!f.name.toLowerCase().endsWith(".pdf")||f.size>2*1024*1024||await f.slice(0,5).text()!=="%PDF-")throw new Error("Selecciona PDF válidos de hasta 2 MB por archivo.");next.push({id:crypto.randomUUID(),name:f.name,size:f.size,data:await readFile(new File([f],f.name,{type:"application/pdf"}))});}setDraft(d=>d?{...d,files:[...d.files,...next]}:null);}}catch(e){setError(message(e));}finally{setBusy(false);}}
 async function translated(r:Recurso){if((!r.titleEn.trim()&&r.title.trim())||(!r.descriptionEn.trim()&&r.description.trim()))return withTranslator(async t=>({...r,titleEn:r.titleEn.trim()|| (r.title.trim()?await t(r.title):""),descriptionEn:r.descriptionEn.trim()||(r.description.trim()?await t(r.description):"")}));return r;}
 async function language(en:boolean){if(!draft||busy)return;if(!en){setEnglish(false);return;}setBusy(true);setError("");try{setDraft(await translated(draft));}catch(e){setError(message(e));}finally{setEnglish(true);setBusy(false);}}
 function focus(id:string){setTimeout(()=>{const el=document.getElementById(id);el?.scrollIntoView({block:"center",behavior:"smooth"});el?.focus();},30);}
 async function submit(e:FormEvent){e.preventDefault();if(!draft||busy)return;setError("");if(!draft.type){setError("Selecciona una categoría.");return;}if(!draft.title.trim()||!draft.description.trim()){setEnglish(false);setError("Completa el título y la descripción.");focus(!draft.title.trim()?"recurso-titulo":"recurso-descripcion");return;}if(!draft.imageId&&!draft.imageData){setError("Adjunta una imagen de portada.");focus("recurso-portada");return;}if(!draft.files.length){setError("Adjunta al menos un PDF.");focus("recurso-pdfs");return;}setBusy(true);try{const r=await translated(draft);setDraft(r);if(!r.titleEn.trim()||!r.descriptionEn.trim()){setEnglish(true);setError("Completa los textos en inglés.");return;}setPending({type:"save",resource:r});}catch(e){setEnglish(true);setError(message(e));}finally{setBusy(false);}}
 async function commit(){if(!pending||busy)return;const p=pending;setPending(null);setBusy(true);setError("");setSuccess("");try{if(p.type==="delete")await borrarRecurso(p.resource.id);else await guardarRecurso(p.resource);setDraft(null);await load();setCategory(p.resource.type);if(p.type==="delete")setSuccess("Recurso eliminado.");else if(!p.resource.id)setSuccess("Recurso guardado.");}catch(e){setError(message(e));}finally{setBusy(false);}}
 async function download(f:PdfRecurso){setError("");try{await descargarPdf(f.id,f.name);}catch(e){setError(message(e));}}
 function move(i:number,delta:number){if(!draft)return;const arr=[...draft.files],j=i+delta;if(j<0||j>=arr.length)return;const a=arr[i],b=arr[j];if(!a||!b)return;arr[i]=b;arr[j]=a;patch({files:arr});}
 const cards=cats.map(c=>({id:c.id,label:c.name,count:items.filter(r=>r.type===c.id).length}));const filtered=items.filter(r=>r.type===category&&`${r.title} ${r.description}`.toLocaleLowerCase("es").includes(query.toLocaleLowerCase("es")));
 return <div className="mx-auto max-w-7xl space-y-6"><AdminHeading title="Recursos" description="Organiza los archivos institucionales por tipo de recurso." count={items.length}/><AdminDropdown label="Filtrar recursos por categoría" value={category} options={cards} disabled={!!draft||busy||loading} onChange={id=>{setCategory(id);setQuery("");setError("");setSuccess("");}}/><section className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-white p-4"><h2 className="font-display text-xl text-brand-deep">{cards.find(x=>x.id===category)?.label||"Recursos"}</h2>{!draft&&<button className={primary} disabled={busy||loading||failed||!category} onClick={()=>open()}><Plus className="size-5"/>Añadir recurso</button>}</section><Notice error={error} success={success}/>{loading?<p role="status">Cargando recursos…</p>:failed?<button className={secondary} onClick={()=>void load()}>Reintentar</button>:draft?<form noValidate onSubmit={submit} className={`${panel} border-t-4 border-t-[#2381C4]`}><fieldset disabled={busy} className="space-y-5"><div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-display text-xl text-brand-deep">{draft.id?"Editar recurso":"Nuevo recurso"}</h3><CloseButton onClick={()=>setDraft(null)}/></div><AdminDropdown label="Categoría del recurso" value={draft.type} options={cards} onChange={type=>patch({type})}/><div className="grid gap-5 lg:grid-cols-2"><div className="space-y-4"><div className="flex gap-2">{[false,true].map(en=><button key={String(en)} type="button" className={english===en?primary:secondary} onClick={()=>void language(en)}>{en?"English":"Español"}</button>)}</div><Field label={english?"Título (EN)":"Título (ES)"}><input id="recurso-titulo" className={`${field} !text-[#2381C4] font-semibold`} value={english?draft.titleEn:draft.title} onChange={e=>patch(english?{titleEn:e.target.value}:{title:e.target.value,titleEn:""})}/></Field><Field label={english?"Descripción (EN)":"Descripción (ES)"}><textarea id="recurso-descripcion" rows={5} className={field} value={english?draft.descriptionEn:draft.description} onChange={e=>patch(english?{descriptionEn:e.target.value}:{description:e.target.value,descriptionEn:""})}/></Field><p className="text-sm text-black">{translationNotice}</p></div><div className="space-y-3 rounded-2xl bg-[#edf6fc] p-4"><h3 className="font-bold text-brand-deep">Imagen de portada</h3><Cover src={draft.imageData||(draft.imageId?imagenRecursoUrl(draft.imageId):"")} title={draft.title}/><label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-[#99CCFF] bg-white p-4 text-primary"><ImagePlus className="size-6"/>Seleccionar o reemplazar portada<input id="recurso-portada" type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" onChange={e=>{void upload(e.target.files,true);e.target.value="";}}/></label><h3 className="font-bold text-brand-deep">Documentos PDF</h3><label onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();void upload(e.dataTransfer.files,false);}} className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-[#99CCFF] bg-white p-5 text-center"><FileText className="size-8 text-primary"/><span className="font-semibold text-primary">Seleccionar o arrastrar PDF</span><span className="text-sm text-black">Hasta 2 MB por archivo.</span><input id="recurso-pdfs" type="file" multiple accept="application/pdf,.pdf" className="sr-only" onChange={e=>{void upload(e.target.files,false);e.target.value="";}}/></label>{draft.files.map((f,i)=><div key={f.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-white p-3"><FileText className="size-6 shrink-0 text-primary"/><span className="min-w-0 flex-1 break-all text-sm">{f.name}</span><button type="button" className={secondary} disabled={i===0} aria-label="Subir PDF" onClick={()=>move(i,-1)}><ArrowUp className="size-4"/></button><button type="button" className={secondary} disabled={i===draft.files.length-1} aria-label="Bajar PDF" onClick={()=>move(i,1)}><ArrowDown className="size-4"/></button><button type="button" className={secondary} aria-label="Quitar PDF" onClick={()=>patch({files:draft.files.filter(x=>x.id!==f.id)})}><Trash2 className="size-4"/></button></div>)}</div></div><div className="flex justify-end gap-2 border-t border-border pt-4"><CloseButton onClick={()=>setDraft(null)}/><button type="submit" className={primary}>{busy?"Procesando…":"Guardar recurso"}</button></div></fieldset></form>:<><div className="flex items-center gap-3 rounded-xl border border-border bg-white px-4"><Search className="size-5 text-primary"/><input className="w-full bg-transparent py-3 text-black outline-none" placeholder="Buscar por título o descripción…" value={query} onChange={e=>setQuery(e.target.value)}/></div>{!filtered.length?<Empty text="No hay recursos en esta categoría."/>:<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{filtered.map(r=><article key={r.id} className="group overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md motion-reduce:transform-none"><Cover src={imagenRecursoUrl(r.imageId)} title={r.title}/><div className="space-y-3 p-4"><h3 className="font-display text-xl text-brand-deep">{r.title}</h3><p className="line-clamp-3 text-sm text-black">{r.description}</p><p className="text-sm text-primary">{r.files.length} PDF</p>{r.files.map(f=><button key={f.id} type="button" className="flex w-full items-center gap-2 text-left text-sm text-primary" onClick={()=>void download(f)}><Download className="size-4 shrink-0"/><span className="break-all">{f.name}</span></button>)}<div className="flex gap-2 border-t border-border pt-3"><button className={secondary} disabled={busy} onClick={()=>open(r)}><Pencil className="size-4"/>Editar</button><button className={secondary} disabled={busy} onClick={()=>setPending({type:"delete",resource:r})}><Trash2 className="size-4"/>Eliminar</button></div></div></article>)}</div>}</>}{pending&&<Confirm danger={pending.type==="delete"} text={`${pending.type==="delete"?"¿Eliminar":"¿Guardar"} «${pending.resource.title}»?`} onClose={()=>setPending(null)} onConfirm={()=>void commit()}/>}</div>;
}
