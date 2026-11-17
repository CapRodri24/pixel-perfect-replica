import { useEffect, useRef, useState, type FormEvent } from "react";

// Tipos de bloque disponibles
type BlockType = "title" | "subtitle" | "text" | "image" | "video";

type Block = {
  id: string;
  type: BlockType;
  value: string;
  caption?: string;
};

type Landscape = {
  id: string;
  blocks: Block[];
};

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

const BLOCK_LABELS: Record<BlockType, string> = {
  title: "Título",
  subtitle: "Subtítulo",
  text: "Descripción",
  image: "Foto",
  video: "Vídeo de YouTube",
};

const BLOCK_PLACEHOLDERS: Record<BlockType, string> = {
  title: "Título del paisaje",
  subtitle: "Subtítulo",
  text: "Escribe la descripción del paisaje…",
  image: "Arrastra una imagen aquí o pulsa para seleccionarla",
  video: "https://www.youtube.com/watch?v=...",
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
}

function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([\w-]{11})/,
    /(?:youtu\.be\/)([\w-]{11})/,
    /(?:youtube\.com\/embed\/)([\w-]{11})/,
    /(?:youtube\.com\/shorts\/)([\w-]{11})/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m && m[1]) return m[1];
  }
  return null;
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function PaisajesAdmin() {
  const [items, setItems] = useState<Landscape[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("admin_paisajes");
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length && "title" in parsed[0]) {
        const migrated: Landscape[] = parsed.map((p: any) => ({
          id: p.id,
          blocks: [
            ...(p.title ? [{ id: uid(), type: "title" as BlockType, value: p.title }] : []),
            ...(p.text ? [{ id: uid(), type: "text" as BlockType, value: p.text }] : []),
            ...(p.image ? [{ id: uid(), type: "image" as BlockType, value: p.image }] : []),
          ],
        }));
        setItems(migrated);
      } else {
        setItems(parsed);
      }
    } catch {
      setItems([]);
    }
  }, []);

  const persist = (next: Landscape[]) => {
    setItems(next);
    localStorage.setItem("admin_paisajes", JSON.stringify(next));
  };

  const openCreate = () => {
    setBlocks([{ id: uid(), type: "title", value: "" }]);
    setError(null);
    setIsCreating(true);
  };

  const cancelCreate = () => {
    setIsCreating(false);
    setBlocks([]);
    setError(null);
  };

  const addBlock = (type: BlockType) => {
    if (type === "title") return;
    setBlocks((prev) => [...prev, { id: uid(), type, value: "" }]);
  };

  const updateBlock = (id: string, value: string) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, value } : b)));
  };

  const updateCaption = (id: string, caption: string) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, caption } : b)));
  };

  const removeBlock = (id: string) => {
    setBlocks((prev) => {
      const block = prev.find((b) => b.id === id);
      if (block?.type === "title") return prev;
      return prev.filter((b) => b.id !== id);
    });
  };

  const moveBlock = (id: string, dir: -1 | 1) => {
    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === id);
      if (idx < 0) return prev;
      const target = idx + dir;
      if (target < 0 || target >= prev.length) return prev;
      if (prev[target]?.type === "title") return prev;

      const next = [...prev];
      const current = next[idx];
      const swapWith = next[target];
      if (!current || !swapWith) return prev;

      next[idx] = swapWith;
      next[target] = current;
      return next;
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const titleBlock = blocks.find((b) => b.type === "title");
    if (!titleBlock || !titleBlock.value.trim()) {
      setError("El título es obligatorio.");
      return;
    }

    const cleanBlocks = blocks.filter((b) => {
      if (b.type === "subtitle" || b.type === "text") return stripHtml(b.value).length > 0;
      return b.value.trim().length > 0;
    });

    if (cleanBlocks.length < 2) {
      setError("Añade al menos un bloque adicional con contenido.");
      return;
    }

    const badVideo = cleanBlocks.find(
      (b) => b.type === "video" && !getYouTubeId(b.value)
    );
    if (badVideo) {
      setError("Cada vídeo debe ser un enlace válido de YouTube.");
      return;
    }

    const newItem: Landscape = { id: uid(), blocks: cleanBlocks };
    persist([...items, newItem]);
    cancelCreate();
  };

  const handleDelete = (id: string) => {
    persist(items.filter((i) => i.id !== id));
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-display text-brand-deep">Gestión de Paisajes</h1>
        {!isCreating && (
          <button
            onClick={openCreate}
            className="bg-primary text-white px-5 py-2.5 rounded-xl font-semibold hover:opacity-90"
          >
            + Añadir paisaje
          </button>
        )}
      </div>

      {isCreating && (
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-2xl border border-border bg-white p-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-brand-deep">Nuevo paisaje</h2>
              <button
                type="button"
                onClick={cancelCreate}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Cancelar
              </button>
            </div>

            <div className="space-y-3">
              {blocks.map((b, i) => (
                <BlockEditor
                  key={b.id}
                  block={b}
                  isFirst={i === 0}
                  onUpdateValue={(v) => updateBlock(b.id, v)}
                  onUpdateCaption={(c) => updateCaption(b.id, c)}
                  onRemove={() => removeBlock(b.id)}
                  onMoveUp={() => moveBlock(b.id, -1)}
                  onMoveDown={() => moveBlock(b.id, 1)}
                />
              ))}
            </div>

            <div className="flex flex-wrap gap-2 border-t border-border pt-4">
              <span className="w-full text-sm font-semibold text-muted-foreground">
                Añadir bloque:
              </span>
              {(["subtitle", "text", "image", "video"] as BlockType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => addBlock(t)}
                  className="rounded-full border border-border px-4 py-1.5 text-sm font-semibold hover:bg-muted"
                >
                  + {BLOCK_LABELS[t]}
                </button>
              ))}
            </div>

            {error && (
              <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
            )}

            <div className="flex gap-2">
              <button
                type="submit"
                className="rounded-xl bg-primary px-6 py-2 font-semibold text-white hover:opacity-90"
              >
                Guardar paisaje
              </button>
              <button
                type="button"
                onClick={cancelCreate}
                className="rounded-xl border border-border px-6 py-2 font-semibold hover:bg-muted"
              >
                Cancelar
              </button>
            </div>
          </form>

          <div className="rounded-2xl border border-border bg-muted/30 p-6">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Vista previa (landing)
            </p>
            <LandscapePreview blocks={blocks} />
          </div>
        </div>
      )}

      <div className="space-y-4">
        {items.length === 0 && !isCreating && (
          <p className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
            No hay paisajes todavía. Pulsa "+ Añadir paisaje" para crear el primero.
          </p>
        )}

        {items.map((item) => {
          const titleBlock = item.blocks.find((b) => b.type === "title");
          const imageBlock = item.blocks.find((b) => b.type === "image");
          const textBlock = item.blocks.find((b) => b.type === "text");

          return (
            <div key={item.id} className="flex items-start gap-4 rounded-xl border bg-white p-4">
              {imageBlock ? (
                <img
                  src={imageBlock.value}
                  alt=""
                  className="h-24 w-24 shrink-0 rounded-lg object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg bg-muted text-xs text-muted-foreground">
                  Sin foto
                </div>
              )}

              <div className="min-w-0 flex-1">
                <h3 className="font-bold">
                  {titleBlock ? stripHtml(titleBlock.value) : "(Sin título)"}
                </h3>
                {textBlock && (
                  <p className="line-clamp-3 text-sm text-muted-foreground">
                    {stripHtml(textBlock.value)}
                  </p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.blocks.length} bloque{item.blocks.length === 1 ? "" : "s"}
                </p>
              </div>

              <button
                onClick={() => handleDelete(item.id)}
                className="shrink-0 px-4 font-bold text-red-500"
              >
                Borrar
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Editor de bloque
// ---------------------------------------------------------------------------
function BlockEditor({
  block,
  isFirst,
  onUpdateValue,
  onUpdateCaption,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  block: Block;
  isFirst: boolean;
  onUpdateValue: (v: string) => void;
  onUpdateCaption: (v: string) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const isTitle = block.type === "title";

  return (
    <div className="rounded-xl border border-border bg-muted/30 p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {BLOCK_LABELS[block.type]}
          {isTitle && " (obligatorio)"}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={isFirst}
            className="rounded px-2 py-0.5 text-xs hover:bg-muted disabled:opacity-30"
            aria-label="Mover arriba"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            className="rounded px-2 py-0.5 text-xs hover:bg-muted"
            aria-label="Mover abajo"
          >
            ↓
          </button>
          {!isTitle && (
            <button
              type="button"
              onClick={onRemove}
              className="rounded px-2 py-0.5 text-xs text-red-500 hover:bg-red-50"
              aria-label="Eliminar bloque"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {block.type === "title" && (
        <input
          value={block.value}
          onChange={(e) => onUpdateValue(e.target.value)}
          placeholder={BLOCK_PLACEHOLDERS.title}
          className="w-full rounded-xl border bg-white p-3 text-lg font-bold"
        />
      )}

      {block.type === "subtitle" && (
        <RichTextEditor
          value={block.value}
          onChange={onUpdateValue}
          placeholder={BLOCK_PLACEHOLDERS.subtitle}
          variant="subtitle"
        />
      )}

      {block.type === "text" && (
        <RichTextEditor
          value={block.value}
          onChange={onUpdateValue}
          placeholder={BLOCK_PLACEHOLDERS.text}
          variant="text"
        />
      )}

      {block.type === "image" && (
        <ImageBlockEditor
          value={block.value}
          caption={block.caption ?? ""}
          onChange={onUpdateValue}
          onChangeCaption={onUpdateCaption}
        />
      )}

      {block.type === "video" && (
        <VideoBlockEditor value={block.value} onChange={onUpdateValue} />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Editor de texto enriquecido (sin listas)
// ---------------------------------------------------------------------------
function RichTextEditor({
  value,
  onChange,
  placeholder,
  variant = "text",
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder: string;
  variant?: "text" | "subtitle";
}) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const exec = (cmd: string, arg?: string) => {
    const editor = editorRef.current;
    if (!editor) return;

    editor.focus();

    const sel = window.getSelection();
    const hasSelectionInside =
      !!sel &&
      sel.rangeCount > 0 &&
      !!sel.anchorNode &&
      editor.contains(sel.anchorNode);

    if (!hasSelectionInside) {
      const range = document.createRange();
      range.selectNodeContents(editor);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }

    document.execCommand(cmd, false, arg);
    handleInput();
  };

  const buttons: { label: React.ReactNode; cmd: string; title: string }[] = [
    { label: <strong>B</strong>, cmd: "bold", title: "Negrita" },
    { label: <em>I</em>, cmd: "italic", title: "Cursiva" },
    { label: <u>U</u>, cmd: "underline", title: "Subrayado" },
    { label: <s>S</s>, cmd: "strikeThrough", title: "Tachado" },
    { label: "⟵", cmd: "justifyLeft", title: "Alinear izquierda" },
    { label: "↔", cmd: "justifyCenter", title: "Centrar" },
    { label: "⟶", cmd: "justifyRight", title: "Alinear derecha" },
    { label: "⟲", cmd: "removeFormat", title: "Quitar formato" },
  ];

  return (
    <div className="overflow-hidden rounded-xl border bg-white">
      <div className="flex flex-wrap gap-1 border-b border-border bg-muted/40 p-1.5">
        {buttons.map((b) => (
          <button
            key={b.cmd}
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec(b.cmd)}
            title={b.title}
            className="rounded px-2 py-1 text-xs font-semibold hover:bg-muted"
          >
            {b.label}
          </button>
        ))}
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onBlur={handleInput}
        data-placeholder={placeholder}
        className={`prose prose-sm max-w-none p-3 outline-none empty:before:pointer-events-none empty:before:text-muted-foreground empty:before:content-[attr(data-placeholder)] ${
          variant === "subtitle" ? "text-lg font-semibold" : "text-base"
        }`}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Editor de imagen con drag & drop
// ---------------------------------------------------------------------------
function ImageBlockEditor({
  value,
  caption,
  onChange,
  onChangeCaption,
}: {
  value: string;
  caption: string;
  onChange: (v: string) => void;
  onChangeCaption: (v: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setLoading(true);
    try {
      const dataUrl = await fileToDataUrl(file);
      onChange(dataUrl);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          void handleFiles(e.dataTransfer.files);
        }}
        className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed bg-white p-6 text-center text-sm transition-colors ${
          isDragging
            ? "border-primary bg-primary/5 text-primary"
            : "border-border text-muted-foreground hover:border-primary/60"
        }`}
      >
        {loading ? (
          <span>Cargando imagen…</span>
        ) : value ? (
          <img
            src={value}
            alt="Vista previa"
            className="max-h-40 w-full rounded-lg object-cover"
          />
        ) : (
          <>
            <span className="font-semibold">Arrastra una imagen aquí</span>
            <span className="text-xs">o haz clic para seleccionarla del dispositivo</span>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => void handleFiles(e.target.files)}
        />
      </div>

      <input
        value={caption}
        onChange={(e) => onChangeCaption(e.target.value)}
        placeholder="Pie de foto (opcional)"
        className="w-full rounded-xl border bg-white p-2 text-sm"
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="text-xs text-red-500 hover:underline"
        >
          Quitar imagen
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Editor de vídeo de YouTube
// ---------------------------------------------------------------------------
function VideoBlockEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const id = value ? getYouTubeId(value) : null;

  return (
    <div className="space-y-2">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={BLOCK_PLACEHOLDERS.video}
        className="w-full rounded-xl border bg-white p-3 text-sm"
      />
      {value && !id && (
        <p className="text-xs text-red-500">
          Enlace de YouTube no válido. Ej: https://www.youtube.com/watch?v=XXXX
        </p>
      )}
      {id && (
        <div className="aspect-video overflow-hidden rounded-lg">
          <iframe
            src={`https://www.youtube.com/embed/${id}`}
            title="Vista previa de YouTube"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Vista previa del paisaje (landing)
// ---------------------------------------------------------------------------
function LandscapePreview({ blocks }: { blocks: Block[] }) {
  if (blocks.length === 0 || !blocks.some((b) => b.value.trim())) {
    return (
      <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        Empieza añadiendo contenido para ver la vista previa.
      </p>
    );
  }

  return (
    <article className="space-y-4">
      {blocks.map((b) => {
        if (b.type === "title") {
          return (
            <h2 key={b.id} className="text-3xl font-bold text-brand-deep sm:text-4xl">
              {stripHtml(b.value) || "Título del paisaje"}
            </h2>
          );
        }

        if (b.type === "subtitle" && stripHtml(b.value)) {
          return (
            <h3
              key={b.id}
              className="text-xl font-semibold text-brand-deep/90"
              dangerouslySetInnerHTML={{ __html: b.value }}
            />
          );
        }

        if (b.type === "text" && stripHtml(b.value)) {
          return (
            <div
              key={b.id}
              className="prose prose-sm max-w-none leading-relaxed text-foreground"
              dangerouslySetInnerHTML={{ __html: b.value }}
            />
          );
        }

        if (b.type === "image" && b.value) {
          return (
            <figure key={b.id} className="space-y-2">
              <img
                src={b.value}
                alt={b.caption ?? ""}
                className="w-full rounded-2xl object-cover"
              />
              {b.caption && (
                <figcaption className="text-center text-sm text-muted-foreground">
                  {b.caption}
                </figcaption>
              )}
            </figure>
          );
        }

        if (b.type === "video" && b.value) {
          const id = getYouTubeId(b.value);
          if (!id) return null;
          return (
            <div key={b.id} className="aspect-video overflow-hidden rounded-2xl">
              <iframe
                src={`https://www.youtube.com/embed/${id}`}
                title="Vídeo del paisaje"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          );
        }

        return null;
      })}
    </article>
  );
}