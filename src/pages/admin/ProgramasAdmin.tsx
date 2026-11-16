import { useState, useEffect, type FormEvent } from "react";

export default function ProgramasAdmin() {
  const [items, setItems] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("admin_programas");
    if (saved) setItems(JSON.parse(saved));
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newItem = { id: Date.now().toString(), title, text, image };
    const updated = [...items, newItem];
    setItems(updated);
    localStorage.setItem("admin_programas", JSON.stringify(updated));
    setTitle(""); setText(""); setImage("");
  };

  return (
    <div>
      <h1 className="text-3xl font-display text-brand-deep mb-6">Gestión de Programas</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-border mb-8 space-y-4">
        <input required placeholder="Nombre del programa" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-3 rounded-xl border" />
        <input required placeholder="URL de Imagen" value={image} onChange={e => setImage(e.target.value)} className="w-full p-3 rounded-xl border" />
        <textarea required placeholder="Descripción" value={text} onChange={e => setText(e.target.value)} className="w-full p-3 rounded-xl border" rows={3} />
        <button type="submit" className="bg-primary text-white px-6 py-2 rounded-xl font-semibold">Crear Programa</button>
      </form>
      <div className="space-y-4">
        {items.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-xl border flex gap-4 items-center">
            <img src={item.image} className="w-24 h-24 object-cover rounded-lg" />
            <div className="flex-1">
              <h3 className="font-bold">{item.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}