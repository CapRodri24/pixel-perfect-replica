import { BrowserRouter, Routes, Route, useLocation, Outlet, Link } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { I18nProvider } from "@/i18n/I18nProvider";
import { Toaster } from "@/components/ui/sonner";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DonationReminder } from "@/components/DonationForm";

import Home from "@/pages/landing/home";
import Donar from "@/pages/landing/donar"; 
import Nosotros from "@/pages/landing/nosotros";
import Contacto from "@/pages/landing/contacto";
import Paisajes from "@/pages/landing/paisajes";
import { Noticias, NoticiaDetalle } from "@/pages/landing/noticias";
import { Programas, ProgramaDetalle } from "@/pages/landing/programas";
import Login from "@/pages/login/Login";

const queryClient = new QueryClient();

function NotFoundComponent() {
  return <div className="p-10 text-center">404 - No encontrado</div>;
}

function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1"><Outlet /></main>
      <Footer />
      <DonationReminder />
    </div>
  );
}

function AppRoutes() {
  const location = useLocation();

  if (location.pathname === "/login") {
    return <Login />;
  }

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/donar" element={<Donar />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/noticias" element={<Noticias />} />
        <Route path="/noticias/:id" element={<NoticiaDetalle />} />
        <Route path="/programas" element={<Programas />} />
        <Route path="/programas/:id" element={<ProgramaDetalle />} />
        <Route path="/paisajes" element={<Paisajes />} />
        <Route path="*" element={<NotFoundComponent />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <BrowserRouter>
          <AppRoutes />
          <Toaster />
        </BrowserRouter>
      </I18nProvider>
    </QueryClientProvider>
  );
}