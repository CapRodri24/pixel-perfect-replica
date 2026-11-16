import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { images } from "@/config/images";

const field = "mt-1.5 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const user = String(f.get("user"));
    const password = String(f.get("password"));
    
    setLoading(true); 
    setError("");

    // Lógica Mock
    setTimeout(() => {
      if (user && password.length >= 4) {
        localStorage.setItem("auth_token", "mock-token-12345");
        navigate("/");
      } else {
        setError("Usuario o contraseña incorrectos (mínimo 4 caracteres).");
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <img src={images.landscapes.andes} alt="Paisaje de los Andes" className="absolute inset-0 size-full object-cover" />
        <div className="hero-overlay absolute inset-0" />
      </div>

      <div className="flex items-center justify-center p-6 bg-background">
        <form onSubmit={submit} className="w-full max-w-sm">
          <div className="mb-8">
            <Logo />
          </div>
          
          <h1 className="mt-10 text-3xl font-display font-semibold text-brand-deep">Iniciar sesión</h1>
          <p className="mt-2 text-sm text-muted-foreground">Panel de administración de contenidos.</p>
          
          <div className="mt-8 space-y-4">
            <label className="block text-sm font-semibold">
              Usuario
              <input 
                name="user" 
                required 
                autoComplete="username" 
                className={field} 
                placeholder="admin"
              />
            </label>
            
            <label className="block text-sm font-semibold">
              Contraseña
              <input 
                name="password" 
                type="password" 
                required 
                autoComplete="current-password" 
                className={field} 
                placeholder="••••••••"
              />
            </label>
          </div>

          {error && <p role="alert" className="mt-4 text-sm text-destructive font-medium">{error}</p>}
          
          <Button type="submit" variant="hero" size="lg" className="mt-6 w-full" disabled={loading}>
            <Lock className="mr-2 size-4" /> 
            {loading ? "Ingresando…" : "Ingresar"}
          </Button>
          
          <Link to="/" className="mt-6 flex items-center justify-center gap-2 text-sm text-primary hover:underline">
            <ArrowLeft className="size-4" />
            Volver al sitio
          </Link>
        </form>
      </div>
    </div>
  );
}