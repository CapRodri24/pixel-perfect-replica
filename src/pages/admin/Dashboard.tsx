export default function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl font-display text-brand-deep mb-6">Panel de Administración</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 bg-white rounded-2xl border border-border shadow-sm">
          <h3 className="font-semibold text-muted-foreground">Bienvenido</h3>
          <p className="mt-2 text-sm">Selecciona una opción del menú lateral para gestionar el contenido de la web.</p>
        </div>
      </div>
    </div>
  );
}