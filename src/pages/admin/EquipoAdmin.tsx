import { useEffect, useState, type FormEvent } from "react";

import { Pencil, Trash2, UserRound, Search, Users, Landmark, Handshake, Plus, Briefcase, CheckCircle2, ImagePlus, ArrowLeft, ArrowRight } from "lucide-react";

import { plain, sanitize, uid } from "./datos";
import { EditorTexto, estilosTextoEnriquecido } from "./EditorTexto";

import { AdminHeading, Field, Notice, Confirm, field, primary, secondary, panel, CloseButton } from "./ui";
import { Selector as AdminDropdown } from "./Selector";



import { translateText, translationNotice, withTranslator } from "./traduccion";
import { type Profile, type Role, type Category, listarNosotros, listarCargos, listarCategorias, guardarPerfil, borrarPerfil, guardarCargo, borrarCargo, reordenarPerfiles } from "@/api/nosotrosApi";







const categories = [

  { id: "junta-directiva", label: "Junta directiva", icon: Landmark, description: "Gobernanza y liderazgo institucional", singular: "miembro", accent: "#2381C4", tint: "#edf6fc", border: "#dce7ef" },

  { id: "equipo", label: "Nuestro equipo", icon: Users, description: "Personas y cargos de la organización", singular: "integrante", accent: "#2381C4", tint: "#edf6fc", border: "#dce7ef" },

  { id: "socios", label: "Socios y aliados", icon: Handshake, description: "Organizaciones y colaboración", singular: "aliado", accent: "#2381C4", tint: "#edf6fc", border: "#dce7ef" },

] as const;

const blank = (category: Category): Profile => ({ id: uid(), name: "", image: "", imageId:"", description: "", descriptionEn: "", role: "", roleEn: "", roleId: "", category, partnerCategory:"", orden:1 });
const folded = (value: string) => value.trim().toLocaleLowerCase("es");



export default function EquipoAdmin() {

  const [items,setItems]=useState<Profile[]>([]);
  const [roles,setRoles]=useState<Role[]>([]);
  const [partnerCategories,setPartnerCategories]=useState<Role[]>([]);
  const [loading,setLoading]=useState(true);
  const [ready,setReady]=useState(false);
  const [busy,setBusy]=useState(false);
  async function refresh(){setLoading(true);try{const [p,r,c]=await Promise.all([listarNosotros(true),listarCargos(),listarCategorias(true)]);setItems(p);setRoles(r);setPartnerCategories(c);setReady(true);}catch(e){setReady(false);setError(e instanceof Error?e.message:"No se pudieron cargar los registros.");}finally{setLoading(false);}}
  useEffect(()=>{void refresh();},[]);

  const [category, setCategory] = useState<Category>("junta-directiva");

  const [draft, setDraft] = useState<Profile | null>(null);

  const [query, setQuery] = useState("");

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [manageRoles, setManageRoles] = useState(false);

  const [roleDraft, setRoleDraft] = useState<Role | null>(null);

  const [pending, setPending] = useState<{ type: "save" | "delete"; person: Profile } | null>(null);

  const [deleteRole, setDeleteRole] = useState<Role | null>(null);

  const active = categories.find(c => c.id === category)!;

  const roleFor = (p: Profile) => roles.find(r => r.id === p.roleId) ?? roles.find(r => folded(r.name) === folded(p.role));

  const roleName = (p: Profile) => roleFor(p)?.name ?? p.role;

  const patch = (p: Partial<Profile>) => setDraft(d => d ? { ...d, ...p } : null);

  function clearNotice() { setError(""); setSuccess(""); }

  function start(c: Category) { setCategory(c); setDraft({...blank(c),orden: Math.max(0,...items.filter(p=>p.category===c).map(p=>p.orden))+1}); setManageRoles(false); setRoleDraft(null); clearNotice(); }

  function edit(p: Profile) { const role = roleFor(p); setDraft({ ...p, roleId: role?.id ?? p.roleId }); setCategory(p.category); clearNotice(); }

  async function submit(e: FormEvent) {

    e.preventDefault(); if (!draft || busy) return;

    if (!draft.name.trim() || !plain(draft.description) || !draft.image) { setError("Completa nombre, fotografía válida y texto o descripción."); return; }

    const role = roles.find(r => r.id === draft.roleId);

    if (draft.category === "socios" && !draft.partnerCategory) { setError("Selecciona una categoría de socio."); return; }
    if (draft.category === "equipo" && !role) { setError("Selecciona o crea un cargo."); return; }

    let descriptionEn=draft.descriptionEn; let roleEn=role?.nameEn || draft.roleEn;

    setBusy(true); try { if(!plain(descriptionEn)) descriptionEn=await withTranslator(t=>t(draft.description,true)); if(draft.category==="equipo"&&!roleEn.trim()) roleEn=await translateText(role?.name??draft.role); } catch(e){setError(e instanceof Error?e.message:"No se pudo traducir.");return;} finally{setBusy(false);}

    setDraft({...draft,descriptionEn,roleEn});

    setPending({ type: "save", person: { ...draft, descriptionEn, name: draft.name.trim(), description: draft.description.trim(), role: draft.category === "equipo" ? role?.name ?? draft.role : "", roleEn: draft.category === "equipo" ? roleEn : "", roleId: draft.category === "equipo" ? role?.id ?? "" : "" } });

  }

  async function commit(){if(!pending||busy)return;const {person,type}=pending;setPending(null);setBusy(true);clearNotice();try{if(type==="delete")await borrarPerfil(person.id);else await guardarPerfil(person,items.some(p=>p.id===person.id));setDraft(null);if(type==="delete")setSuccess("Registro eliminado.");await refresh();}catch(e){setError(e instanceof Error?e.message:"No se pudo guardar el registro.");}finally{setBusy(false);}}
  async function submitRole(e: FormEvent) {

    e.preventDefault(); if (!roleDraft || busy) return;

    const name = roleDraft.name.trim();

    if (!name) { setError("Escribe el nombre del cargo."); return; }

    if (roles.some(r => r.id !== roleDraft.id && folded(r.name) === folded(name))) { setError("Este cargo ya existe."); return; }

    let nameEn=roleDraft.nameEn.trim();setBusy(true);try{if(!nameEn)nameEn=await translateText(name);}catch(e){setError(e instanceof Error?e.message:"No se pudo traducir.");return;}finally{setBusy(false);}

    const updated = { ...roleDraft, name, nameEn };

    setBusy(true);try{const id=await guardarCargo(updated,roles.some(r=>r.id===updated.id));if(draft?.category==="equipo")patch({roleId:id,role:updated.name,roleEn:updated.nameEn});setRoleDraft(null);await refresh();setSuccess("Cargo guardado.");}catch(e){setError(e instanceof Error?e.message:"No se pudo guardar el cargo.");}finally{setBusy(false);}

  }

  async function removeRole() {

    if (!deleteRole) return;

    const target = deleteRole; setDeleteRole(null);

    if (items.some(p => p.category === "equipo" && roleFor(p)?.id === target.id) || draft?.roleId === target.id) { setError("No puedes eliminar un cargo asignado. Cambia primero el cargo de los integrantes."); return; }

    setBusy(true);try{await borrarCargo(target.id);await refresh();setSuccess("Cargo eliminado.");}catch(e){setError(e instanceof Error?e.message:"No se pudo eliminar el cargo.");}finally{setBusy(false);}

  }

  // Cambia la posición de un registro dentro de su sección y guarda el nuevo orden completo.
  async function move(p: Profile, dir: -1 | 1) {
    if (busy) return;
    const lista = items.filter(x => x.category === p.category);
    const i = lista.findIndex(x => x.id === p.id);
    const j = i + dir;
    const actual = lista[i], vecino = lista[j];
    if (!actual || !vecino) return;
    lista[i] = vecino; lista[j] = actual;
    const previo = items;
    setItems(old => [...old.filter(x => x.category !== p.category), ...lista.map((x, n) => ({ ...x, orden: n + 1 }))]);
    setBusy(true); clearNotice();
    try { await reordenarPerfiles(lista.map(x => x.id)); }
    catch (e) { setItems(previo); setError(e instanceof Error ? e.message : "No se pudo cambiar el orden."); }
    finally { setBusy(false); }
  }

  const filtered = items.filter(p => p.category === category && folded(`${p.name} ${roleName(p)} ${plain(p.description)}`).includes(folded(query)));

  const count = items.filter(p => p.category === category).length;

  const actionClass = "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold text-white shadow-sm transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-offset-2 motion-reduce:transition-none";

  return <div className="mx-auto max-w-7xl space-y-6">

    <AdminHeading title="Nosotros" description="Gestiona las personas y organizaciones que forman parte de Armonía." count={items.length}/>

    <AdminDropdown label="Filtrar sección de Nosotros" value={category} options={categories.map(c=>({id:c.id,label:c.label,count:items.filter(p=>p.category===c.id).length}))} disabled={!!draft||busy} onChange={id=>{const c=categories.find(x=>x.id===id);if(c){setCategory(c.id);setQuery("");setManageRoles(false);setRoleDraft(null);clearNotice();}}}/>

    <p className="text-sm text-black">{translationNotice}</p>

    <Notice error={error} success={success}/>
    {loading && <p role="status">Cargando registros…</p>}
    {!loading&&!ready&&<button type="button" className={secondary} onClick={()=>void refresh()}>Reintentar</button>}

    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

      <div className="flex flex-wrap items-center justify-between gap-4"><div className="flex items-center gap-3"><span style={{backgroundColor:active.tint,color:active.accent}} className="grid size-11 shrink-0 place-items-center rounded-xl"><active.icon className="size-5"/></span><div><h2 className="text-xl font-bold text-brand-deep">{active.label}</h2><p className="text-sm text-black">{count} {count===1?"registro":"registros"}</p></div></div><div className="flex flex-wrap gap-2">{category === "equipo" && <button type="button" className={secondary} disabled={busy} onClick={() => { setManageRoles(v => !v); setRoleDraft(null); clearNotice(); }}><Briefcase className="size-4"/>{manageRoles ? "Cerrar cargos" : "Gestionar cargos"}</button>}{!draft && <button type="button" style={{backgroundColor:active.accent}} className={actionClass} disabled={!ready||busy||loading} onClick={() => start(category)}><Plus className="size-5"/>Añadir {active.singular}</button>}</div></div>

    </section>

    {manageRoles && category === "equipo" && <section className={`${panel} space-y-4 border-[#dce7ef]`}>

      <div className="flex flex-wrap items-center justify-between gap-3"><h3 className="font-display text-xl text-brand-deep">Cargos del equipo</h3><button type="button" className={secondary} disabled={busy} onClick={() => { setRoleDraft({ id: uid(), name: "", nameEn: "" }); clearNotice(); }}><Plus className="size-4"/>Nuevo cargo</button></div>

      {roleDraft && <form onSubmit={submitRole} className="space-y-3 rounded-xl border border-[#dce7ef] bg-[#edf6fc] p-4"><fieldset disabled={busy} className="space-y-3"><Field label="Cargo"><input required className={field} value={roleDraft.name} onChange={e => setRoleDraft({ ...roleDraft, name: e.target.value, nameEn:"" })}/></Field><div className="flex gap-2"><button className={primary} type="submit">{busy?"Traduciendo…":"Guardar cargo"}</button><CloseButton onClick={() => setRoleDraft(null)}/></div></fieldset></form>}

      {!roles.length && <p className="text-sm text-black">Todavía no hay cargos registrados.</p>}

      <div className="divide-y divide-border">{roles.map(r => <div key={r.id} className="flex flex-wrap items-center justify-between gap-2 py-3"><span className="font-medium">{r.name}{r.nameEn && <span className="ml-2 text-sm text-black">{r.nameEn}</span>}</span><div className="flex gap-2"><button type="button" className={secondary} onClick={() => { setRoleDraft({ ...r }); clearNotice(); }}><Pencil className="size-4"/>Editar</button><button type="button" className={`${secondary} text-red-700`} onClick={() => setDeleteRole(r)}><Trash2 className="size-4"/>Eliminar</button></div></div>)}</div>

    </section>}

    {draft ? <form onSubmit={submit} className={`${panel} space-y-6`} style={{borderTop: `4px solid ${active.accent}`}}><fieldset disabled={busy} className="space-y-6">

      <div className="flex flex-wrap items-center justify-between gap-3"><h3 className="font-display text-xl text-brand-deep">{items.some(p => p.id === draft.id) ? "Editar registro" : "Nuevo registro"} · {active.label}</h3><CloseButton onClick={() => { setDraft(null); clearNotice(); }}/></div>

      <div className="grid gap-5 lg:grid-cols-[1fr_2fr]"><div className="space-y-4 rounded-2xl bg-slate-50 p-4"><div className="flex items-center gap-2 font-semibold text-brand-deep"><ImagePlus className="size-5"/>Imagen del perfil</div><Field label={category === "socios" ? "Fotografía o logotipo" : "Fotografía"}>{draft.image&&<img src={draft.image} alt={draft.name} className="max-h-64 w-full rounded-xl object-contain" onError={e=>{e.currentTarget.style.visibility="hidden";}} onLoad={e=>{e.currentTarget.style.visibility="visible";}}/>}<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className={field} onChange={e=>{const f=e.target.files?.[0];if(!f)return;if(f.size>5*1024*1024){setError("La imagen debe pesar hasta 5 MB.");return;}const reader=new FileReader();reader.onload=()=>{if(typeof reader.result==="string"){const image=reader.result;setDraft(d=>d?.id===draft.id?{...d,image}:d);}};reader.onerror=()=>setError("No se pudo leer la imagen.");reader.readAsDataURL(f);}}/></Field></div><div className="space-y-4">

      <Field label={category === "socios" ? "Nombre del socio o aliado" : "Nombre completo"}><input required className={field} value={draft.name} onChange={e => patch({ name: e.target.value })}/></Field>

      {category === "equipo" && <div className="space-y-2"><AdminDropdown label="Cargo" required placeholder="Selecciona un cargo" value={draft.roleId || (draft.role ? "legacy" : "")} options={[...(draft.role && !draft.roleId ? [{id:"legacy",label:`${draft.role} (cargo anterior)`}] : []),...roles.map(r=>({id:r.id,label:r.name}))]} onChange={id=>{if(id==="legacy")return;const r=roles.find(x=>x.id===id);patch({roleId:r?.id??"",role:r?.name??"",roleEn:r?.nameEn??""});}}/><button type="button" className={secondary} onClick={() => { setManageRoles(true); setRoleDraft({ id: uid(), name: "", nameEn: "" }); clearNotice(); }}><Plus className="size-4"/>Crear cargo</button></div>}

      {category==="socios"&&<AdminDropdown label="Categoría de socio" value={draft.partnerCategory} options={partnerCategories.map(c=>({id:c.id,label:c.name}))} onChange={partnerCategory=>patch({partnerCategory})} required/>}
      {/* El editor NO va dentro de un <label>: el navegador reenviaría cada clic al primer botón. */}
      <div className="block min-w-0 space-y-1.5"><span className="block text-sm font-medium text-foreground">{category === "equipo" ? "Descripción" : "Texto"}</span>
        <EditorTexto sinEnlaces label={category === "equipo" ? "Descripción" : "Texto"} value={draft.description} onChange={value => { if (value !== draft.description) patch({ description: value, descriptionEn: "" }); }}/>
      </div>

      </div></div><div className="flex flex-wrap justify-end gap-2 border-t border-slate-200 pt-4"><CloseButton onClick={() => { setDraft(null); clearNotice(); }}/><button type="submit" style={{backgroundColor:active.accent}} className={actionClass}><CheckCircle2 className="size-4"/>{busy?"Traduciendo…":"Guardar registro"}</button></div></fieldset></form> : <>

      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 shadow-sm"><Search className="size-5 text-black"/><input className="w-full bg-transparent py-3 outline-none" aria-label="Buscar registros" placeholder="Buscar por nombre, cargo o texto…" value={query} onChange={e => setQuery(e.target.value)}/></div>

      {!filtered.length ? <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center"><span style={{color:active.accent,backgroundColor:active.tint}} className="mx-auto grid size-20 place-items-center rounded-3xl"><active.icon className="size-9"/></span><h3 className="mt-5 text-xl font-bold text-brand-deep">{query?"No encontramos coincidencias":"Aún no hay registros"}</h3><p className="mx-auto mt-2 max-w-sm text-sm text-black">{query?"Prueba con otro nombre o palabra.":"Añade el primer perfil para empezar a completar esta sección."}</p><button type="button" className={`${actionClass} mt-5`} style={{backgroundColor:active.accent}} disabled={!ready||busy||loading} onClick={()=>query?setQuery(""):start(category)}>{query?"Limpiar búsqueda":`Añadir ${active.singular}`}</button></div> : <>{!query && filtered.length > 1 && <p className="text-sm text-black">Usa las flechas ← → de cada tarjeta para cambiar el orden en que aparecen en la web.</p>}<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{filtered.map((p, i) => <article key={p.id} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg motion-reduce:transform-none motion-reduce:transition-none"><div style={{backgroundColor:active.tint}} className="relative grid aspect-[16/10] place-items-center overflow-hidden">{p.image ? <img src={p.image} alt={p.name} onError={e=>{e.currentTarget.style.visibility="hidden";}} className={`size-full transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none ${p.category === "socios" ? "object-contain p-5" : "object-cover"}`}/> : <UserRound style={{color:active.accent}} className="size-16 opacity-50"/>}</div><div className="space-y-2 p-4"><h3 className="font-display text-xl font-bold text-brand-deep">{p.name}</h3>{p.category === "equipo" && <p style={{backgroundColor:active.tint,color:active.accent}} className="inline-block rounded-full px-3 py-1 text-sm font-semibold">{roleName(p)}</p>}<div className={`line-clamp-3 whitespace-pre-line text-sm text-black ${estilosTextoEnriquecido}`} dangerouslySetInnerHTML={{ __html: sanitize(p.description) }}/><div className="flex flex-wrap gap-2 pt-2">{!query && filtered.length > 1 && <><button type="button" className={secondary} title="Mover antes" aria-label={`Mover ${p.name} antes`} disabled={busy||!ready||i===0} onClick={() => void move(p, -1)}><ArrowLeft className="size-4"/></button><button type="button" className={secondary} title="Mover después" aria-label={`Mover ${p.name} después`} disabled={busy||!ready||i===filtered.length-1} onClick={() => void move(p, 1)}><ArrowRight className="size-4"/></button></>}<button type="button" className={secondary} disabled={busy||!ready} onClick={() => edit(p)}><Pencil className="size-4"/>Editar</button><button type="button" className={`${secondary} text-red-700`} disabled={busy||!ready} onClick={() => setPending({ type: "delete", person: p })}><Trash2 className="size-4"/>Eliminar</button></div></div></article>)}</div></>}

    </>}

    {pending && <Confirm danger={pending.type === "delete"} text={`${pending.type === "delete" ? "¿Eliminar" : "¿Guardar"} el registro de ${pending.person.name}?`} onClose={() => setPending(null)} onConfirm={commit}/>}

    {deleteRole && <Confirm danger text={`¿Eliminar el cargo ${deleteRole.name}?`} onClose={() => setDeleteRole(null)} onConfirm={removeRole}/>}

  </div>;

}