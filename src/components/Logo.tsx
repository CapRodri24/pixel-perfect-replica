
import { Link } from "react-router-dom";

export function Logo({ light }: { light?: boolean }) {
  return (
    <Link
      to="/"
      className="flex shrink-0 items-center gap-2.5"
      aria-label="Asociación Armonía"
    >
      <img
        src={
          light
            ? "/images/logo-blanco.png"
            : "/images/logo.png"
        }
        alt="Asociación Armonía"
        className="h-12 w-auto object-contain rounded-none"
      />
    </Link>
  );
}
