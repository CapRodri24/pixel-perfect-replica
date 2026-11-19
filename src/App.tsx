import { BrowserRouter, Routes, Route, useLocation, Outlet } from "react-router-dom";
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
import BibliotecaAdmin from "@/pages/admin/BibliotecaAdmin";
const queryClient = new QueryClient();
function NotFoundComponent(){return <div className="p-10 text-center">404 - No encontrado</div>;}
function PublicLayout(){return <div className="flex min-h-screen flex-col"><Header/><main className="flex-1"><Outlet/></main><Footer/><DonationReminder/><FloatingSideButtons/></div>;}
function AdminLayout(){return <AdminSidebar/>;}
function AppRoutes(){const location=useLocation();if(location.pathname==="/login")return <Login/>;return <Routes><Route element={<PublicLayout/>}><Route path="/" element={<Home/>}/><Route path="/donar" element={<Donar/>}/><Route path="/nosotros" element={<Nosotros/>}/><Route path="/contacto" element={<Contacto/>}/><Route path="/contacto/haztemiembro" element={<HazteMiembro/>}/><Route path="/contacto/visitanuestrasreservas" element={<VisitaNuestrasReservas/>}/><Route path="/contacto/guiadecampoaves" element={<GuiaDeCampoAves/>}/><Route path="/contacto/prensa" element={<Prensa/>}/><Route path="/contacto/souvenirs" element={<Souvenirs/>}/><Route path="/contacto/oficinas" element={<Oficinas/>}/><Route path="/noticias" element={<Noticias/>}/><Route path="/noticias/:id" element={<NoticiaDetalle/>}/><Route path="/programas" element={<Programas/>}/><Route path="/programas/:id" element={<ProgramaDetalle/>}/><Route path="/paisajes" element={<Paisajes/>}/><Route path="/recursos" element={<Recursos/>}/></Route><Route path="/admin" element={<AdminLayout/>}><Route index element={<Dashboard/>}/><Route path="paisajes" element={<PaisajesAdmin/>}/><Route path="noticias" element={<NoticiasAdmin/>}/><Route path="programas" element={<ProgramasAdmin/>}/><Route path="equipo" element={<EquipoAdmin/>}/><Route path="biblioteca" element={<BibliotecaAdmin/>}/></Route><Route path="*" element={<NotFoundComponent/>}/></Routes>;}
export default function App(){return <QueryClientProvider client={queryClient}><I18nProvider><BrowserRouter><AppRoutes/><Toaster/></BrowserRouter></I18nProvider></QueryClientProvider>;}
