// Selector de fecha con calendario desplegable (reemplaza al <input type="date"> del navegador).
import { useState } from "react";
import { CalendarDays, X } from "lucide-react";
import { es } from "react-day-picker/locale";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const aFecha = (iso: string) => { const [y, m, d] = iso.split("-").map(Number); return new Date(y ?? 2000, (m ?? 1) - 1, d ?? 1); };
const aIso = (f: Date) => `${f.getFullYear()}-${String(f.getMonth() + 1).padStart(2, "0")}-${String(f.getDate()).padStart(2, "0")}`;

export function SelectorFecha({ valor, onChange, placeholder = "Sin fecha", minimo, etiqueta }: {
  valor: string | null;
  onChange: (iso: string | null) => void;
  placeholder?: string;
  /** No se pueden elegir días anteriores a esta fecha (YYYY-MM-DD). */
  minimo?: string | null | undefined;
  etiqueta: string;
}) {
  const [abierto, setAbierto] = useState(false);
  const fecha = valor ? aFecha(valor) : undefined;
  const texto = fecha ? fecha.toLocaleDateString("es-BO", { day: "numeric", month: "short", year: "numeric" }) : placeholder;

  return <div className="flex min-w-0 items-stretch gap-1.5">
    <Popover open={abierto} onOpenChange={setAbierto}>
      <PopoverTrigger asChild>
        <button type="button" aria-label={`${etiqueta}: ${texto}`}
          className={`flex min-h-11 min-w-0 flex-1 items-center gap-2.5 rounded-xl border bg-background px-3 py-2 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${abierto ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/60"}`}>
          <span className={`grid size-8 shrink-0 place-items-center rounded-lg ${fecha ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"}`}><CalendarDays className="size-4" aria-hidden="true" /></span>
          <span className={`truncate first-letter:uppercase ${fecha ? "font-semibold text-black" : "text-muted-foreground"}`}>{texto}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto rounded-2xl p-0 shadow-xl">
        <Calendar
          mode="single"
          locale={es}
          {...(fecha ? { selected: fecha } : {})}
          defaultMonth={fecha ?? (minimo ? aFecha(minimo) : new Date())}
          {...(minimo ? { disabled: { before: aFecha(minimo) } } : {})}
          onSelect={(d) => { onChange(d ? aIso(d) : null); setAbierto(false); }}
          captionLayout="dropdown"
          startMonth={new Date(2020, 0)}
          endMonth={new Date(new Date().getFullYear() + 5, 11)}
          className="[--cell-size:2.4rem]"
        />
        <div className="flex items-center justify-between gap-2 border-t border-border px-3 py-2">
          <button type="button" className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10"
            onClick={() => { const hoy = new Date(); if (!minimo || aIso(hoy) >= minimo) { onChange(aIso(hoy)); setAbierto(false); } }}>Hoy</button>
          {valor && <button type="button" className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50" onClick={() => { onChange(null); setAbierto(false); }}>Quitar fecha</button>}
        </div>
      </PopoverContent>
    </Popover>
    {valor && <button type="button" aria-label={`Quitar ${etiqueta.toLowerCase()}`} title="Quitar fecha" onClick={() => onChange(null)}
      className="grid w-10 shrink-0 place-items-center rounded-xl border border-border text-muted-foreground hover:border-red-300 hover:bg-red-50 hover:text-red-700"><X className="size-4" /></button>}
  </div>;
}
