import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { I18nProvider } from "@/i18n/I18nProvider";
import { Toaster } from "@/components/ui/sonner";

// Componentes Globales (Layout)
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DonationReminder } from "@/components/DonationForm";

// Vistas (Páginas) - Importaciones ajustadas a tus nombres de archivo
import Home from "@/pages/landing/home";
import Donar from "@/pages/landing/donar"; 
import Nosotros from "@/pages/landing/nosotros";
import Contacto from "@/pages/landing/contacto";
import Noticias from "@/pages/landing/noticias";
import NoticiaDetalle from "@/pages/landing/noticias_.$id";
import Programas from "@/pages/landing/programas";
import ProgramaDetalle from "@/pages/landing/programas_.$id";
import Paisajes from "@/pages/landing/paisajes";
import Recursos from "@/pages/landing/recursos";
import Login from "@/pages/login/Login";

const queryClient = new QueryClient();

// Componente para páginas no encontradas (404)
function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Página no encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          La página que buscas no existe o ha sido movida.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Ir al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <BrowserRouter>
          <div className="flex min-h-screen flex-col">
            <Header />
            
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/donar" element={<Donar />} />
                <Route path="/nosotros" element={<Nosotros />} />
                <Route path="/contacto" element={<Contacto />} />
                <Route path="/noticias" element={<Noticias />} />
                <Route path="/noticias/:id" element={<NoticiaDetalle />} />
                <Route path="/programas" element={<Programas />} />
                <Route path="/programas/:id" element={<ProgramaDetalle />} />
                <Route path="/paisajes" element={<Paisajes />} />
                <Route path="/recursos" element={<Recursos />} />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<NotFoundComponent />} />
              </Routes>
            </main>

            <Footer />
            <DonationReminder />
          </div>
          
          <Toaster />
        </BrowserRouter>
      </I18nProvider>
    </QueryClientProvider>
  );
}