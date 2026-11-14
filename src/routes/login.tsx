import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/site/Logo";
import { images } from "@/config/images";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Iniciar sesión · Asociación Armonía" },
      { name: "description", content: "Acceso al panel de administración de Asociación Armonía." },
      { property: "og:title", content: "Iniciar sesión · Asociación Armonía" },
      { property: "og:description", content: "Acceso al panel de administración." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LoginPage,
});

const field = "mt-1.5 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

// Usernames map to an internal email; the user only types "admin".
const toEmail = (u: string) => (u.includes("@") ? u : `${u.trim().toLowerCase()}@armonia.local`);

function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setLoading(true); setError("");
    const { error } = await supabase.auth.signInWithPassword({ email: toEmail(String(f.get("user"))), password: String(f.get("password")) });
    setLoading(false);
    if (error) return setError("Usuario o contraseña incorrectos.");
    navigate({ to: "/admin" });
  };
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <img src={images.landscapes.andes} alt="" className="absolute inset-0 size-full object-cover" />
        <div className="hero-overlay absolute inset-0" />
      </div>
      <div className="flex items-center justify-center p-6">
        <form onSubmit={submit} className="w-full max-w-sm">
          <Logo />
          <h1 className="mt-10 text-3xl text-brand-deep">Iniciar sesión</h1>
          <p className="mt-2 text-sm text-muted-foreground">Panel de administración de contenidos.</p>
          <label className="mt-8 block text-sm font-semibold">Usuario<input name="user" required autoComplete="username" className={field} /></label>
          <label className="mt-4 block text-sm font-semibold">Contraseña<input name="password" type="password" required autoComplete="current-password" className={field} /></label>
          {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
          <Button type="submit" variant="hero" size="lg" className="mt-6 w-full" disabled={loading}><Lock /> {loading ? "Ingresando…" : "Ingresar"}</Button>
          <a href="/" className="mt-6 block text-center text-sm text-primary hover:underline">← Volver al sitio</a>
        </form>
      </div>
    </div>
  );
}
