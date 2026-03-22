import { useLang } from "@/contexts/LanguageContext";
import { Lock, Eye, Trash2, Server, ShieldCheck, UserX } from "lucide-react";

const SafetySection = () => {
  const { t } = useLang();

  const items = [
    { icon: Lock, text: t("landing.safety_1") },
    { icon: Eye, text: t("landing.safety_2") },
    { icon: Trash2, text: t("landing.safety_3") },
    { icon: Server, text: t("landing.safety_4") },
    { icon: ShieldCheck, text: t("landing.safety_5") },
    { icon: UserX, text: t("landing.safety_6") },
  ];

  return (
    <section className="py-24 px-6 relative bg-grain">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-center mb-12 text-amber-pale glow-amber-text">
          {t("landing.safety_title")}
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {items.map(({ icon: Icon, text }, i) => (
            <div key={i} className="flex items-center gap-3 p-4 rounded-lg card-mystical">
              <Icon className="w-5 h-5 text-primary shrink-0" />
              <p className="text-sm text-foreground/90">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SafetySection;
