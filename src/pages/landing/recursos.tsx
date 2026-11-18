import { useI18n } from "@/i18n/I18nProvider";

export default function Recursos() {
  const { lang } = useI18n();
  const es = lang === "es";

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-8">
      <h1 className="text-4xl text-brand-deep">{es ? "Recursos" : "Resources"}</h1>
      <p className="mt-4 text-muted-foreground">
        {es
          ? "Informes, publicaciones, recursos SIG, colaboraciones y herramientas legales."
          : "Reports, publications, GIS resources, collaborations and legal tools."}
      </p>

      <div className="mt-10 space-y-16">
        <section id="informes" className="scroll-mt-24">
          <h2 className="text-2xl text-brand-deep">
            {es ? "Informes y memorias" : "Reports & annual reviews"}
          </h2>
        </section>

        <section id="publicaciones" className="scroll-mt-24">
          <h2 className="text-2xl text-brand-deep">
            {es ? "Publicaciones científicas y técnicas" : "Scientific & technical publications"}
          </h2>
        </section>

        <section id="sig" className="scroll-mt-24">
          <h2 className="text-2xl text-brand-deep">
            {es ? "Recursos SIG / mapas" : "GIS resources / maps"}
          </h2>
        </section>

        <section id="colaboraciones" className="scroll-mt-24">
          <h2 className="text-2xl text-brand-deep">
            {es ? "Colaboraciones" : "Collaborations"}
          </h2>
        </section>

        <section id="legales" className="scroll-mt-24">
          <h2 className="text-2xl text-brand-deep">
            {es ? "Herramientas legales" : "Legal tools"}
          </h2>
        </section>
      </div>
    </section>
  );
}