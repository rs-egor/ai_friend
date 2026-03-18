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
          {t("Ранний доступ", "Early Access")}
        </div>

        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6 glow-amber-text text-amber-pale">
          {t(
            "Твой AI-друг, которого ты создаёшь прямо сейчас",
            "Your AI friend — created by you, right now"
          )}
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto">
          {t(
            "Создай друга за 30 секунд — он помнит каждое слово навсегда и позволяет написать письмо тому, кого уже нет рядом, и получить ответ, который ты всегда хотел услышать.",
            "Create your friend in 30 seconds — he remembers every word forever and lets you write a letter to someone who's gone and get the reply you always wanted."
          )}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <Button size="lg" className="px-8 py-6 text-lg" onClick={onGetStarted}>
            {t("Начать разговор", "Start a conversation")}
          </Button>
          <Button size="lg" variant="outline" className="px-8 py-6 text-lg border-2" asChild>
            <Link to="/register">{t("Написать письмо", "Write a letter")}</Link>
          </Button>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          {t("3 дня бесплатно • потом от 29 $/мес", "3 days free • then from $29/mo")}
        </p>

        <p className="text-xs text-muted-foreground/70">
          {t(
            "Полная приватность · Память навсегда · Без осуждения",
            "Full privacy · Memory forever · No judgment"
          )}
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
