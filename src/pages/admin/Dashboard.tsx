import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowRight,
  Map,
  Briefcase,
  Newspaper,
  Users,
  BookOpen,
  HardDrive,
  Landmark,
  Handshake,
  FileText,
  Clock,
  RefreshCw,
} from "lucide-react";
import { obtenerDashboard, type DashboardResumen, type TipoRegistro } from "@/api/dashboardApi";
import { PageTitle, panel } from "./ui";

const labels: Record<TipoRegistro, string> = {
  paisaje: "Paisaje", programa: "Programa", noticia: "Noticia",
  nosotros: "Nosotros", recurso: "Recurso",
};

const details = [
  { key: "junta", title: "Junta directiva", icon: Landmark },
  { key: "equipo", title: "Nuestro equipo", icon: Users },
  { key: "socios", title: "Socios y aliados", icon: Handshake },
  { key: "pdfs", title: "PDF vinculados", icon: FileText },
] as const;

function dateLabel(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}:\d{2})$/.exec(value);
  return match ? `${match[3]}/${match[2]}/${match[1]} · ${match[4]}` : value;
}

export function Dashboard() {
  const [data, setData] = useState<DashboardResumen | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    obtenerDashboard(controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) setData(result);
      })
      .catch((reason: unknown) => {
        if (!controller.signal.aborted) {
          setError(reason instanceof Error ? reason.message : "No se pudo consultar el panel.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [attempt]);

  const landscapes = data?.relaciones_paisajes ?? [];
  const stats = [
    {
      label: "Paisajes",
      count: data?.paisajes ?? "—",
      to: "/admin/paisajes",
      icon: Map,
      color: "text-primary bg-[#eaf4fc]",
    },
    {
      label: "Programas",
      count: data?.programas ?? "—",
      to: "/admin/programas",
      icon: Briefcase,
      color: "text-primary bg-[#eaf4fc]",
    },
    {
      label: "Noticias",
      count: data?.noticias ?? "—",
      to: "/admin/noticias",
      icon: Newspaper,
      color: "text-primary bg-[#eaf4fc]",
    },
    {
      label: "Nosotros",
      count: data?.nosotros ?? "—",
      to: "/admin/equipo",
      icon: Users,
      color: "text-primary bg-[#eaf4fc]",
    },
    {
      label: "Recursos",
      count: data?.recursos ?? "—",
      to: "/admin/recursos",
      icon: BookOpen,
      color: "text-primary bg-[#eaf4fc]",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl min-w-0">
      <PageTitle
        title="Panel de administración"
        description="Gestiona el contenido del sitio web de Asociación Armonía."
      />

      <section className="relative isolate overflow-hidden rounded-3xl bg-brand-deep p-6 text-white sm:p-9">
        <img
          src="/images/home/1.jpg"
          alt=""
          className="absolute inset-0 -z-20 size-full object-cover"
        />

        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#123c60]/95 via-[#123c60]/80 to-[#123c60]/35" />

        <p className="text-xs font-semibold uppercase tracking-[.2em] text-white/80">
          Asociación Armonía
        </p>

        <h2 className="mt-3 font-display text-3xl text-white">
          Bienvenido al gestor de contenidos
        </h2>

        <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/90">
          Crea y organiza paisajes, programas, noticias, perfiles y recursos
          desde un mismo espacio.
        </p>
      </section>

      {/* Tarjetas: carrusel en celular, cuadrícula en escritorio */}
      <div
        aria-label="Secciones del panel de administración"
        className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-5 [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:overflow-visible xl:grid-cols-5"
      >
        {stats.map((s) => {
          const Icon = s.icon;

          return (
            <Link
              to={s.to}
              key={s.to}
              className="group flex w-[72%] max-w-[270px] shrink-0 snap-start flex-col rounded-2xl border border-border bg-background p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md motion-reduce:transition-none sm:w-auto sm:max-w-none"
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`grid size-10 place-items-center rounded-xl ${s.color}`}
                >
                  <Icon className="size-5" />
                </span>

                <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-primary" />
              </div>

              <p className="mt-4 text-sm text-muted-foreground">
                {s.label}
              </p>

              <p className="mt-1 text-3xl font-bold tabular-nums text-brand-deep">
                {s.count}
              </p>
            </Link>
          );
        })}
      </div>

      {/* Indicador de navegación móvil */}
      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground sm:hidden">
        <span>Desliza para ver más secciones</span>
        <ArrowRight className="size-4" />
      </div>

      {/* Paisajes y programas / Noticias */}
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <section className={panel}>
          <h2 className="font-display text-xl text-brand-deep">
            Paisajes y programas
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Relaciones registradas en la base de datos.
          </p>

          <div className="mt-4 divide-y divide-border">
            {landscapes.map((l) => (
              <div
                key={l.id}
                className="flex items-center justify-between gap-3 py-3 text-sm"
              >
                <span>{l.titulo}</span>

                <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                  {l.programas}{" "}
                  {l.programas === "1" ? "programa" : "programas"}
                </span>
              </div>
            ))}

            {!landscapes.length && (
              <p className="py-3 text-sm text-muted-foreground">
                {data ? "No hay paisajes registrados." : loading ? "Cargando paisajes…" : "No se pudieron consultar los paisajes."}
              </p>
            )}
          </div>
        </section>

        <section className={panel}>
          <h2 className="font-display text-xl text-brand-deep">
            Noticias
          </h2>

          <div className="mt-4 space-y-3">
            <div className="flex justify-between rounded-xl bg-muted/40 p-3 text-sm">
              <span>Asociadas a un programa</span>
              <strong>{data?.noticias_asociadas ?? "—"}</strong>
            </div>

            <div className="flex justify-between rounded-xl bg-muted/40 p-3 text-sm">
              <span>Publicaciones</span>
              <strong>{data?.noticias_independientes ?? "—"}</strong>
            </div>

            <div className="flex justify-between rounded-xl bg-muted/40 p-3 text-sm">
              <span>Asociación pendiente</span>
              <strong>{data?.noticias_pendientes ?? "—"}</strong>
            </div>
          </div>

          <Link
            to="/admin/noticias"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary"
          >
            Gestionar noticias
            <ArrowUpRight className="size-4" />
          </Link>
        </section>
      </div>

      {/* Detalle institucional y documental */}
      <section className={`mt-6 ${panel}`}>
        <h2 className="font-display text-xl text-brand-deep">
          Detalle institucional y documental
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {details.map(({ key, title, icon: Icon }) => (
            <div key={key} className="flex min-w-0 items-center gap-3 rounded-xl bg-muted/40 p-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#eaf4fc] text-primary">
                <Icon className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">{title}</p>
                <p className="mt-1 text-2xl font-bold tabular-nums text-brand-deep">{data?.[key] ?? "—"}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Últimas actualizaciones */}
      <section className={`mt-6 ${panel}`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 font-display text-xl text-brand-deep">
            <Clock className="size-5 shrink-0 text-primary" />
            Últimas actualizaciones
          </h2>
          <button
            type="button"
            disabled={loading}
            onClick={() => setAttempt((value) => value + 1)}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm font-semibold text-primary hover:border-primary disabled:opacity-60"
          >
            <RefreshCw className={`size-4 ${loading ? "animate-spin motion-reduce:animate-none" : ""}`} />
            {loading ? "Cargando…" : "Actualizar"}
          </button>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Últimos ocho registros creados o modificados. Hora de Bolivia.
        </p>
        <div className="mt-4 divide-y divide-border">
          {data?.recientes.map((item) => (
            <div key={`${item.tipo}-${item.id}`} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
              <div className="min-w-0 flex-1">
                <p className="break-words font-semibold text-brand-deep">{item.titulo}</p>
                <p className="mt-1 text-xs text-muted-foreground">{labels[item.tipo]}</p>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">{dateLabel(item.fecha)}</span>
            </div>
          ))}
          {!data?.recientes.length && (
            <p className="py-3 text-sm text-muted-foreground">
              {data ? "Todavía no hay registros." : loading ? "Cargando registros…" : "No se pudieron consultar las actualizaciones."}
            </p>
          )}
        </div>
        {data && (
          <p className="mt-3 text-xs text-muted-foreground">
            Última consulta: {dateLabel(data.consultado_en)} (hora de Bolivia).
          </p>
        )}
      </section>

      {/* Estado de la consulta: solo durante la carga o ante un error */}
      {(loading || error) && (
        <div className="mt-5 flex items-start gap-3 rounded-xl border border-border bg-background p-4 text-sm text-muted-foreground" role={error ? "alert" : "status"}>
          <HardDrive className="mt-0.5 size-5 shrink-0 text-primary" />

          <p>
            <strong className="text-foreground">
              {loading ? "Consultando información." : "Información no disponible."}
            </strong>{" "}
            {loading ? "Cargando los registros de la base de datos." : `${error}${data ? " Se muestran los últimos datos consultados." : " Las cifras todavía no están disponibles."}`}
            {error && !loading && (
              <button type="button" onClick={() => setAttempt((value) => value + 1)} className="ml-2 font-semibold text-primary underline">
                Reintentar
              </button>
            )}
          </p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
