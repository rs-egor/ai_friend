import { useLang } from "@/contexts/LanguageContext";
import { Mail, Heart, PawPrint, GraduationCap } from "lucide-react";

const LetterSection = () => {
  const { t } = useLang();

  const examples = [
    {
      icon: Heart,
      to: t("landing.letter_to_ex"),
      letter: t("landing.letter_ex_text"),
      reply: t("landing.letter_ex_reply"),
    },
    {
      icon: GraduationCap,
      to: t("landing.letter_to_mom"),
      letter: t("landing.letter_mom_text"),
      reply: t("landing.letter_mom_reply"),
    },
    {
      icon: PawPrint,
      to: t("landing.letter_to_pet"),
      letter: t("landing.letter_pet_text"),
      reply: t("landing.letter_pet_reply"),
    },
  ];

  return (
    <section className="py-24 px-6 relative bg-grain">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-center mb-4 text-amber-pale glow-amber-text">
          {t("landing.letter_title")}
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          {t("landing.letter_description")}
        </p>

        <div className="space-y-6">
          {examples.map(({ icon: Icon, to, letter, reply }, i) => (
            <div key={i} className="card-mystical rounded-2xl p-6 hover:card-mystical-hover transition-all">
              <div className="flex items-center gap-3 mb-4">
                <Icon className="w-5 h-5 text-primary" />
                <span className="font-semibold text-foreground">{to}</span>
              </div>
              <div className="space-y-3 pl-8">
                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <p className="text-sm text-foreground/80 italic">"{letter}"</p>
                </div>
                <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
                  <span className="text-primary text-sm">→</span>
                  <p className="text-sm text-amber-pale">"{reply}"</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button className="px-8 py-4 rounded-lg bg-primary text-primary-foreground font-semibold text-lg glow-amber hover:brightness-110 transition-all">
            {t("landing.letter_button")}
          </button>
        </div>
      </div>
    </section>
  );
};

export default LetterSection;
