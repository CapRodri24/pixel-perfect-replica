import { Feather } from "lucide-react";
export function Logo({ light }: { light?: boolean }) {
  return (
    <a href="#inicio" className="flex items-center gap-2.5" aria-label="Asociación Armonía">
      <span className={`grid size-10 place-items-center rounded-full ${light ? "bg-primary-foreground text-primary" : "bg-primary text-primary-foreground"}`}>
        <Feather className="size-5" />
      </span>
      <span className="leading-none">
        <span className={`block text-[0.65rem] font-semibold uppercase tracking-[0.25em] ${light ? "text-brand-light" : "text-brand-gray"}`}>Asociación</span>
        <span className={`block font-display text-xl font-semibold ${light ? "text-primary-foreground" : "text-primary"}`}>Armonía</span>
      </span>
    </a>
  );
}
