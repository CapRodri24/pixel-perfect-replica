// Editor de párrafos parecido a Word: negrita, cursiva, subrayado, tachado,
// listas con viñetas o numeradas y alineación (incluido justificar).
// Comparte el mismo HTML que luego filtra sanitize() y muestra la web pública.
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
  AlignCenter, AlignJustify, AlignLeft, AlignRight, Bold, Italic, List, ListOrdered,
  RemoveFormatting, Strikethrough, Underline, type LucideIcon,
} from "lucide-react";
import { sanitize } from "./datos";
import { estilosTextoEnriquecido } from "@/lib/textoEnriquecido";

export { estilosTextoEnriquecido };

type Comando = "bold" | "italic" | "underline" | "strikeThrough" | "insertUnorderedList" | "insertOrderedList"
  | "justifyLeft" | "justifyCenter" | "justifyRight" | "justifyFull";

const formato: { comando: Comando; icono: LucideIcon; nombre: string; atajo?: string }[] = [
  { comando: "bold", icono: Bold, nombre: "Negrita", atajo: "Ctrl+B" },
  { comando: "italic", icono: Italic, nombre: "Cursiva", atajo: "Ctrl+I" },
  { comando: "underline", icono: Underline, nombre: "Subrayado", atajo: "Ctrl+U" },
  { comando: "strikeThrough", icono: Strikethrough, nombre: "Tachado" },
];
const listas: { comando: Comando; icono: LucideIcon; nombre: string; ayuda: string }[] = [
  { comando: "insertUnorderedList", icono: List, nombre: "Viñetas", ayuda: "Lista con viñetas (o escribe «- » al inicio de la línea)" },
  { comando: "insertOrderedList", icono: ListOrdered, nombre: "Numerada", ayuda: "Lista numerada (o escribe «1. » al inicio de la línea)" },
];
const alineaciones: { comando: Comando; icono: LucideIcon; nombre: string }[] = [
  { comando: "justifyLeft", icono: AlignLeft, nombre: "Alinear a la izquierda" },
  { comando: "justifyCenter", icono: AlignCenter, nombre: "Centrar" },
  { comando: "justifyRight", icono: AlignRight, nombre: "Alinear a la derecha" },
  { comando: "justifyFull", icono: AlignJustify, nombre: "Justificar" },
];
const todos: Comando[] = [...formato, ...listas, ...alineaciones].map((c) => c.comando);

function Grupo({ titulo, children }: { titulo: string; children: ReactNode }) {
  return <div role="group" aria-label={titulo} className="flex items-center gap-0.5 rounded-lg border border-border bg-background p-0.5">{children}</div>;
}

function Boton({ activo, titulo, onClick, children }: { activo: boolean; titulo: string; onClick: () => void; children: ReactNode }) {
  return <button
    type="button"
    title={titulo}
    aria-label={titulo}
    aria-pressed={activo}
    onMouseDown={(e) => e.preventDefault()}
    onClick={onClick}
    className={`inline-flex h-8 min-w-8 items-center justify-center gap-1.5 rounded-md px-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${activo ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`}
  >{children}</button>;
}

export function EditorTexto({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [activos, setActivos] = useState<Set<Comando>>(new Set());

  // Último HTML que salió de este editor: si vuelve igual, no se reescribe el contenido
  // (reescribirlo mientras se escribe movería el cursor al inicio).
  const emitido = useRef<string | null>(null);
  useEffect(() => {
    if (!ref.current || value === emitido.current) return;
    ref.current.innerHTML = sanitize(value);
    emitido.current = value;
  }, [value]);

  const commit = useCallback(() => {
    if (!ref.current) return;
    const html = sanitize(ref.current.innerHTML);
    emitido.current = html;
    onChange(html);
  }, [onChange]);

  // Resalta los botones del formato donde está el cursor, como en Word.
  const actualizar = useCallback(() => {
    const editor = ref.current;
    const sel = document.getSelection();
    if (!editor || !sel?.rangeCount || !editor.contains(sel.anchorNode)) return;
    const siguiente = new Set<Comando>();
    for (const c of todos) { try { if (document.queryCommandState(c)) siguiente.add(c); } catch { /* comando no soportado */ } }
    // Sin alineación explícita el texto está a la izquierda.
    if (!alineaciones.some((a) => siguiente.has(a.comando))) siguiente.add("justifyLeft");
    setActivos(siguiente);
  }, []);

  useEffect(() => {
    document.addEventListener("selectionchange", actualizar);
    return () => document.removeEventListener("selectionchange", actualizar);
  }, [actualizar]);

  function aplicar(comando: Comando | "removeFormat") {
    ref.current?.focus();
    document.execCommand(comando, false);
    commit();
    actualizar();
  }

  // Igual que Word: «- », «* » o «1. » al comienzo de una línea inicia una lista.
  // Se revisa al pulsar la barra espaciadora (antes de escribir el espacio).
  function listaAutomatica() {
    const editor = ref.current;
    const sel = document.getSelection();
    if (!editor || !sel?.rangeCount) return false;
    const rango = sel.getRangeAt(0);
    if (!rango.collapsed) return false;
    let bloque: Node | null = rango.startContainer;
    while (bloque && bloque !== editor && !(bloque instanceof HTMLElement && ["DIV", "P", "LI"].includes(bloque.tagName))) bloque = bloque.parentNode;
    if (!bloque || (bloque instanceof HTMLElement && bloque.tagName === "LI")) return false;
    const previo = document.createRange();
    previo.selectNodeContents(bloque);
    previo.setEnd(rango.startContainer, rango.startOffset);
    const texto = previo.toString().replace(/ /g, " ").trim();
    const comando: Comando | null = /^[-*•]$/.test(texto) ? "insertUnorderedList" : /^1[.)]$/.test(texto) ? "insertOrderedList" : null;
    if (!comando) return false;
    // Se borra el «-» o «1.» con el propio navegador (así Ctrl+Z también lo deshace).
    sel.removeAllRanges();
    sel.addRange(previo);
    document.execCommand("delete", false);
    document.execCommand(comando, false);
    return true;
  }

  return <div className="overflow-hidden rounded-xl border border-border bg-background focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
    <div className="flex flex-wrap items-center gap-1.5 border-b border-border bg-muted/40 p-1.5">
      <Grupo titulo="Formato">
        {formato.map(({ comando, icono: Icono, nombre, atajo }) =>
          <Boton key={comando} activo={activos.has(comando)} titulo={atajo ? `${nombre} (${atajo})` : nombre} onClick={() => aplicar(comando)}><Icono className="size-4" aria-hidden="true" /></Boton>)}
      </Grupo>
      <Grupo titulo="Listas">
        {listas.map(({ comando, icono: Icono, nombre, ayuda }) =>
          <Boton key={comando} activo={activos.has(comando)} titulo={ayuda} onClick={() => aplicar(comando)}><Icono className="size-4" aria-hidden="true" /><span className="hidden sm:inline">{nombre}</span></Boton>)}
      </Grupo>
      <Grupo titulo="Alineación del texto">
        {alineaciones.map(({ comando, icono: Icono, nombre }) =>
          <Boton key={comando} activo={activos.has(comando)} titulo={nombre} onClick={() => aplicar(comando)}><Icono className="size-4" aria-hidden="true" />{comando === "justifyFull" && <span className="hidden sm:inline">Justificar</span>}</Boton>)}
      </Grupo>
      <Grupo titulo="Limpiar">
        <Boton activo={false} titulo="Quitar formato del texto seleccionado" onClick={() => aplicar("removeFormat")}><RemoveFormatting className="size-4" aria-hidden="true" /></Boton>
      </Grupo>
    </div>
    <div
      ref={ref}
      role="textbox"
      aria-label={label}
      aria-multiline="true"
      contentEditable
      suppressContentEditableWarning
      onKeyDown={(e) => {
        if (e.key === " " && !e.ctrlKey && !e.metaKey && !e.altKey && listaAutomatica()) {
          e.preventDefault();
          commit();
          actualizar();
        }
      }}
      onInput={() => { commit(); actualizar(); }}
      onBlur={commit}
      onPaste={(e) => { e.preventDefault(); document.execCommand("insertText", false, e.clipboardData.getData("text/plain")); commit(); }}
      className={`min-h-28 whitespace-pre-wrap p-3 text-sm leading-relaxed text-black outline-none ${estilosTextoEnriquecido}`}
    />
    <p className="border-t border-border bg-muted/20 px-3 py-1.5 text-[11px] text-muted-foreground">
      Selecciona el texto y elige un formato. Para una lista escribe «- » o «1. » al inicio de la línea; pulsa Enter dos veces para salir de ella.
    </p>
  </div>;
}
