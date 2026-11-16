import { Link } from "react-router-dom";

export function Logo({ light }: { light?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5 shrink-0" aria-label="Asociación Armonía">
      <img 
        src={light ? "/images/logo-blanco.png" : "/images/logo.png"} 
        alt="Asociación Armonía" 
        // h-12 (48px de alto) o h-14 (56px), w-auto, y rounded-xl para esquinas suaves.
        // Si quieres que sea un círculo perfecto, cambia "rounded-xl" por "rounded-full"
        className="h-12 w-auto object-contain rounded-xl" 
      />
    </Link>
  );
}