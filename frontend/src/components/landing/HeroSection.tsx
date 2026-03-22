import { Link } from "react-router-dom";
import { useLang } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

interface HeroSectionProps {
  onGetStarted?: () => void;
}

const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  const { t } = useLang();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-t from-primary/10 to-transparent blur-[80px]" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        {/* Early Access Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-8 glow-amber-sm">
          <Sparkles className="w-4 h-4" />
          {t("landing.early_access")}
        </div>

        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6 glow-amber-text text-amber-pale">
          {t("landing.hero_title")}
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto">
          {t("landing.hero_description")}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <Button size="lg" className="px-8 py-6 text-lg" onClick={onGetStarted}>
            {t("landing.hero_button_primary")}
          </Button>
          <Button size="lg" variant="outline" className="px-8 py-6 text-lg border-2" asChild>
            <Link to="/register">{t("landing.hero_button_secondary")}</Link>
          </Button>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          {t("landing.hero_free_trial")}
        </p>

        <p className="text-xs text-muted-foreground/70">
          {t("landing.hero_privacy")}
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
