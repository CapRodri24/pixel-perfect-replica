import { useState, useEffect, type FormEvent } from "react";

export default function NoticiasAdmin() {
  const [items, setItems] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("admin_noticias");
    if (saved) setItems(JSON.parse(saved));
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newItem = { id: Date.now().toString(), title, text, image, youtubeUrl };
    const updated = [...items, newItem];
    setItems(updated);
    localStorage.setItem("admin_noticias", JSON.stringify(updated));
    setTitle(""); setText(""); setImage(""); setYoutubeUrl("");
  };

  const handleDelete = (id: string) => {
    const updated = items.filter(i => i.id !== id);
    setItems(updated);
    localStorage.setItem("admin_noticias", JSON.stringify(updated));
  };

  return (
    <div>
      <h1 className="text-3xl font-display text-brand-deep mb-6">Gestión de Noticias</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-border mb-8 space-y-4">
        <input required placeholder="Título de la noticia" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-3 rounded-xl border" />
        <input required placeholder="URL de la Imagen principal" value={image} onChange={e => setImage(e.target.value)} className="w-full p-3 rounded-xl border" />
        <input placeholder="Enlace de YouTube (opcional)" value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} className="w-full p-3 rounded-xl border" />
        <textarea required placeholder="Texto de la noticia" value={text} onChange={e => setText(e.target.value)} className="w-full p-3 rounded-xl border" rows={4} />
        
        <button type="submit" className="bg-primary text-white px-6 py-2 rounded-xl font-semibold">Crear Noticia</button>
      </form>

      <div className="space-y-4">
        {items.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-xl border flex gap-4 items-start">
            <img src={item.image} className="w-24 h-24 object-cover rounded-lg shrink-0" />
            <div className="flex-1">
              <h3 className="font-bold text-lg text-brand-deep">{item.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{item.text}</p>
              {item.youtubeUrl && (
                <a href={item.youtubeUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-xs font-semibold text-blue-500 hover:underline">
                  Ver enlace de YouTube
                </a>
              )}
            </div>
            <button onClick={() => handleDelete(item.id)} className="text-red-500 font-bold px-4 hover:text-red-700">Borrar</button>
          </div>
        ))}
      </div>
    </div>
  );
}