import { useEffect, useState } from "react";
import {
  Users,
  Landmark,
  Handshake,
  UserRound,
} from "lucide-react";

import { useI18n } from "@/i18n/I18nProvider";

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

function Foto({ p }: { p: Profile }) {
  const [failed, setFailed] = useState(false);

  const isPartner = p.category === "socios";

  useEffect(() => {
    setFailed(false);
  }, [p.image]);

  return (
    <div
      className={`relative flex w-full items-center justify-center overflow-hidden border-b border-border ${
        isPartner
          ? "aspect-[16/10] bg-white p-6 sm:p-8"
          : "aspect-[4/5] bg-secondary/30 p-3 sm:p-4"
      }`}
    >
      {!failed && p.image ? (
        <img
          src={p.image}
          alt={p.name}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="block h-full w-full object-contain object-center"
        />
      ) : (
        <UserRound
          className="size-14 text-muted-foreground"
          aria-hidden="true"
        />
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
    <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
      {items.map((p) => (
        <article
          key={p.id}
          className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm"
        >
          <Foto p={p} />

          <div className="flex flex-1 flex-col px-5 pb-6 pt-5 sm:px-6 sm:pb-7 sm:pt-6">
            <h3 className="break-words font-display text-xl font-bold leading-snug text-brand-deep sm:text-2xl">
              {p.name}
            </h3>

            {p.category === "equipo" && (
              <p className="mt-2 break-words text-sm font-semibold leading-relaxed text-black">
                {es ? p.role : p.roleEn || p.role}
              </p>
            )}

            <p className="mt-4 whitespace-pre-line break-words text-left text-sm font-normal leading-[1.8] text-black sm:text-[15px]">
              {es
                ? p.description
                : p.descriptionEn || p.description}
            </p>
          </div>
        </article>
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