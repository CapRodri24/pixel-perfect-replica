import { useState, useEffect, type FormEvent } from "react";

export default function BibliotecaAdmin() {
  const [items, setItems] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("admin_biblioteca");
    if (saved) setItems(JSON.parse(saved));
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newItem = { id: Date.now().toString(), title, url };
    const updated = [...items, newItem];
    setItems(updated);
    localStorage.setItem("admin_biblioteca", JSON.stringify(updated));
    setTitle(""); setUrl("");
  };

  return (
    <div>
      <h1 className="text-3xl font-display text-brand-deep mb-6">Biblioteca y Descargas</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-border mb-8 space-y-4">
        <input required placeholder="Título del documento" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-3 rounded-xl border" />
        <input required placeholder="Enlace de descarga (PDF, Drive, etc.)" value={url} onChange={e => setUrl(e.target.value)} className="w-full p-3 rounded-xl border" />
        <button type="submit" className="bg-primary text-white px-6 py-2 rounded-xl font-semibold">Subir Documento</button>
      </form>
      <div className="space-y-4">
        {items.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-xl border">
            <h3 className="font-bold">{item.title}</h3>
            <a href={item.url} target="_blank" className="text-sm text-primary underline">Ver Documento</a>
          </div>
        ))}
      </div>
    </div>
  );
}