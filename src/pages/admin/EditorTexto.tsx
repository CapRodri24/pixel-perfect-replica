// Editor de párrafos parecido a Word: negrita, cursiva, subrayado, tachado,
// listas con viñetas o numeradas, alineación (incluido justificar) y enlaces.
// Comparte el mismo HTML que luego filtra sanitize() y muestra la web pública.
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
  AlignCenter, AlignJustify, AlignLeft, AlignRight, Bold, Italic, List, ListOrdered,
  Link2, Link2Off, RemoveFormatting, Strikethrough, Underline, type LucideIcon,
} from "lucide-react";
import { enlaceSeguro, sanitize } from "./datos";
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

export function EditorTexto({ value, onChange, label, sinEnlaces = false }: { value: string; onChange: (v: string) => void; label: string; /** Oculta la herramienta de enlaces (por ejemplo, en Nosotros). */ sinEnlaces?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [activos, setActivos] = useState<Set<Comando>>(new Set());
  const [enEnlace, setEnEnlace] = useState(false);
  // Barra para escribir el enlace; se guarda la selección porque el campo le quita el foco al texto.
  const [enlace, setEnlace] = useState<{ url: string; existente: boolean } | null>(null);
  const [aviso, setAviso] = useState("");
  const seleccionGuardada = useRef<Range | null>(null);

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
    setEnEnlace(Boolean(enlaceEnCursor()));
  }, []);

  function enlaceEnCursor(): HTMLAnchorElement | null {
    const editor = ref.current;
    const nodo = document.getSelection()?.anchorNode;
    if (!editor || !nodo) return null;
    const elemento = nodo instanceof Element ? nodo : nodo.parentElement;
    const a = elemento?.closest("a");
    return a && editor.contains(a) ? a : null;
  }

  function abrirEnlace() {
    const editor = ref.current;
    const sel = document.getSelection();
    if (!editor || !sel?.rangeCount || !editor.contains(sel.anchorNode)) {
      setAviso("Haz clic en el texto y selecciona las palabras que quieres convertir en enlace.");
      return;
    }
    const rango = sel.getRangeAt(0).cloneRange();
    const existente = enlaceEnCursor();
    if (existente) rango.selectNodeContents(existente);
    else if (rango.collapsed) {
      setAviso("Primero selecciona con el mouse las palabras que quieres convertir en enlace.");
      return;
    }
    seleccionGuardada.current = rango;
    setAviso("");
    setEnlace({ url: existente?.getAttribute("href") || "", existente: Boolean(existente) });
  }

  function restaurarSeleccion() {
    const rango = seleccionGuardada.current;
    const sel = document.getSelection();
    if (!rango || !sel) return false;
    ref.current?.focus();
    sel.removeAllRanges();
    sel.addRange(rango);
    return true;
  }

  function aplicarEnlace() {
    if (!enlace) return;
    const href = enlaceSeguro(enlace.url);
    if (!href) { setAviso("Escribe una dirección válida, por ejemplo www.armonia-bo.org o correo@ejemplo.org."); return; }
    if (!restaurarSeleccion()) return;
    document.execCommand("createLink", false, href);
    cerrarEnlace();
    commit();
    actualizar();
  }

  function quitarEnlace() {
    if (!restaurarSeleccion()) return;
    document.execCommand("unlink", false);
    cerrarEnlace();
    commit();
    actualizar();
  }

  function cerrarEnlace() {
    setEnlace(null);
    setAviso("");
    seleccionGuardada.current = null;
  }

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
      {!sinEnlaces && <Grupo titulo="Enlace">
        <Boton activo={enEnlace || Boolean(enlace)} titulo="Insertar o editar un enlace en el texto seleccionado (Ctrl+K)" onClick={abrirEnlace}><Link2 className="size-4" aria-hidden="true" /><span className="hidden sm:inline">Enlace</span></Boton>
      </Grupo>}
      <Grupo titulo="Limpiar">
        <Boton activo={false} titulo="Quitar formato del texto seleccionado" onClick={() => aplicar("removeFormat")}><RemoveFormatting className="size-4" aria-hidden="true" /></Boton>
      </Grupo>
    </div>
    {enlace && <div className="flex flex-wrap items-center gap-2 border-b border-border bg-primary/5 p-2">
      <Link2 className="size-4 shrink-0 text-primary" aria-hidden="true" />
      <input
        autoFocus
        type="text"
        inputMode="url"
        aria-label="Dirección del enlace"
        placeholder="www.ejemplo.org o correo@ejemplo.org"
        value={enlace.url}
        onChange={(e) => setEnlace({ ...enlace, url: e.target.value })}
        onKeyDown={(e) => {
          if (e.key === "Enter") { e.preventDefault(); aplicarEnlace(); }
          if (e.key === "Escape") { e.preventDefault(); cerrarEnlace(); ref.current?.focus(); }
        }}
        className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
      <button type="button" onClick={aplicarEnlace} className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:brightness-105">{enlace.existente ? "Actualizar" : "Aplicar"}</button>
      {enlace.existente && <button type="button" onClick={quitarEnlace} className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50"><Link2Off className="size-3.5" aria-hidden="true" />Quitar enlace</button>}
      <button type="button" onClick={() => { cerrarEnlace(); ref.current?.focus(); }} className="rounded-lg px-2 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted">Cancelar</button>
    </div>}
    {aviso && <p role="status" className="border-b border-border bg-amber-50 px-3 py-1.5 text-xs text-amber-800">{aviso}</p>}
    <div
      ref={ref}
      role="textbox"
      aria-label={label}
      aria-multiline="true"
      contentEditable
      suppressContentEditableWarning
      onKeyDown={(e) => {
        if (!sinEnlaces && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); abrirEnlace(); return; }
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
      Selecciona el texto y elige un formato{sinEnlaces ? "." : "; para un enlace selecciona las palabras y pulsa «Enlace»."} Para una lista escribe «- » o «1. » al inicio de la línea; pulsa Enter dos veces para salir de ella.
    </p>
  </div>;
}
