import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Map, Newspaper, Briefcase, Users, BookOpen, LogOut, Home } from "lucide-react";
import { Logo } from "./Logo";

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
    <aside className="w-64 bg-brand-deep text-primary-foreground min-h-screen flex flex-col hidden md:flex">
      <div className="p-6 border-b border-primary-foreground/10">
        <Logo light />
      </div>
      <nav className="flex-1 p-4 space-y-2">
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
      <div className="p-4 border-t border-primary-foreground/10 space-y-2">
        <Link to="/" className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-primary-foreground/10 text-sm">
          <Home className="size-4" /> Ir al sitio
        </Link>
        <Link to="/login" className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-destructive text-sm text-red-200">
          <LogOut className="size-4" /> Cerrar Sesión
        </Link>
      </div>
    </aside>
  );
}