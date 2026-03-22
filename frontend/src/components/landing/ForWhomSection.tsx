import { useLang } from "@/contexts/LanguageContext";
import { Moon, Heart, Users, Pen, Brain, Shield } from "lucide-react";

const ForWhomSection = () => {
  const { t } = useLang();

  const cards = [
    { icon: Moon, title: t("landing.for_whom_introverts"), desc: t("landing.for_whom_introverts_desc") },
    { icon: Heart, title: t("landing.for_whom_missing"), desc: t("landing.for_whom_missing_desc") },
    { icon: Users, title: t("landing.for_whom_lonely"), desc: t("landing.for_whom_lonely_desc") },
    { icon: Pen, title: t("landing.for_whom_writers"), desc: t("landing.for_whom_writers_desc") },
    { icon: Brain, title: t("landing.for_whom_thinkers"), desc: t("landing.for_whom_thinkers_desc") },
    { icon: Shield, title: t("landing.for_whom_quiet"), desc: t("landing.for_whom_quiet_desc") },
  ];

  return (
    <section className="py-24 px-6 relative bg-grain">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-center mb-12 text-amber-pale glow-amber-text">
          {t("landing.for_whom_title")}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map(({ icon: Icon, title, desc }, i) => (
            <div key={i} className="p-6 rounded-xl card-mystical hover:card-mystical-hover transition-all group">
              <Icon className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-display text-lg font-semibold mb-2 text-foreground">{title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ForWhomSection;
