import { useState, type FormEvent } from "react";
import { Pencil, Trash2, UserRound, Search, Users, Landmark, Handshake, Plus, Briefcase, CheckCircle2, ImagePlus } from "lucide-react";
import { type Person, keys, normalizePerson, useStore, uid, safeUrl } from "./datos";
import { AdminHeading, CategoryCards, Field, Notice, Confirm, ImageInput, field, primary, secondary, panel, CloseButton } from "./ui";

import { translateText, translationNotice } from "./traduccion";

type Category = "junta-directiva" | "equipo" | "socios";
type Profile = Person & { category: Category; roleId: string };
type Role = { id: string; name: string; nameEn: string };
const categories = [
  { id: "junta-directiva", label: "Junta directiva", icon: Landmark, description: "Gobernanza y liderazgo institucional", singular: "miembro", accent: "#2381C4", tint: "#edf6fc", border: "#dce7ef" },
  { id: "equipo", label: "Nuestro equipo", icon: Users, description: "Personas y cargos de la organización", singular: "integrante", accent: "#2381C4", tint: "#edf6fc", border: "#dce7ef" },
  { id: "socios", label: "Socios y aliados", icon: Handshake, description: "Organizaciones y colaboración", singular: "aliado", accent: "#2381C4", tint: "#edf6fc", border: "#dce7ef" },
] as const;
const rolesKey = "admin_cargos";
function normalizeProfile(raw: unknown): Profile {
  const base = normalizePerson(raw);
  const r = raw && typeof raw === "object" ? raw as Record<string, unknown> : {};
  const category = r["category"];
  return { ...base, category: category === "junta-directiva" || category === "socios" ? category : "equipo", roleId: typeof r["roleId"] === "string" ? r["roleId"] : "" };
}
function normalizeRole(raw: unknown): Role {
  const r = raw && typeof raw === "object" ? raw as Record<string, unknown> : {};
  return { id: typeof r["id"] === "string" ? r["id"] : uid(), name: typeof r["name"] === "string" ? r["name"] : "", nameEn: typeof r["nameEn"] === "string" ? r["nameEn"] : "" };
}
const blank = (category: Category): Profile => ({ id: uid(), name: "", image: "", description: "", descriptionEn: "", role: "", roleEn: "", roleId: "", group: "programas", category });
const folded = (value: string) => value.trim().toLocaleLowerCase("es");

export default function EquipoAdmin() {
  const { items, save } = useStore(keys.equipo, normalizeProfile);
  const { items: roles, save: saveRoles } = useStore(rolesKey, normalizeRole);
  const [busy,setBusy]=useState(false);
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
  function start(c: Category) { setCategory(c); setDraft(blank(c)); setManageRoles(false); setRoleDraft(null); clearNotice(); }
  function edit(p: Profile) { const role = roleFor(p); setDraft({ ...p, roleId: role?.id ?? p.roleId }); setCategory(p.category); clearNotice(); }
  async function submit(e: FormEvent) {
    e.preventDefault(); if (!draft || busy) return;
    if (!draft.name.trim() || !draft.description.trim() || !safeUrl(draft.image, true)) { setError("Completa nombre, fotografía válida y texto o descripción."); return; }
    const role = roles.find(r => r.id === draft.roleId);
    if (draft.category === "equipo" && !role && !draft.role.trim()) { setError("Selecciona o crea un cargo."); return; }
    let descriptionEn=draft.descriptionEn; let roleEn=role?.nameEn || draft.roleEn;
    setBusy(true); try { if(!descriptionEn.trim()) descriptionEn=await translateText(draft.description); if(draft.category==="equipo"&&!roleEn.trim()) roleEn=await translateText(role?.name??draft.role); } catch(e){setError(e instanceof Error?e.message:"No se pudo traducir.");return;} finally{setBusy(false);}
    setDraft({...draft,descriptionEn,roleEn});
    setPending({ type: "save", person: { ...draft, descriptionEn, name: draft.name.trim(), description: draft.description.trim(), role: draft.category === "equipo" ? role?.name ?? draft.role : "", roleEn: draft.category === "equipo" ? roleEn : "", roleId: draft.category === "equipo" ? role?.id ?? "" : "" } });
  }
  function commit() {
    if (!pending) return;
    const { person, type } = pending; setPending(null);
    const next = type === "delete" ? items.filter(p => p.id !== person.id) : items.some(p => p.id === person.id) ? items.map(p => p.id === person.id ? person : p) : [...items, person];
    const err = save(next); setError(err);
    if (!err) { setDraft(null); setSuccess(type === "delete" ? "Registro eliminado." : "Registro guardado localmente."); }
  }
  async function submitRole(e: FormEvent) {
    e.preventDefault(); if (!roleDraft || busy) return;
    const name = roleDraft.name.trim();
    if (!name) { setError("Escribe el nombre del cargo."); return; }
    if (roles.some(r => r.id !== roleDraft.id && folded(r.name) === folded(name))) { setError("Este cargo ya existe."); return; }
    let nameEn=roleDraft.nameEn.trim();setBusy(true);try{if(!nameEn)nameEn=await translateText(name);}catch(e){setError(e instanceof Error?e.message:"No se pudo traducir.");return;}finally{setBusy(false);}
    const updated = { ...roleDraft, name, nameEn };
    const old = roles.find(r => r.id === updated.id);
    const err = saveRoles(old ? roles.map(r => r.id === updated.id ? updated : r) : [...roles, updated]);
    setError(err); if (err) return;
    if (draft?.category === "equipo") patch({ roleId: updated.id, role: updated.name, roleEn: updated.nameEn });
    setRoleDraft(null); setSuccess("Cargo guardado.");
  }
  function removeRole() {
    if (!deleteRole) return;
    const target = deleteRole; setDeleteRole(null);
    if (items.some(p => p.category === "equipo" && roleFor(p)?.id === target.id) || draft?.roleId === target.id) { setError("No puedes eliminar un cargo asignado. Cambia primero el cargo de los integrantes."); return; }
    const err = saveRoles(roles.filter(r => r.id !== target.id)); setError(err); if (!err) setSuccess("Cargo eliminado.");
  }
  const filtered = items.filter(p => p.category === category && folded(`${p.name} ${roleName(p)} ${p.description}`).includes(folded(query)));
  const count = items.filter(p => p.category === category).length;
  const actionClass = "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold text-white shadow-sm transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-offset-2 motion-reduce:transition-none";
  return <div className="mx-auto max-w-7xl space-y-6">
    <AdminHeading title="Nosotros" description="Gestiona las personas y organizaciones que forman parte de Armonía." count={items.length}/>
    <CategoryCards categories={categories.map(c=>({...c,count:items.filter(p=>p.category===c.id).length}))} active={category} disabled={!!draft||busy} onChange={id=>{const c=categories.find(x=>x.id===id);if(c){setCategory(c.id);setQuery("");setManageRoles(false);setRoleDraft(null);clearNotice();}}}/>
    <p className="text-sm text-black">{translationNotice}</p>
    <Notice error={error} success={success}/>
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-4"><div className="flex items-center gap-3"><span style={{backgroundColor:active.tint,color:active.accent}} className="grid size-11 shrink-0 place-items-center rounded-xl"><active.icon className="size-5"/></span><div><h2 className="text-xl font-bold text-brand-deep">{active.label}</h2><p className="text-sm text-black">{count} {count===1?"registro":"registros"}</p></div></div><div className="flex flex-wrap gap-2">{category === "equipo" && <button type="button" className={secondary} disabled={busy} onClick={() => { setManageRoles(v => !v); setRoleDraft(null); clearNotice(); }}><Briefcase className="size-4"/>{manageRoles ? "Cerrar cargos" : "Gestionar cargos"}</button>}{!draft && <button type="button" style={{backgroundColor:active.accent}} className={actionClass} onClick={() => start(category)}><Plus className="size-5"/>Añadir {active.singular}</button>}</div></div>
    </section>
    {manageRoles && category === "equipo" && <section className={`${panel} space-y-4 border-[#dce7ef]`}>
      <div className="flex flex-wrap items-center justify-between gap-3"><h3 className="font-display text-xl text-brand-deep">Cargos del equipo</h3><button type="button" className={secondary} disabled={busy} onClick={() => { setRoleDraft({ id: uid(), name: "", nameEn: "" }); clearNotice(); }}><Plus className="size-4"/>Nuevo cargo</button></div>
      {roleDraft && <form onSubmit={submitRole} className="space-y-3 rounded-xl border border-[#dce7ef] bg-[#edf6fc] p-4"><fieldset disabled={busy} className="space-y-3"><div className="grid gap-3 sm:grid-cols-2"><Field label="Cargo (ES)"><input required className={field} value={roleDraft.name} onChange={e => setRoleDraft({ ...roleDraft, name: e.target.value, nameEn:"" })}/></Field><Field label="Cargo (EN, automático o editable)"><input className={field} value={roleDraft.nameEn} onChange={e => setRoleDraft({ ...roleDraft, nameEn: e.target.value })}/></Field></div><div className="flex gap-2"><button className={primary} type="submit">{busy?"Traduciendo…":"Guardar cargo"}</button><CloseButton onClick={() => setRoleDraft(null)}/></div></fieldset></form>}
      {!roles.length && <p className="text-sm text-black">Todavía no hay cargos registrados.</p>}
      <div className="divide-y divide-border">{roles.map(r => <div key={r.id} className="flex flex-wrap items-center justify-between gap-2 py-3"><span className="font-medium">{r.name}{r.nameEn && <span className="ml-2 text-sm text-black">{r.nameEn}</span>}</span><div className="flex gap-2"><button type="button" className={secondary} onClick={() => { setRoleDraft({ ...r }); clearNotice(); }}><Pencil className="size-4"/>Editar</button><button type="button" className={`${secondary} text-red-700`} onClick={() => setDeleteRole(r)}><Trash2 className="size-4"/>Eliminar</button></div></div>)}</div>
    </section>}
    {draft ? <form onSubmit={submit} className={`${panel} space-y-6`} style={{borderTop: `4px solid ${active.accent}`}}><fieldset disabled={busy} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3"><h3 className="font-display text-xl text-brand-deep">{items.some(p => p.id === draft.id) ? "Editar registro" : "Nuevo registro"} · {active.label}</h3><CloseButton onClick={() => { setDraft(null); clearNotice(); }}/></div>
      <div className="grid gap-5 lg:grid-cols-[1fr_2fr]"><div className="space-y-4 rounded-2xl bg-slate-50 p-4"><div className="flex items-center gap-2 font-semibold text-brand-deep"><ImagePlus className="size-5"/>Imagen del perfil</div><Field label={category === "socios" ? "Fotografía o logotipo" : "Fotografía"}><ImageInput key={draft.id} value={draft.image} onChange={image => setDraft(d => d?.id === draft.id ? { ...d, image } : d)}/></Field></div><div className="space-y-4">
      <Field label={category === "socios" ? "Nombre del socio o aliado" : "Nombre completo"}><input required className={field} value={draft.name} onChange={e => patch({ name: e.target.value })}/></Field>
      {category === "equipo" && <div className="space-y-2"><Field label="Cargo"><select className={field} required value={draft.roleId || (draft.role ? "legacy" : "")} onChange={e => { const r = roles.find(x => x.id === e.target.value); if (e.target.value === "legacy") return; patch({ roleId: r?.id ?? "", role: r?.name ?? "", roleEn: r?.nameEn ?? "" }); }}><option value="">Selecciona un cargo</option>{draft.role && !draft.roleId && <option value="legacy">{draft.role} (cargo anterior)</option>}{roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}</select></Field><button type="button" className={secondary} onClick={() => { setManageRoles(true); setRoleDraft({ id: uid(), name: "", nameEn: "" }); clearNotice(); }}><Plus className="size-4"/>Crear cargo</button></div>}
      <Field label={category === "equipo" ? "Descripción (ES)" : "Texto (ES)"}><textarea required rows={6} className={field} value={draft.description} onChange={e => patch({ description: e.target.value, descriptionEn:"" })}/></Field>
      <Field label={category === "equipo" ? "Descripción (EN, automático o editable)" : "Texto (EN, automático o editable)"}><textarea rows={4} className={field} value={draft.descriptionEn} onChange={e => patch({ descriptionEn: e.target.value })}/></Field>
      </div></div><div className="flex flex-wrap justify-end gap-2 border-t border-slate-200 pt-4"><CloseButton onClick={() => { setDraft(null); clearNotice(); }}/><button type="submit" style={{backgroundColor:active.accent}} className={actionClass}><CheckCircle2 className="size-4"/>{busy?"Traduciendo…":"Guardar registro"}</button></div></fieldset></form> : <>
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 shadow-sm"><Search className="size-5 text-black"/><input className="w-full bg-transparent py-3 outline-none" aria-label="Buscar registros" placeholder="Buscar por nombre, cargo o texto…" value={query} onChange={e => setQuery(e.target.value)}/></div>
      {!filtered.length ? <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center"><span style={{color:active.accent,backgroundColor:active.tint}} className="mx-auto grid size-20 place-items-center rounded-3xl"><active.icon className="size-9"/></span><h3 className="mt-5 text-xl font-bold text-brand-deep">{query?"No encontramos coincidencias":"Aún no hay registros"}</h3><p className="mx-auto mt-2 max-w-sm text-sm text-black">{query?"Prueba con otro nombre o palabra.":"Añade el primer perfil para empezar a completar esta sección."}</p><button type="button" className={`${actionClass} mt-5`} style={{backgroundColor:active.accent}} onClick={()=>query?setQuery(""):start(category)}>{query?"Limpiar búsqueda":`Añadir ${active.singular}`}</button></div> : <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{filtered.map(p => <article key={p.id} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg motion-reduce:transform-none motion-reduce:transition-none"><div style={{backgroundColor:active.tint}} className="relative grid aspect-[16/10] place-items-center overflow-hidden">{safeUrl(p.image,true) ? <img src={p.image} alt={p.name} className={`size-full transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none ${p.category === "socios" ? "object-contain p-5" : "object-cover"}`}/> : <UserRound style={{color:active.accent}} className="size-16 opacity-50"/>}</div><div className="space-y-2 p-4"><h3 className="font-display text-xl font-bold text-brand-deep">{p.name}</h3>{p.category === "equipo" && <p style={{backgroundColor:active.tint,color:active.accent}} className="inline-block rounded-full px-3 py-1 text-sm font-semibold">{roleName(p)}</p>}<p className="line-clamp-3 whitespace-pre-line text-sm text-black">{p.description}</p><div className="flex flex-wrap gap-2 pt-2"><button type="button" className={secondary} onClick={() => edit(p)}><Pencil className="size-4"/>Editar</button><button type="button" className={`${secondary} text-red-700`} onClick={() => setPending({ type: "delete", person: p })}><Trash2 className="size-4"/>Eliminar</button></div></div></article>)}</div>}
    </>}
    {pending && <Confirm danger={pending.type === "delete"} text={`${pending.type === "delete" ? "¿Eliminar" : "¿Guardar"} el registro de ${pending.person.name}?`} onClose={() => setPending(null)} onConfirm={commit}/>}
    {deleteRole && <Confirm danger text={`¿Eliminar el cargo ${deleteRole.name}?`} onClose={() => setDeleteRole(null)} onConfirm={removeRole}/>}
  </div>;
}
