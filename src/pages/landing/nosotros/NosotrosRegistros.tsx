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
      {items.map((p) =>
        p.category === "socios" ? (
          // Socios: la imagen ocupa todo el alto de la tarjeta y una parte del ancho, sin marco.
          <article
            key={p.id}
            className="flex min-h-36 min-w-0 overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-shadow hover:shadow-md sm:min-h-44"
          >
            <ImagenSocio p={p} />
            <div className="min-w-0 flex-1 p-4 sm:p-5">
              <h3 className="break-words font-display text-lg font-bold leading-snug text-brand-deep sm:text-xl">{p.name}</h3>
              <Texto html={es ? p.description : p.descriptionEn || p.description} es={es} />
            </div>
          </article>
        ) : (
          <article
            key={p.id}
            className="flex min-w-0 gap-4 rounded-2xl border border-border bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:gap-5 sm:p-5"
          >
            <Foto p={p} />
            <div className="min-w-0 flex-1">
              <h3 className="break-words font-display text-lg font-bold leading-snug text-brand-deep sm:text-xl">{p.name}</h3>
              <Texto html={es ? p.description : p.descriptionEn || p.description} es={es} />
            </div>
          </article>
        )
      )}
    </div>
  );
}

function ImagenSocio({ p }: { p: Profile }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => { setFailed(false); }, [p.image]);
  return (
    // Ocupa todo el alto y una franja del ancho, sin marco interior; la imagen se escala entera
    // (los logotipos no se recortan).
    <div className="relative w-[36%] shrink-0 self-stretch border-r border-border bg-white sm:w-[34%]">
      {!failed && p.image ? (
        <img src={p.image} alt={p.name} loading="lazy" decoding="async" onError={() => setFailed(true)}
          className="absolute inset-0 block size-full object-contain p-2 sm:p-3" />
      ) : (
        <span className="absolute inset-0 grid place-items-center"><Handshake className="size-10 text-muted-foreground" aria-hidden="true" /></span>
      )}
    </div>
  );
}

// Nuestro equipo: agrupado por área, en el orden en que aparecen las personas.
function PorArea({ items, es }: { items: Profile[]; es: boolean }) {
  const grupos: { clave: string; area: string; items: Profile[] }[] = [];
  for (const p of items) {
    const clave = p.roleId || p.role || "sin-area";
    const area = (es ? p.role : p.roleEn || p.role) || (es ? "Equipo" : "Team");
    const g = grupos.find((x) => x.clave === clave);
    if (g) g.items.push(p);
    else grupos.push({ clave, area, items: [p] });
  }
  return (
    <div className="space-y-10">
      {grupos.map((g) => (
        <div key={g.clave} className="space-y-4">
          <h3 className="flex items-center gap-3 font-display text-2xl leading-tight text-brand-deep">
            <span className="h-7 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
            {g.area}
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-sans text-sm font-semibold text-primary">{g.items.length}</span>
          </h3>
          <Cards items={g.items} es={es} />
        </div>
      ))}
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
            category === "equipo" ? <PorArea items={items} es={es} /> : <Cards items={items} es={es} />
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