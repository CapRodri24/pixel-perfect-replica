// Piezas compartidas por los editores de noticias, programas y paisajes:
// el bloque PDF (subir archivo) y la ayuda del bloque Enlace.
import { useEffect, useState, type ChangeEvent } from "react";
import { FileText, FileUp } from "lucide-react";
import type { PdfBloque } from "@/api/paisajesApi";
import { pdfContenidoUrl } from "@/api/paisajesPublicosApi";
import { VisorPdf } from "@/components/contenido/EnlaceIncrustado";
import { detectarEnlace, NOMBRE_TIPO_ENLACE, tamanoLegible } from "@/lib/enlaces";
import { secondary } from "./ui";

export const MAX_PDF_BLOQUE = 10 * 1024 * 1024;

/** Indica, mientras se escribe, cómo se va a mostrar el enlace en la página. */
export function AyudaEnlace({ url }: { url: string }) {
  if (!url.trim()) {
    return <span className="mt-1 block text-xs font-normal text-muted-foreground">
      Pega el enlace y la página reconoce qué es: los videos de YouTube, audios de SoundCloud, presentaciones de Genially, grabaciones de Macaulay Library y PDF (también de Google Drive) se ven dentro de la página. Los enlaces de eBird y de cualquier otra página aparecen como referencia.
    </span>;
  }
  const enlace = detectarEnlace(url);
  if (!enlace) return <span className="mt-1 block text-xs font-normal text-red-700">Enlace no válido: debe empezar con https:// o http://.</span>;
  return <span className="mt-1 block text-xs font-normal text-muted-foreground">
    Se mostrará como: <strong className="font-semibold text-primary">{NOMBRE_TIPO_ENLACE[enlace.tipo].es}</strong>
  </span>;
}

export function leerPdf(file: File): Promise<PdfBloque> {
  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) return Promise.reject(new Error("El archivo debe ser un PDF."));
  if (file.size > MAX_PDF_BLOQUE) return Promise.reject(new Error("El PDF debe pesar como máximo 10 MB."));
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("No se pudo leer el PDF."));
    reader.onload = () => {
      if (typeof reader.result !== "string") return reject(new Error("No se pudo leer el PDF."));
      // Algunos sistemas no informan el tipo del archivo: se normaliza a application/pdf.
      const archivo = reader.result.replace(/^data:[^;]*;base64,/, "data:application/pdf;base64,");
      resolve({ archivo, nombre_archivo: file.name, tamano_bytes: file.size });
    };
    reader.readAsDataURL(file);
  });
}

export function PdfEditor({ pdf, onChange }: { pdf: PdfBloque | undefined; onChange: (pdf: PdfBloque) => void }) {
  const [error, setError] = useState("");
  const tiene = Boolean(pdf?.archivo || pdf?.id_archivo_pdf);
  async function cargar(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError("");
    try { onChange(await leerPdf(file)); } catch (err) { setError(err instanceof Error ? err.message : "No se pudo leer el PDF."); }
  }
  return <div className="space-y-2">
    {tiene && <div className="flex items-center gap-3 rounded-xl border border-border bg-background p-3">
      <FileText className="size-6 shrink-0 text-red-700" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold" title={pdf?.nombre_archivo}>{pdf?.nombre_archivo || "documento.pdf"}</p>
        <p className="text-xs text-muted-foreground">PDF{pdf?.tamano_bytes ? ` · ${tamanoLegible(pdf.tamano_bytes)}` : ""}</p>
      </div>
    </div>}
    <label className={`${secondary} cursor-pointer`}>
      <FileUp className="size-4" />{tiene ? "Reemplazar PDF" : "Subir PDF"}
      <input type="file" accept="application/pdf,.pdf" className="sr-only" onChange={cargar} />
    </label>
    {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
    <p className="text-xs text-muted-foreground">Máximo 10 MB. En la página se podrá ver y descargar. Si el PDF ya está publicado en internet o en Google Drive, también puedes usar un bloque Enlace.</p>
  </div>;
}

/** Vista previa del bloque PDF: el guardado se sirve desde la API; el nuevo, desde el archivo elegido. */
export function VistaPreviaPdf({ pdf }: { pdf: PdfBloque | undefined }) {
  const [local, setLocal] = useState("");
  useEffect(() => {
    if (!pdf?.archivo) { setLocal(""); return; }
    const binario = atob(pdf.archivo.split(",")[1] || "");
    const bytes = new Uint8Array(binario.length);
    for (let i = 0; i < binario.length; i++) bytes[i] = binario.charCodeAt(i);
    const url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
    setLocal(url);
    return () => URL.revokeObjectURL(url);
  }, [pdf?.archivo]);
  const nombre = pdf?.nombre_archivo || "documento.pdf";
  if (local) return <VisorPdf vista={local} descarga={local} nombre={nombre} tamano={pdf?.tamano_bytes} />;
  const guardado = pdfContenidoUrl(pdf?.id_archivo_pdf);
  if (guardado) return <VisorPdf vista={guardado} descarga={pdfContenidoUrl(pdf?.id_archivo_pdf, true) || guardado} nombre={nombre} tamano={pdf?.tamano_bytes} />;
  return <p className="text-sm text-muted-foreground">Sin PDF.</p>;
}
