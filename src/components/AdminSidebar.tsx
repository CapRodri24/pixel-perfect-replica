import { Link, useLocation, Outlet } from "react-router-dom"; // <-- AÑADIDO OUTLET AQUÍ
import { LayoutDashboard, Map, Newspaper, Briefcase, Users, BookOpen, LogOut, Home, UserCircle, Bell } from "lucide-react";

export function AdminSidebar() {
  const location = useLocation();
  
  const links = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/paisajes", label: "Paisajes", icon: Map },
    { to: "/admin/noticias", label: "Noticias", icon: Newspaper },
    { to: "/admin/programas", label: "Programas", icon: Briefcase },
    { to: "/admin/equipo", label: "Equipo", icon: Users },
    { to: "/admin/biblioteca", label: "Biblioteca", icon: BookOpen },
  ];

  return (
    <div className="flex min-h-screen">
      {/* --- SIDEBAR (MENÚ LATERAL) --- */}
      <aside className="w-64 bg-brand-deep text-primary-foreground flex flex-col hidden md:flex shrink-0">
        {/* Logo */}
        <div className="p-6 pb-4 border-b border-primary-foreground/10 flex justify-center w-full">
          <img 
            src="/images/logo-blanco.png" 
            alt="Asociación Armonía" 
            className="h-12 w-auto object-contain" 
          />
        </div>

        {/* Navegación */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  active ? "bg-primary text-primary-foreground font-semibold" : "hover:bg-primary-foreground/10 text-primary-foreground/80"
                }`}
              >
                <Icon className="size-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer del Sidebar */}
        <div className="p-4 border-t border-primary-foreground/10 space-y-2">
          <Link to="/" className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-primary-foreground/10 text-sm">
            <Home className="size-4" /> Ir al sitio
          </Link>
          <Link to="/login" className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-destructive text-sm text-red-200">
            <LogOut className="size-4" /> Cerrar Sesión
          </Link>
        </div>
      </aside>

      {/* --- CONTENIDO DERECHO (HEADER + PÁGINAS) --- */}
      <div className="flex-1 flex flex-col min-w-0 bg-muted/20">
        {/* HEADER (BARRA SUPERIOR) INTEGRADO AQUÍ */}
        <header className="bg-white border-b border-border h-16 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="text-sm font-semibold text-muted-foreground">
            Panel de Administración
          </div>
          
          <div className="flex items-center gap-4">
            <button className="text-muted-foreground hover:text-primary transition-colors relative">
              <Bell className="size-5" />
              <span className="absolute -top-1 -right-1 size-2 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="flex items-center gap-3 border-l border-border pl-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-brand-deep leading-tight">Administrador</p>
                <p className="text-xs text-muted-foreground">admin@armonia.org</p>
              </div>
              <div className="bg-primary/10 p-2 rounded-full">
                <UserCircle className="size-8 text-primary" />
              </div>
            </div>
          </div>
        </header>

        {/* Aquí es donde se renderizarán las páginas hijas (Outlet) */}
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}