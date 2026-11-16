import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Landscapes } from "@/components/Landscapes";
import { Programs } from "@/components/Programs";
import { Resources } from "@/components/Resources";
import { News } from "@/components/News";
import { SectionShortcut } from "@/components/SectionView";
import { Contact } from "@/components/Contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <SectionShortcut to="/nosotros" />
      <Landscapes />
      <SectionShortcut to="/paisajes" />
      <Programs />
      <SectionShortcut to="/programas" />
      <Resources />
      <SectionShortcut to="/recursos" />
      <News />
      <SectionShortcut to="/noticias" />
      <Contact />
      <SectionShortcut to="/contacto" />
    </main>
  );
}