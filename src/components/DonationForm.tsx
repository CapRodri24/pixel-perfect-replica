import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, ArrowUpRight } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { Button } from "@/components/ui/button";

export function DonationForm() {
  const { lang } = useI18n();
  useEffect(() => {
    if (document.getElementById("givebutter-script")) return;
    const script = document.createElement("script");
    script.src = "https://widgets.givebutter.com/latest.umd.cjs?acct=d3Z2XsELTXeIww2E";
    script.async = true;
    script.id = "givebutter-script";
    document.head.appendChild(script);
  }, []);
  return (
    <div id="givebutter-form" className="scroll-mt-24">
      <div className="flex items-center gap-3">
        <Heart className="size-6 text-primary" />
        <h2 className="text-3xl text-brand-deep">{lang === "es" ? "Donar" : "Donate"}</h2>
      </div>
      <p className="mt-3 text-muted-foreground">
        {lang === "es"
          ? "Tu aporte ayuda a proteger las aves y los paisajes de Bolivia."
          : "Your gift helps protect Bolivia’s birds and landscapes."}
      </p>
      <div className="mt-6 w-full max-w-xl min-h-64">
        <givebutter-widget id="L4E3Vq" className="block w-full" />
      </div>
    </div>
  );
}

// --- Keyframes del loro + botón (inline, idempotentes) ---
const parrotKeyframes = `
@keyframes parrot-cycle {
  0%   { transform: translate(-160px, 70px) rotate(-22deg) scale(0.85); opacity: 0; }
  6%   { opacity: 1; }
  18%  { transform: translate(0, 0) rotate(0deg) scale(1); opacity: 1; }

  22%  { transform: translateY(-3px) rotate(-3deg); }
  26%  { transform: translateY(0) rotate(0deg); }

  35%  { transform: translateY(-1px) rotate(-5deg); }
  45%  { transform: translateY(0) rotate(0deg); }
  55%  { transform: translateY(-1px) rotate(5deg); }
  65%  { transform: translateY(0) rotate(0deg); }

  /* despega visible hasta salir de pantalla */
  70%  { transform: translate(0, 0) rotate(0deg) scale(1); opacity: 1; }
  92%  { transform: translate(260px, -140px) rotate(25deg) scale(0.9); opacity: 1; }

  /* ya fuera → se oculta y espera al siguiente ciclo */
  92.01% { transform: translate(260px, -140px) rotate(25deg) scale(0.9); opacity: 0; }
  100%   { transform: translate(260px, -140px) rotate(25deg) scale(0.9); opacity: 0; }
}
@keyframes parrot-wing {
  0%, 100% { transform: rotate(-6deg); }
  50%      { transform: rotate(18deg); }
}
@keyframes parrot-tail {
  0%, 100% { transform: rotate(-4deg); }
  50%      { transform: rotate(4deg); }
}
@keyframes heart-pulse {
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.08); }
}
@keyframes button-glow {
  0%, 100% { box-shadow: 0 8px 24px -8px hsl(var(--lp) / 0.45); }
  50%      { box-shadow: 0 12px 32px -6px hsl(var(--lp) / 0.75); }
}
@media (prefers-reduced-motion: reduce) {
  .parrot-anim, .parrot-anim * { animation: none !important; }
}
`;

export function DonationReminder() {
  const { lang } = useI18n();
  return (
    <aside
      aria-label={lang === "es" ? "Apoya la conservación" : "Support conservation"}
      className="fixed bottom-4 right-4 z-40 max-w-[calc(100vw-2rem)]"
    >
      <style>{parrotKeyframes}</style>

      <div className="relative">
        {/* 🦜 Loro sin cola roja, visible hasta salir de pantalla */}
        <svg
          viewBox="0 0 64 64"
          aria-hidden="true"
          className="parrot-anim pointer-events-none absolute -top-10 right-4 size-12 drop-shadow-md"
          style={{
            animation: "parrot-cycle 10s ease-in-out infinite",
            transformOrigin: "50% 90%",
          }}
        >
          {/* Cuerpo verde */}
          <ellipse cx="34" cy="38" rx="12" ry="9" fill="#16a34a" />

          {/* Cabeza verde (más clara) */}
          <circle cx="44" cy="28" r="7" fill="#22c55e" />

          {/* Pico naranja */}
          <path d="M50 26 L60 28 L52 32 Z" fill="#f97316" />
          <path d="M50 28 L58 30 L51 33 Z" fill="#ea580c" />

          {/* Ojo */}
          <circle cx="46" cy="27" r="1.6" fill="#0f172a" />
          <circle cx="46.5" cy="26.5" r="0.5" fill="#ffffff" />

          {/* Ala verde con aleteo */}
          <g
            fill="#15803d"
            style={{
              transformOrigin: "32px 36px",
              animation: "parrot-wing 0.4s ease-in-out infinite",
            }}
          >
            <path d="M28 34 C20 30 12 32 8 38 C14 38 20 40 24 44 C26 40 28 37 28 34 Z" />
            <path d="M14 37 L22 39 M16 41 L23 42" stroke="#166534" strokeWidth="1" fill="none" />
          </g>

          {/* Patas */}
          <g stroke="#f59e0b" strokeWidth="1.5" fill="none" strokeLinecap="round">
            <path d="M34 46 L33 50 M38 46 L39 50" />
          </g>
        </svg>

        {/* Botón con pulso + glow */}
        <Button
          asChild
          size="lg"
          variant="hero"
          className="relative shadow-card border-2 border-background"
          style={{ animation: "button-glow 2.4s ease-in-out infinite" }}
        >
          <Link to="/donar">
            <Heart
              className="size-5"
              style={{ animation: "heart-pulse 1.2s ease-in-out infinite" }}
            />
            {lang === "es" ? "Donar" : "Donate"}
            <ArrowUpRight />
          </Link>
        </Button>
      </div>
    </aside>
  );
}