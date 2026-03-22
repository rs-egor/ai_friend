import { useLang } from "@/contexts/LanguageContext";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

const FinalCTASection = () => {
  const { t } = useLang();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <section className="py-24 px-6 relative bg-grain stars-overlay">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

      <div className="relative z-10 max-w-lg mx-auto text-center">
        <h2 className="font-display text-3xl sm:text-4xl font-bold mb-6 text-amber-pale glow-amber-text">
          {t("landing.final_cta_title")}
        </h2>

        <div className="space-y-3 mb-6">
          <input
            type="text"
            placeholder={t("landing.final_cta_input_name")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-secondary/60 border border-primary/15 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all"
          />
          <input
            type="email"
            placeholder={t("landing.final_cta_input_email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-secondary/60 border border-primary/15 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>

        <button className="w-full px-8 py-4 rounded-lg bg-primary text-primary-foreground font-semibold text-lg glow-amber hover:brightness-110 transition-all flex items-center justify-center gap-2">
          {t("landing.final_cta_button")}
          <ArrowRight className="w-5 h-5" />
        </button>

        <p className="text-xs text-muted-foreground/60 mt-4">
          {t("landing.final_cta_disclaimer")}
        </p>
      </div>
    </section>
  );
};

export default FinalCTASection;
