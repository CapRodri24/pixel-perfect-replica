import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { iniciarSesion } from "@/api/loginApi";

const field = "mt-1.5 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const user = String(f.get("user") ?? "");
    const password = String(f.get("password") ?? "");

    setLoading(true);
    setError("");

    try {
      await iniciarSesion(user, password);
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Imagen lateral */}
      <div className="relative hidden lg:block bg-muted">
        <img src="/images/login.png" alt="Paisaje" className="absolute inset-0 size-full object-cover" />
      </div>
      {/* Formulario */}
      <div className="flex items-center justify-center p-6 bg-background">
        <form onSubmit={submit} className="w-full max-w-sm">
          {/* LOGO BLANCO DIRECTO */}
          <div className="mb-8 flex justify-center w-full">
            <img src="/images/logo-blanco.png" alt="Asociación Armonía" className="h-14 w-auto object-contain" />
          </div>
          <h1 className="mt-10 text-3xl font-display font-semibold text-brand-deep text-center">Iniciar sesión</h1>
          <p className="mt-2 text-sm text-muted-foreground text-center">Panel de administración de contenidos.</p>
          <div className="mt-8 space-y-4">
            <label className="block text-sm font-semibold">
              Usuario
              <input name="user" required autoComplete="username" className={field} placeholder="admin" />
            </label>
            <label className="block text-sm font-semibold">
              Contraseña
              <div className="relative">
                <input name="password" type={showPassword ? "text" : "password"} required autoComplete="current-password" className={`${field} pr-12`} placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}>
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
            </label>
          </div>
          {error && <p role="alert" className="mt-4 text-sm text-destructive font-medium text-center">{error}</p>}
          <Button type="submit" variant="hero" size="lg" className="mt-6 w-full" disabled={loading}>
            <Lock className="mr-2 size-4" /> {loading ? "Ingresando…" : "Ingresar"}
          </Button>
          <Link to="/" className="mt-6 flex items-center justify-center gap-2 text-sm text-primary hover:underline">
            <ArrowLeft className="size-4" /> Volver al sitio
          </Link>
        </form>
      </div>
    </div>
  );
}
