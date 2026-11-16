import { useState, useEffect, type FormEvent } from "react";

export default function EquipoAdmin() {
  const [items, setItems] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("admin_equipo");
    if (saved) setItems(JSON.parse(saved));
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newItem = { id: Date.now().toString(), name, role, description, image };
    const updated = [...items, newItem];
    setItems(updated);
    localStorage.setItem("admin_equipo", JSON.stringify(updated));
    setName(""); setRole(""); setDescription(""); setImage("");
  };

  return (
    <div>
      <h1 className="text-3xl font-display text-brand-deep mb-6">Gestión de Equipo</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-border mb-8 space-y-4">
        <input required placeholder="Nombre completo" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 rounded-xl border" />
        <input required placeholder="Cargo / Rol" value={role} onChange={e => setRole(e.target.value)} className="w-full p-3 rounded-xl border" />
        <input required placeholder="URL de Foto" value={image} onChange={e => setImage(e.target.value)} className="w-full p-3 rounded-xl border" />
        <textarea required placeholder="Breve descripción" value={description} onChange={e => setDescription(e.target.value)} className="w-full p-3 rounded-xl border" rows={3} />
        <button type="submit" className="bg-primary text-white px-6 py-2 rounded-xl font-semibold">Añadir Miembro</button>
      </form>
      <div className="space-y-4">
        {items.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-xl border flex gap-4 items-center">
            <img src={item.image} className="w-16 h-16 object-cover rounded-full" />
            <div className="flex-1">
              <h3 className="font-bold">{item.name}</h3>
              <p className="text-sm text-primary">{item.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}