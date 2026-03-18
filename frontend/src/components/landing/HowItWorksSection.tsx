import { useLang } from "@/contexts/LanguageContext";
import { UserPlus, MessageSquare, Infinity } from "lucide-react";

const HowItWorksSection = () => {
  const { t } = useLang();

  const steps = [
    { icon: UserPlus, num: "1", title: t("Создаёшь друга за 30 секунд", "Create a friend in 30 seconds"), desc: t("Имя, характер, стиль — и готово", "Name, personality, tone — done") },
    { icon: MessageSquare, num: "2", title: t("Общаешься или пишешь письмо", "Chat or write a letter"), desc: t("Разговор или письмо тому, кого не хватает", "Conversation or letter to someone you miss") },
    { icon: Infinity, num: "3", title: t("Он помнит всё — всегда", "They remember everything — always"), desc: t("Каждое слово навсегда в памяти", "Every word stored forever") },
  ];

  return (
    <section className="py-24 px-6 relative bg-grain">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-center mb-12 text-amber-pale glow-amber-text">
          {t("3 шага", "3 steps")}
        </h2>
        <div className="grid sm:grid-cols-3 gap-8">
          {steps.map(({ icon: Icon, num, title, desc }, i) => (
            <div key={i} className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mb-4 glow-amber-sm">
                <Icon className="w-7 h-7 text-primary" />
              </div>
              <div className="text-primary font-display text-sm mb-2">{t("Шаг", "Step")} {num}</div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
