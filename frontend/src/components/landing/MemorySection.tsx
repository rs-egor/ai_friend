import { useLang } from "@/contexts/LanguageContext";
import { BookOpen } from "lucide-react";

const MemorySection = () => {
  const { t } = useLang();

  return (
    <section className="py-24 px-6 relative bg-grain">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-center mb-4 text-amber-pale glow-amber-text">
          {t("landing.memory_title")}
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          {t("landing.memory_description")}
        </p>

        {/* Chat mockup */}
        <div className="max-w-md mx-auto card-mystical rounded-2xl p-6 glow-amber-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-primary/10">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">{t("landing.memory_archive")}</p>
              <p className="text-xs text-muted-foreground">{t("landing.memory_entries")}</p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { date: t("landing.memory_date_1"), text: t("landing.memory_text_1") },
              { date: t("landing.memory_date_2"), text: t("landing.memory_text_2") },
              { date: t("landing.memory_date_3"), text: t("landing.memory_text_3") },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary/80 transition-colors">
                <span className="text-xs text-primary font-medium whitespace-nowrap mt-0.5">{item.date}</span>
                <p className="text-sm text-foreground/80">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MemorySection;
