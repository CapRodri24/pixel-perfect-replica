import { useEffect, useRef, useState } from "react";
import {
  Users,
  Landmark,
  Handshake,
  UserRound,
  ChevronDown,
} from "lucide-react";

import { useI18n } from "@/i18n/I18nProvider";
import { sanitize } from "@/pages/admin/datos";
import { estilosTextoEnriquecido } from "@/lib/textoEnriquecido";

import {
  listarNosotros,
  listarCategorias,
  type Profile,
  type Category,
  type Role,
} from "@/api/nosotrosApi";

const sections = {
  "junta-directiva": {
    id: "junta-directiva",
    es: "Junta directiva",
    en: "Board of directors",
    icon: Landmark,
  },
  equipo: {
    id: "equipo",
    es: "Nuestro equipo",
    en: "Our team",
    icon: Users,
  },
  socios: {
    id: "socios",
    es: "Socios y aliados",
    en: "Partners and allies",
    icon: Handshake,
  },
};

const partnerSections = [
  {
    id: "socios_financieros",
    anchor: "socios-financieros",
    es: "Socios financieros",
    en: "Funding partners",
  },
  {
    id: "aliados_estrategicos",
    anchor: "aliados-estrategicos",
    es: "Aliados estratégicos",
    en: "Strategic allies",
  },
  {
    id: "miembros_corporativos",
    anchor: "miembros-corporativos",
    es: "Miembros corporativos",
    en: "Corporate members",
  },
];

// Tarjeta horizontal: foto o logo a la izquierda y el texto a la derecha.
// Así cada registro ocupa poco alto y caben dos por fila en pantallas grandes.
function Foto({ p }: { p: Profile }) {
  const [failed, setFailed] = useState(false);
  const isPartner = p.category === "socios";

  useEffect(() => {
    setFailed(false);
  }, [p.image]);

  return (
    <div
      className={`relative flex shrink-0 self-start items-center justify-center overflow-hidden rounded-xl ${
        isPartner
          ? "size-24 border border-border bg-white p-2.5 sm:size-32 sm:p-3"
          : "aspect-[4/5] w-24 bg-secondary/50 sm:w-32"
      }`}
    >
      {!failed && p.image ? (
        <img
          src={p.image}
          alt={p.name}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className={`block h-full w-full ${isPartner ? "object-contain" : "object-cover object-[center_20%]"}`}
        />
      ) : (
        <UserRound className="size-10 text-muted-foreground" aria-hidden="true" />
      )}
    </div>
  );
}

function Texto({ html, es }: { html: string; es: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [abierto, setAbierto] = useState(false);
  const [largo, setLargo] = useState(false);

  // Solo se ofrece «Leer más» si el texto realmente no cabe en 4 líneas.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const medir = () => { if (!abierto) setLargo(el.scrollHeight > el.clientHeight + 2); };
    medir();
    const obs = new ResizeObserver(medir);
    obs.observe(el);
    return () => obs.disconnect();
  }, [html, abierto]);

  return (
    <div className="mt-3">
      <div
        ref={ref}
        className={`whitespace-pre-line break-words text-sm leading-relaxed text-black sm:text-[15px] ${estilosTextoEnriquecido} ${abierto ? "" : "line-clamp-4"}`}
        dangerouslySetInnerHTML={{ __html: sanitize(html) }}
      />
      {(largo || abierto) && (
        <button
          type="button"
          onClick={() => setAbierto((v) => !v)}
          aria-expanded={abierto}
          className="mt-1.5 inline-flex min-h-8 items-center gap-1 text-sm font-semibold text-primary hover:underline"
        >
          {abierto ? (es ? "Ver menos" : "Show less") : (es ? "Leer más" : "Read more")}
          <ChevronDown className={`size-4 transition-transform ${abierto ? "rotate-180" : ""}`} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

function Cards({
  items,
  es,
}: {
  items: Profile[];
  es: boolean;
}) {
  return (
    <div className="grid grid-cols-1 items-start gap-4 sm:gap-5 lg:grid-cols-2">
      {items.map((p) => {
        const cargo = p.category === "equipo" ? (es ? p.role : p.roleEn || p.role) : "";
        return (
          <article
            key={p.id}
            className="flex min-w-0 gap-4 rounded-2xl border border-border bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:gap-5 sm:p-5"
          >
            <Foto p={p} />
            <div className="min-w-0 flex-1">
              <h3 className="break-words font-display text-lg font-bold leading-snug text-brand-deep sm:text-xl">
                {p.name}
              </h3>
              {cargo && (
                <p className="mt-1.5 inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary sm:text-sm">
                  {cargo}
                </p>
              )}
              <Texto html={es ? p.description : p.descriptionEn || p.description} es={es} />
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default function NosotrosRegistros({
  category,
}: {
  category: Category;
}) {
  const { lang } = useI18n();

  const es = lang === "es";
  const section = sections[category];
  const Icon = section.icon;

  const [items, setItems] = useState<Profile[]>([]);
  const [categories, setCategories] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError(false);

    Promise.all([
      listarNosotros(),
      category === "socios"
        ? listarCategorias()
        : Promise.resolve([] as Role[]),
    ])
      .then(([rows, cats]) => {
        if (active) {
          setItems(
            rows.filter((p) => p.category === category)
          );

          setCategories(cats);
        }
      })
      .catch(() => {
        if (active) {
          setError(true);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [category, attempt]);

  return (
    <section
      id={section.id}
      className="scroll-mt-28 border-b border-border py-12 sm:py-16"
    >
      <div className="container-site space-y-8">
        <div className="flex items-center gap-3">
          <Icon className="size-7 shrink-0 text-primary" />

          <h2 className="font-display text-3xl leading-tight text-brand-deep sm:text-4xl">
            {es ? section.es : section.en}
          </h2>
        </div>

        {loading ? (
          <p
            role="status"
            className="text-muted-foreground"
          >
            {es
              ? "Cargando información…"
              : "Loading information…"}
          </p>
        ) : error ? (
          <div
            role="status"
            className="rounded-xl border border-border p-5"
          >
            <p className="text-black">
              {es
                ? "No se pudo cargar la información en este momento."
                : "Information could not be loaded right now."}
            </p>

            <button
              type="button"
              className="mt-3 rounded-xl bg-primary px-4 py-2 text-primary-foreground"
              onClick={() => setAttempt((v) => v + 1)}
            >
              {es ? "Reintentar" : "Try again"}
            </button>
          </div>
        ) : category !== "socios" ? (
          items.length ? (
            <Cards items={items} es={es} />
          ) : (
            <p className="text-muted-foreground">
              {es
                ? "Todavía no hay información disponible."
                : "No information is available yet."}
            </p>
          )
        ) : null}

        {category === "socios" &&
          partnerSections.map((c) => {
            const label = categories.find(
              (x) => x.id === c.id
            );

            const records = items.filter(
              (p) => p.partnerCategory === c.id
            );

            return (
              <div
                key={c.id}
                id={c.anchor}
                className="scroll-mt-28 space-y-5"
              >
                <h3 className="font-display text-2xl leading-tight text-brand-deep">
                  {es
                    ? label?.name || c.es
                    : label?.nameEn || c.en}
                </h3>

                {!loading &&
                  !error &&
                  (records.length ? (
                    <Cards items={records} es={es} />
                  ) : (
                    <p className="text-muted-foreground">
                      {es
                        ? "Todavía no hay información disponible."
                        : "No information is available yet."}
                    </p>
                  ))}
              </div>
            );
          })}
      </div>
    </section>
  );
}