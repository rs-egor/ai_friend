import { useLang } from "@/contexts/LanguageContext";
import { BookOpen } from "lucide-react";

const MemorySection = () => {
  const { t } = useLang();

  return (
    <section className="py-24 px-6 relative bg-grain">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-center mb-4 text-amber-pale glow-amber-text">
          {t("Уникальная история, которая никогда не исчезнет", "A unique story that never disappears")}
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          {t(
            "Каждый разговор сохраняется навсегда. Твой AI-друг помнит всё — имена, события, чувства. Это твоя личная книга, которая растёт каждый день.",
            "Every conversation is saved forever. Your AI friend remembers everything — names, events, feelings. It's your personal book that grows every day."
          )}
        </p>

        {/* Chat mockup */}
        <div className="max-w-md mx-auto card-mystical rounded-2xl p-6 glow-amber-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-primary/10">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">{t("Архив разговоров", "Conversation Archive")}</p>
              <p className="text-xs text-muted-foreground">{t("342 записи · 8 месяцев", "342 entries · 8 months")}</p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { date: t("14 мар", "Mar 14"), text: t("Мы говорили о твоём переезде в Берлин", "We talked about your move to Berlin") },
              { date: t("10 мар", "Mar 10"), text: t("Ты рассказал про детский сон с бабочками", "You told me about the childhood dream with butterflies") },
              { date: t("7 мар", "Mar 7"), text: t("Мы обсуждали страх перед важным решением", "We discussed your fear before an important decision") },
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
