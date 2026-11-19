import { FileText, Download, Map, BookOpen, Handshake, Scale } from 'lucide-react';
import { useI18n } from '@/i18n/I18nProvider';
import { resourceTypes, type Resource } from './recursos-mock';
const icons = { informes: FileText, publicaciones: BookOpen, sig: Map, colaboraciones: Handshake, legales: Scale };
export default function FormatoRecursos({ resource }: { resource: Resource }) {
  const { lang } = useI18n();
  const es = lang === 'es';
  const Icon = icons[resource.type];
  const category = resourceTypes.find(item => item.id === resource.type);
  return <article className="group flex h-full flex-col rounded-3xl border border-border bg-background p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-card motion-reduce:transition-none">
    <div className="flex items-start justify-between gap-3"><span className="grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary"><Icon className="size-7" /></span><span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold">{resource.format} · {resource.year}</span></div>
    <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-primary">{es ? category?.es : category?.en}</p>
    <h3 className="mt-2 font-display text-2xl text-brand-deep">{es ? resource.title.es : resource.title.en}</h3>
    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{es ? resource.description.es : resource.description.en}</p>
    {resource.url ? <a href={resource.url} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"><Download className="size-4" />{es ? 'Abrir recurso' : 'Open resource'}</a> : <span className="mt-6 inline-flex items-center gap-2 text-xs text-muted-foreground"><FileText className="size-4" />{es ? 'Demo · archivo aún no cargado' : 'Demo · file not uploaded yet'}</span>}
  </article>;
}
