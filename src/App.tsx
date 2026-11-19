import { useLayoutEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, Outlet, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { I18nProvider } from "@/i18n/I18nProvider";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DonationReminder, FloatingSideButtons } from "@/components/DonationForm";
import { AdminSidebar } from "@/components/AdminSidebar";
import Home from "@/pages/landing/home";
import Donar from "@/pages/landing/donar";
import Nosotros from "@/pages/landing/nosotros";
import Contacto from "@/pages/landing/contacto";
import Paisajes from "@/pages/landing/paisajes";
import Recursos from "./pages/landing/recursos";
import { Noticias, NoticiaDetalle } from "@/pages/landing/noticias";
import { Programas, ProgramaDetalle } from "@/pages/landing/programas";
import HazteMiembro from "@/pages/landing/contacto/haztemiembro";
import VisitaNuestrasReservas from "@/pages/landing/contacto/visitanuestrasreservas";
import GuiaDeCampoAves from "@/pages/landing/contacto/guiadecampoaves";
import Prensa from "@/pages/landing/contacto/prensa";
import Souvenirs from "@/pages/landing/contacto/souvenirs";
import Oficinas from "@/pages/landing/contacto/oficinas";
import Login from "@/pages/login/Login";
import Dashboard from "@/pages/admin/Dashboard";
import PaisajesAdmin from "@/pages/admin/PaisajesAdmin";
import NoticiasAdmin from "@/pages/admin/NoticiasAdmin";
import ProgramasAdmin from "@/pages/admin/ProgramasAdmin";
import EquipoAdmin from "@/pages/admin/EquipoAdmin";
import RecursosAdmin from "@/pages/admin/RecursosAdmin";
const queryClient = new QueryClient();

// Si se abre directamente una página pública, Inicio será su antecedente.
// No se intercepta el botón Atrás ni se crean entradas al volver a Inicio.
function preparePublicHistory() {
  if (typeof window === "undefined") return;
  const { pathname, search, hash, origin } = window.location;
  const publicRoute = /^\/(donar|nosotros|contacto|noticias|programas|paisajes|recursos)(?:\/|$)/.test(pathname);
  const state = window.history.state;
  if (!publicRoute || (typeof state?.idx === "number" && state.idx > 0)) return;
  try {
    window.history.replaceState({ usr: null, key: "default", idx: 0 }, "", `${origin}/`);
    window.history.pushState({ ...state, usr: state?.usr ?? null, key: "public-entry", idx: 1 }, "", `${origin}${pathname}${search}${hash}`);
  } catch {
    // Si el navegador no permite modificar el historial, el botón Volver del Header mantiene su alternativa a Inicio.
  }
}
preparePublicHistory();
// Reinicia la posición al navegar, sin alterar el historial de React Router.
function ScrollToTop() {
  const { key } = useLocation();

  useLayoutEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    return () => {
      window.history.scrollRestoration = previous;
    };
  }, []);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    // Los componentes de cada página conservan su navegación por anclas (#).
    // Sus efectos de desplazamiento se ejecutan después de este reinicio.
  }, [key]);

  return null;
}

function NotFoundComponent(){return <div className="p-10 text-center">404 - No encontrado</div>;}
function PublicLayout(){return <div className="flex min-h-screen flex-col"><Header/><main className="flex-1"><Outlet/></main><Footer/><DonationReminder/><FloatingSideButtons/></div>;}
function AdminLayout(){return <AdminSidebar/>;}
function AppRoutes(){const location=useLocation();if(location.pathname==="/login")return <Login/>;return <Routes><Route element={<PublicLayout/>}><Route path="/" element={<Home/>}/><Route path="/donar" element={<Donar/>}/><Route path="/nosotros" element={<Nosotros/>}/><Route path="/contacto" element={<Contacto/>}/><Route path="/contacto/haztemiembro" element={<HazteMiembro/>}/><Route path="/contacto/visitanuestrasreservas" element={<VisitaNuestrasReservas/>}/><Route path="/contacto/guiadecampoaves" element={<GuiaDeCampoAves/>}/><Route path="/contacto/prensa" element={<Prensa/>}/><Route path="/contacto/souvenirs" element={<Souvenirs/>}/><Route path="/contacto/oficinas" element={<Oficinas/>}/><Route path="/noticias" element={<Noticias/>}/><Route path="/noticias/:id" element={<NoticiaDetalle/>}/><Route path="/programas" element={<Programas/>}/><Route path="/programas/:id" element={<ProgramaDetalle/>}/><Route path="/paisajes" element={<Paisajes/>}/><Route path="/recursos" element={<Recursos/>}/></Route><Route path="/admin" element={<AdminLayout/>}><Route index element={<Dashboard/>}/><Route path="paisajes" element={<PaisajesAdmin/>}/><Route path="noticias" element={<NoticiasAdmin/>}/><Route path="programas" element={<ProgramasAdmin/>}/><Route path="equipo" element={<EquipoAdmin/>}/><Route path="recursos" element={<RecursosAdmin/>}/><Route path="biblioteca" element={<Navigate to="/admin/recursos" replace/>}/></Route><Route path="*" element={<NotFoundComponent/>}/></Routes>;}
export default function App(){return <QueryClientProvider client={queryClient}><I18nProvider><BrowserRouter><ScrollToTop/><AppRoutes/><Toaster/></BrowserRouter></I18nProvider></QueryClientProvider>;}
