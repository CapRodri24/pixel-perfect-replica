import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Search, X, BookOpen } from 'lucide-react';
import { useI18n } from '@/i18n/I18nProvider';
import { Button } from '@/components/ui/button';
import FormatoRecursos from './recursos/formato_recursos';
import { resources, resourceTypes, type ResourceType } from './recursos/recursos-mock';
export default function Recursos() {
  const { lang } = useI18n();
  const es = lang === 'es';
  const { hash, key } = useLocation();
  const category = resourceTypes.find(item => `#${item.id}` === hash)?.id ?? 'all';
  const [query, setQuery] = useState('');
  useEffect(() => {
    setQuery('');
    const frame = requestAnimationFrame(() => {
      if (category !== 'all') document.getElementById('recursos-listado')?.scrollIntoView({ block: 'start' });
      else window.scrollTo({ top: 0, behavior: 'instant' });
    });
    return () => cancelAnimationFrame(frame);
  }, [key, category]);
  const filtered = resources.filter(item => (category === 'all' || item.type === category) && `${es ? item.title.es + ' ' + item.description.es : item.title.en + ' ' + item.description.en} ${item.year} ${item.format}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  const filterLink = (id: ResourceType | 'all', label: string) => <Link key={id} to={id === 'all' ? '/recursos' : `/recursos#${id}`} aria-current={category === id ? 'true' : undefined} className={`armonia-subindice shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${category === id ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background hover:bg-secondary'}`}><BookOpen className="size-4 shrink-0" aria-hidden="true"/>{label}</Link>;
  return <div id="recursos" className="min-h-[70vh]">
    <section className="relative isolate overflow-hidden bg-brand-deep text-white"><img src="/images/home/2.jpg" alt="" className="absolute inset-0 -z-20 size-full object-cover"/><div className="absolute inset-0 -z-10 bg-linear-to-r from-black/80 via-black/55 to-black/20"/><div className="container-site py-14 sm:py-20"><Link to="/" className="inline-flex items-center gap-2 text-sm text-white/85 hover:text-white"><ArrowLeft className="size-4"/>{es ? 'Inicio' : 'Home'}</Link><h1 className="mt-6 font-display text-5xl sm:text-6xl">{es ? 'Recursos' : 'Resources'}</h1><p className="mt-4 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">{es ? 'Explora informes, publicaciones, mapas y herramientas que acompañan nuestro trabajo de conservación.' : 'Explore reports, publications, maps and tools supporting our conservation work.'}</p></div></section>
    <section id="recursos-listado" className="section"><div className="container-site"><h2 className="font-display text-3xl text-brand-deep">{es ? 'Centro de recursos' : 'Resource centre'}</h2><form onSubmit={e => e.preventDefault()} className="mt-6 flex gap-3"><div className="relative flex-1 min-w-0"><Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/><input value={query} onChange={e => setQuery(e.target.value)} aria-label={es ? 'Buscar recursos' : 'Search resources'} placeholder={es ? 'Buscar por título, año o formato…' : 'Search by title, year or format…'} className="h-11 w-full rounded-full border border-input bg-background pl-11 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-ring"/>{query && <button type="button" onClick={() => setQuery('')} aria-label={es ? 'Limpiar' : 'Clear'} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="size-4"/></button>}</div><Button type="submit" className="rounded-full">{es ? 'Buscar' : 'Search'}</Button></form>
    <nav aria-label={es ? 'Tipos de recursos' : 'Resource types'} className="mt-5 flex flex-wrap gap-2 pb-3">{filterLink('all', es ? 'Todo' : 'All')}{resourceTypes.map(item => filterLink(item.id, es ? item.es : item.en))}</nav>
    <p className="mt-4 text-sm text-muted-foreground" aria-live="polite">{filtered.length} {es ? 'recursos de demostración' : 'demo resources'}</p>
    {filtered.length ? <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{filtered.map(item => <FormatoRecursos key={item.id} resource={item}/>)}</div> : <div className="mt-6 rounded-2xl bg-muted p-8 text-center"><p>{es ? 'No se encontraron recursos.' : 'No resources found.'}</p><Button variant="outline" className="mt-4" asChild><Link to="/recursos">{es ? 'Ver todos' : 'View all'}</Link></Button></div>}</div></section>
  </div>;
}
