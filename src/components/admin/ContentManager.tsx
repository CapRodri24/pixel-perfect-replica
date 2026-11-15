import { useState, type FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Languages, Loader2, Pencil, Plus, Trash2, Upload, X, FileText } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { contentQueryKey, uploadMedia, useContent, youtubeId, type ContentItem, type ContentKind } from "@/lib/cms";
import { translateToEnglish } from "@/lib/translate.functions";
import { landscapes } from "@/config/content";
import es from "@/i18n/es.json";
import { Button } from "@/components/ui/button";

const field = "mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

const labels: Record<ContentKind, { title: string; body: string; singular: string }> = {
  landscape: { title: "Título", body: "Texto", singular: "paisaje" },
  program: { title: "Título", body: "Texto", singular: "programa" },
  news: { title: "Título", body: "Texto", singular: "noticia" },
  team: { title: "Nombre", body: "Descripción", singular: "miembro" },
  library: { title: "Título del documento", body: "Descripción", singular: "documento" },
};

type Draft = { id?: string; title_es: string; title_en: string; body_es: string; body_en: string; images: string[]; landscape_ref: string; youtube_url: string; file_url: string; file_name: string };
const empty: Draft = { title_es: "", title_en: "", body_es: "", body_en: "", images: [], landscape_ref: "", youtube_url: "", file_url: "", file_name: "" };

export function ContentManager({ kind }: { kind: ContentKind }) {
  const qc = useQueryClient();
  const { data = [], isLoading } = useContent();
  const items = data.filter((i) => i.kind === kind);
  const dynamicLandscapes = data.filter((i) => i.kind === "landscape");
  const translate = useServerFn(translateToEnglish);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [busy, setBusy] = useState<"" | "upload" | "save" | "translate">("");
  const L = labels[kind];
  const multiImage = kind === "landscape" || kind === "news" || kind === "program";

  const set = (p: Partial<Draft>) => setDraft((d) => (d ? { ...d, ...p } : d));
  const edit = (i: ContentItem) => setDraft({ id: i.id, title_es: i.title_es, title_en: i.title_en, body_es: i.body_es, body_en: i.body_en, images: i.images, landscape_ref: i.landscape_ref ?? "", youtube_url: i.youtube_url ?? "", file_url: i.file_url ?? "", file_name: i.file_name ?? "" });

  const onImages = async (files: FileList | null) => {
    if (!files?.length || !draft) return;
    setBusy("upload");
    try {
      const urls = await Promise.all(Array.from(files).map(uploadMedia));
      set({ images: multiImage ? [...draft.images, ...urls] : urls.slice(0, 1) });
    } catch (e) { toast.error("No se pudo subir: " + (e as Error).message); }
    setBusy("");
  };
  const onFile = async (files: FileList | null) => {
    const f = files?.[0]; if (!f) return;
    setBusy("upload");
    try { set({ file_url: await uploadMedia(f), file_name: f.name }); } catch (e) { toast.error((e as Error).message); }
    setBusy("");
  };
  const runTranslate = async (d: Draft) => {
    const r = await translate({ data: { title: d.title_es, body: d.body_es } });
    return { title_en: r.title || d.title_en, body_en: r.body || d.body_en };
  };
  const doTranslate = async () => {
    if (!draft) return;
    setBusy("translate");
    try { set(await runTranslate(draft)); toast.success("Traducción lista"); } catch { toast.error("No se pudo traducir"); }
    setBusy("");
  };
  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    if (kind === "library" && !draft.file_url) { toast.error("Sube un documento"); return; }
    setBusy("save");
    let d = draft;
    if (!d.title_en || (d.body_es && !d.body_en)) {
      try { d = { ...d, ...(await runTranslate(d)) }; } catch { /* keep Spanish only */ }
    }
    const row = {
      kind, title_es: d.title_es, title_en: d.title_en, body_es: d.body_es, body_en: d.body_en, images: d.images,
      landscape_ref: d.landscape_ref || null, youtube_url: d.youtube_url || null, file_url: d.file_url || null, file_name: d.file_name || null,
    };
    const { error } = d.id ? await supabase.from("content_items").update(row).eq("id", d.id) : await supabase.from("content_items").insert(row);
    setBusy("");
    if (error) { toast.error(error.message); return; }
    toast.success("Guardado. Ya aparece en el sitio.");
    setDraft(null);
    qc.invalidateQueries({ queryKey: contentQueryKey });
  };
  const remove = async (id: string) => {
    if (!confirm("¿Eliminar este elemento?")) return;
    const { error } = await supabase.from("content_items").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    qc.invalidateQueries({ queryKey: contentQueryKey });
  };
  const landscapeName = (ref: string | null) => {
    if (!ref) return null;
    const s = es.landscapes.items[ref as keyof typeof es.landscapes.items];
    return s?.name ?? dynamicLandscapes.find((l) => l.id === ref)?.title_es ?? null;
  };

  if (draft) {
    return (
      <form onSubmit={save} className="max-w-3xl rounded-3xl bg-background p-6 shadow-card sm:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl text-brand-deep">{draft.id ? "Editar" : "Nuevo"} {L.singular}</h2>
          <Button type="button" variant="ghost" size="icon" onClick={() => setDraft(null)} aria-label="Cerrar"><X /></Button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Español</p>
            <label className="block text-sm font-semibold">{L.title}<input required value={draft.title_es} onChange={(e) => set({ title_es: e.target.value })} className={field} /></label>
            <label className="block text-sm font-semibold">{L.body}<textarea rows={6} value={draft.body_es} onChange={(e) => set({ body_es: e.target.value })} className={field} /></label>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-widest text-primary">English</p>
              <Button type="button" size="sm" variant="secondary" onClick={doTranslate} disabled={!!busy || !draft.title_es}>
                {busy === "translate" ? <Loader2 className="animate-spin" /> : <Languages />} Traducir
              </Button>
            </div>
            <label className="block text-sm font-semibold">{L.title} (EN)<input value={draft.title_en} onChange={(e) => set({ title_en: e.target.value })} className={field} placeholder="Se traduce automáticamente al guardar" /></label>
            <label className="block text-sm font-semibold">{L.body} (EN)<textarea rows={6} value={draft.body_en} onChange={(e) => set({ body_en: e.target.value })} className={field} /></label>
          </div>
        </div>

        {kind !== "library" && (
          <div className="mt-6">
            <p className="text-sm font-semibold">{kind === "team" ? "Foto" : "Imágenes"}</p>
            <div className="mt-2 flex flex-wrap gap-3">
              {draft.images.map((src) => (
                <div key={src} className="relative">
                  <img src={src} alt="" className="size-24 rounded-xl object-cover" />
                  <button type="button" onClick={() => set({ images: draft.images.filter((s) => s !== src) })} className="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full bg-destructive text-destructive-foreground" aria-label="Quitar"><X className="size-3" /></button>
                </div>
              ))}
              <label className="grid size-24 cursor-pointer place-items-center rounded-xl border-2 border-dashed border-input text-muted-foreground hover:border-primary hover:text-primary">
                {busy === "upload" ? <Loader2 className="size-5 animate-spin" /> : <Upload className="size-5" />}
                <input type="file" accept="image/*" multiple={multiImage} className="sr-only" onChange={(e) => onImages(e.target.files)} />
              </label>
            </div>
          </div>
        )}

        {(kind === "news" || kind === "program") && (
          <label className="mt-6 block text-sm font-semibold">Paisaje asociado (opcional)
            <select value={draft.landscape_ref} onChange={(e) => set({ landscape_ref: e.target.value })} className={field}>
              <option value="">— Ninguno —</option>
              {landscapes.map((l) => <option key={l.id} value={l.id}>{es.landscapes.items[l.id].name}</option>)}
              {dynamicLandscapes.map((l) => <option key={l.id} value={l.id}>{l.title_es}</option>)}
            </select>
          </label>
        )}
        {kind === "news" && (
          <label className="mt-4 block text-sm font-semibold">Enlace de YouTube (opcional)
            <input type="url" value={draft.youtube_url} onChange={(e) => set({ youtube_url: e.target.value })} placeholder="https://www.youtube.com/watch?v=…" className={field} />
            {draft.youtube_url && !youtubeId(draft.youtube_url) && <span className="mt-1 block text-xs text-destructive">El enlace no parece de YouTube.</span>}
          </label>
        )}
        {kind === "library" && (
          <div className="mt-6">
            <p className="text-sm font-semibold">Documento (PDF u otro)</p>
            <label className="mt-2 flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-input p-4 text-sm hover:border-primary">
              {busy === "upload" ? <Loader2 className="size-5 animate-spin" /> : <FileText className="size-5 text-primary" />}
              {draft.file_name || "Seleccionar archivo"}
              <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip" className="sr-only" onChange={(e) => onFile(e.target.files)} />
            </label>
          </div>
        )}
        <div className="mt-8 flex gap-3">
          <Button type="submit" variant="hero" disabled={!!busy}>{busy === "save" ? <Loader2 className="animate-spin" /> : null} Guardar</Button>
          <Button type="button" variant="outline" onClick={() => setDraft(null)}>Cancelar</Button>
        </div>
      </form>
    );
  }

  return (
    <div>
      <Button variant="hero" onClick={() => setDraft({ ...empty })}><Plus /> Crear {L.singular}</Button>
      {isLoading ? <Loader2 className="mt-8 animate-spin text-primary" /> : items.length === 0 ? (
        <p className="mt-8 rounded-3xl bg-background p-10 text-center text-muted-foreground">Aún no hay elementos. Crea el primero.</p>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((i) => (
            <li key={i.id} className="flex flex-col overflow-hidden rounded-3xl bg-background shadow-card">
              {i.images[0] ? <img src={i.images[0]} alt="" className="aspect-[16/10] w-full object-cover" /> : <div className="grid aspect-[16/10] place-items-center bg-secondary text-primary"><FileText className="size-8" /></div>}
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg text-brand-deep">{i.title_es}</h3>
                <p className="text-xs text-muted-foreground">EN: {i.title_en || "—"}</p>
                {landscapeName(i.landscape_ref) && <p className="mt-2 text-xs font-semibold text-primary">{landscapeName(i.landscape_ref)}</p>}
                {i.file_name && <p className="mt-2 text-xs text-muted-foreground">{i.file_name}</p>}
                <div className="mt-auto flex gap-2 pt-4">
                  <Button size="sm" variant="outline" onClick={() => edit(i)}><Pencil /> Editar</Button>
                  <Button size="sm" variant="ghost" onClick={() => remove(i.id)}><Trash2 /> Eliminar</Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
