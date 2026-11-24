import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type ComponentType } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";

/**
 * Lista desplegable del panel de administración.
 * Sustituye a los <select> nativos con el estilo de Armonía: búsqueda cuando hay muchas
 * opciones, navegación con teclado, contador por opción y punto de color opcional.
 */
export type SelectorOption = {
  id: string;
  label: string;
  /** Texto secundario bajo la opción (por ejemplo, el paisaje de un programa). */
  hint?: string;
  /** Cantidad de registros asociados; se muestra como una etiqueta. */
  count?: number;
  /** Color en formato CSS para mostrar un punto junto a la opción. */
  color?: string;
  disabled?: boolean;
};

type Props = {
  label?: string;
  /** Oculta la etiqueta visible pero la mantiene para lectores de pantalla. */
  hideLabel?: boolean;
  value: string;
  options: SelectorOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  /** Ícono opcional dentro del botón. */
  icon?: ComponentType<{ className?: string }>;
  /** Por defecto aparece el buscador cuando hay más de 7 opciones. */
  searchable?: boolean;
  /** Identificador usado por el formulario para desplazarse al campo con error. */
  fieldId?: string;
  className?: string;
};

const normalizar = (texto: string) => texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLocaleLowerCase("es");

export function Selector({
  label,
  hideLabel = false,
  value,
  options,
  onChange,
  placeholder = "Selecciona una opción",
  disabled = false,
  required = false,
  icon: Icon,
  searchable,
  fieldId,
  className = "",
}: Props) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [upward, setUpward] = useState(false);
  const [invalid, setInvalid] = useState(false);

  const selected = options.find((o) => o.id === value);
  const withSearch = searchable ?? options.length > 7;
  const visible = useMemo(() => {
    const q = normalizar(query.trim());
    return q ? options.filter((o) => normalizar(`${o.label} ${o.hint ?? ""}`).includes(q)) : options;
  }, [options, query]);

  // Cierra al hacer clic fuera.
  useEffect(() => {
    if (!open) return;
    const fuera = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("pointerdown", fuera);
    return () => document.removeEventListener("pointerdown", fuera);
  }, [open]);

  useEffect(() => { if (disabled) setOpen(false); }, [disabled]);
  useEffect(() => { if (value) setInvalid(false); }, [value]);

  // Abre hacia arriba si no cabe debajo.
  useLayoutEffect(() => {
    if (!open || !trigger.current) return;
    const r = trigger.current.getBoundingClientRect();
    const abajo = window.innerHeight - r.bottom;
    setUpward(abajo < 300 && r.top > abajo);
    (withSearch ? search.current : list.current)?.focus({ preventScroll: true });
  }, [open, withSearch]);

  // Mantiene visible la opción activa al moverse con el teclado.
  useEffect(() => {
    if (!open) return;
    list.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  function abrir() {
    if (disabled) return;
    setQuery("");
    setActive(Math.max(0, options.findIndex((o) => o.id === value)));
    setOpen(true);
  }

  function cerrar(devolverFoco = true) {
    setOpen(false);
    if (devolverFoco) trigger.current?.focus();
  }

  function elegir(option: SelectorOption | undefined) {
    if (!option || option.disabled) return;
    onChange(option.id);
    cerrar();
  }

  function mover(desde: number, paso: 1 | -1) {
    if (!visible.length) return;
    let i = desde;
    for (let n = 0; n < visible.length; n++) {
      i = (i + paso + visible.length) % visible.length;
      if (!visible[i]?.disabled) { setActive(i); return; }
    }
  }

  function teclado(e: React.KeyboardEvent) {
    switch (e.key) {
      case "ArrowDown": e.preventDefault(); mover(active, 1); break;
      case "ArrowUp": e.preventDefault(); mover(active, -1); break;
      case "Home": e.preventDefault(); mover(-1, 1); break;
      case "End": e.preventDefault(); mover(visible.length, -1); break;
      case "Enter": e.preventDefault(); elegir(visible[active]); break;
      case "Escape": e.preventDefault(); e.stopPropagation(); cerrar(); break;
      case "Tab": cerrar(false); break;
      default:
        // Sin buscador: saltar a la primera opción que empiece con la letra pulsada.
        if (!withSearch && e.key.length === 1 && /\S/.test(e.key)) {
          const letra = normalizar(e.key);
          const i = visible.findIndex((o, n) => n > active && !o.disabled && normalizar(o.label).startsWith(letra));
          const j = i >= 0 ? i : visible.findIndex((o) => !o.disabled && normalizar(o.label).startsWith(letra));
          if (j >= 0) setActive(j);
        }
    }
  }

  const activeId = visible[active] ? `${id}-op-${active}` : undefined;

  return (
    <div ref={root} className={`relative min-w-0 ${className}`}>
      {label && (
        <span id={`${id}-label`} className={hideLabel ? "sr-only" : "mb-1.5 block text-sm font-semibold text-brand-deep"}>
          {label}{required && !hideLabel && <span className="text-red-600"> *</span>}
        </span>
      )}
      <button
        ref={trigger}
        type="button"
        data-field-id={fieldId}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? `${id}-list` : undefined}
        aria-labelledby={label ? `${id}-label ${id}-value` : `${id}-value`}
        aria-invalid={invalid || undefined}
        onClick={() => (open ? cerrar() : abrir())}
        onKeyDown={(e) => {
          if (!open && ["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) { e.preventDefault(); abrir(); }
        }}
        className={`group flex h-11 w-full items-center gap-2.5 rounded-xl border bg-white px-3 text-left text-sm shadow-sm transition-[border-color,box-shadow] duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2381C4]/15 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60 motion-reduce:transition-none ${
          invalid ? "border-red-400 ring-4 ring-red-100" : open ? "border-[#2381C4] ring-4 ring-[#2381C4]/15" : "border-[#d5e2ec] hover:border-[#2381C4]/60 focus-visible:border-[#2381C4]"
        }`}
      >
        {Icon && <Icon className="size-4 shrink-0 text-[#2381C4]" />}
        {selected?.color && <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full ring-2 ring-white" style={{ backgroundColor: selected.color }} />}
        <span id={`${id}-value`} className={`min-w-0 flex-1 truncate ${selected ? "font-medium text-black" : "text-slate-500"}`}>
          {selected?.label ?? placeholder}
        </span>
        {selected?.count !== undefined && (
          <span className="shrink-0 rounded-full bg-[#eaf4fc] px-2 py-0.5 text-xs font-semibold tabular-nums text-[#2381C4]">{selected.count}</span>
        )}
        <ChevronDown aria-hidden="true" className={`size-4 shrink-0 text-slate-500 transition-transform duration-200 motion-reduce:transition-none ${open ? "rotate-180 text-[#2381C4]" : "group-hover:text-[#2381C4]"}`} />
      </button>

      {/* Campo oculto para que la validación nativa del formulario respete "required". */}
      {required && (
        <input
          tabIndex={-1}
          aria-hidden="true"
          required
          value={value}
          onChange={() => undefined}
          onInvalid={(e) => { e.preventDefault(); setInvalid(true); trigger.current?.focus(); }}
          className="pointer-events-none absolute bottom-0 left-1/2 h-px w-px opacity-0"
        />
      )}
      {invalid && <p role="alert" className="mt-1 text-xs text-red-700">Selecciona una opción.</p>}

      {open && (
        <div
          className={`absolute left-0 right-0 z-50 overflow-hidden rounded-xl border border-[#d5e2ec] bg-white shadow-[0_14px_40px_-8px_rgba(18,60,96,0.25)] animate-in fade-in-0 zoom-in-95 duration-150 motion-reduce:animate-none ${
            upward ? "bottom-full mb-1.5 origin-bottom slide-in-from-bottom-1" : "top-full mt-1.5 origin-top slide-in-from-top-1"
          }`}
        >
          {withSearch && (
            <div className="flex items-center gap-2 border-b border-[#e6eef4] px-3">
              <Search aria-hidden="true" className="size-4 shrink-0 text-slate-400" />
              <input
                ref={search}
                value={query}
                onChange={(e) => { setQuery(e.target.value); setActive(0); }}
                onKeyDown={teclado}
                role="combobox"
                aria-expanded="true"
                aria-controls={`${id}-list`}
                aria-activedescendant={activeId}
                aria-label="Buscar opción"
                placeholder="Buscar…"
                className="h-10 w-full bg-transparent text-sm text-black outline-none placeholder:text-slate-400"
              />
              {query && (
                <button type="button" aria-label="Borrar búsqueda" className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600" onClick={() => { setQuery(""); search.current?.focus(); }}>
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          )}
          <ul
            ref={list}
            id={`${id}-list`}
            role="listbox"
            tabIndex={withSearch ? undefined : -1}
            aria-labelledby={label ? `${id}-label` : undefined}
            aria-activedescendant={withSearch ? undefined : activeId}
            onKeyDown={withSearch ? undefined : teclado}
            className="max-h-64 space-y-0.5 overflow-y-auto overscroll-contain p-1.5 outline-none"
          >
            {visible.map((o, i) => {
              const esSeleccionada = o.id === value;
              const esActiva = i === active;
              return (
                <li
                  key={o.id || "__vacio"}
                  id={`${id}-op-${i}`}
                  data-index={i}
                  role="option"
                  aria-selected={esSeleccionada}
                  aria-disabled={o.disabled || undefined}
                  onPointerMove={() => { if (!o.disabled && active !== i) setActive(i); }}
                  onClick={() => elegir(o)}
                  className={`flex cursor-pointer select-none items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors duration-100 motion-reduce:transition-none ${
                    o.disabled ? "cursor-not-allowed opacity-45" : esActiva ? "bg-[#eaf4fc]" : ""
                  } ${esSeleccionada ? "font-semibold text-[#1c6aa3]" : "text-black"}`}
                >
                  {o.color && <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: o.color }} />}
                  <span className="min-w-0 flex-1">
                    <span className="block break-words leading-snug">{o.label}</span>
                    {o.hint && <span className="block truncate text-xs font-normal text-slate-500">{o.hint}</span>}
                  </span>
                  {o.count !== undefined && (
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums ${esSeleccionada ? "bg-[#2381C4] text-white" : "bg-slate-100 text-slate-600"}`}>{o.count}</span>
                  )}
                  <Check aria-hidden="true" className={`size-4 shrink-0 text-[#2381C4] ${esSeleccionada ? "opacity-100" : "opacity-0"}`} />
                </li>
              );
            })}
            {!visible.length && <li className="px-3 py-6 text-center text-sm text-slate-500">Sin resultados para «{query}»</li>}
          </ul>
        </div>
      )}
    </div>
  );
}
