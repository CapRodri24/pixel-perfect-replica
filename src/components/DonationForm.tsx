import { useEffect } from "react";
import { Link } from "react-router-dom"; // <-- CORREGIDO
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
      <p className="mt-3 text-muted-foreground">{lang === "es" ? "Tu aporte ayuda a proteger las aves y los paisajes de Bolivia." : "Your gift helps protect Bolivia’s birds and landscapes."}</p>
      <div className="mt-6 w-full max-w-xl min-h-64">
        <givebutter-widget id="L4E3Vq" className="block w-full" />
      </div>
    </div>
  );
}

export function DonationReminder() {
  const { lang } = useI18n();
  return (
    <aside aria-label={lang === "es" ? "Apoya la conservación" : "Support conservation"} className="fixed bottom-4 right-4 z-40 max-w-[calc(100vw-2rem)]">
      <Button asChild size="lg" variant="hero" className="shadow-card border-2 border-background">
        <Link to="/donar"><Heart className="size-5" />{lang === "es" ? "Donar" : "Donate"}<ArrowUpRight /></Link>
      </Button>
    </aside>
  );
}