import { createFileRoute } from "@tanstack/react-router";
import { I18nProvider } from "@/i18n/I18nProvider";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { Landscapes } from "@/components/site/Landscapes";
import { Programs } from "@/components/site/Programs";
import { Resources } from "@/components/site/Resources";
import { News } from "@/components/site/News";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Asociación Armonía · Conservando la biodiversidad de Bolivia" },
      { name: "description", content: "Conservación de aves y paisajes de Bolivia: Pastizales del Beni, Yungas, Andes Altos, Bosque Seco Interandino y Amazonía." },
      { property: "og:title", content: "Asociación Armonía · Conservando la biodiversidad de Bolivia" },
      { property: "og:description", content: "Ciencia, reservas y comunidades para proteger las aves amenazadas de Bolivia." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <I18nProvider>
      <Header />
      <main>
        <Hero />
        <About />
        <Landscapes />
        <Programs />
        <Resources />
        <News />
        <Contact />
      </main>
      <Footer />
    </I18nProvider>
  );
}
