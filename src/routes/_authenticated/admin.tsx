import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Mountain, Newspaper, Sprout, Users, Library, LogOut, Menu, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/site/Logo";
import { Button } from "@/components/ui/button";
import { ContentManager } from "@/components/admin/ContentManager";
import type { ContentKind } from "@/lib/cms";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Panel · Asociación Armonía" },
      { name: "description", content: "Gestión de contenidos de Asociación Armonía." },
      { property: "og:title", content: "Panel · Asociación Armonía" },
      { property: "og:description", content: "Gestión de contenidos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const sections: { kind: ContentKind; label: string; icon: typeof Mountain }[] = [
  { kind: "landscape", label: "Paisajes", icon: Mountain },
  { kind: "news", label: "Noticias", icon: Newspaper },
  { kind: "program", label: "Programas", icon: Sprout },
  { kind: "team", label: "Equipo", icon: Users },
  { kind: "library", label: "Biblioteca", icon: Library },
];

function AdminPage() {
  const [kind, setKind] = useState<ContentKind>("landscape");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const qc = useQueryClient();
  const signOut = async () => {
    await qc.cancelQueries(); qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/login", replace: true });
  };
  const current = sections.find((s) => s.kind === kind)!;
  return (
    <div className="flex min-h-screen bg-muted">
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-brand-deep p-5 text-primary-foreground transition-transform lg:static lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <Logo light />
        <nav className="mt-10 flex-1 space-y-1">
          {sections.map((s) => (
            <button key={s.kind} onClick={() => { setKind(s.kind); setOpen(false); }}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${kind === s.kind ? "bg-primary" : "hover:bg-primary-foreground/10"}`}>
              <s.icon className="size-4" /> {s.label}
            </button>
          ))}
        </nav>
        <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-primary-foreground/10"><ExternalLink className="size-4" /> Ver sitio</a>
        <button onClick={signOut} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-primary-foreground/10"><LogOut className="size-4" /> Cerrar sesión</button>
      </aside>
      {open && <div className="fixed inset-0 z-30 bg-overlay/50 lg:hidden" onClick={() => setOpen(false)} />}
      <main className="min-w-0 flex-1 p-4 sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <Button variant="outline" size="icon" className="lg:hidden" onClick={() => setOpen(true)} aria-label="Menú"><Menu /></Button>
          <h1 className="text-3xl text-brand-deep">{current.label}</h1>
        </div>
        <ContentManager key={kind} kind={kind} />
      </main>
    </div>
  );
}
