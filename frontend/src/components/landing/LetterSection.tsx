import { useLang } from "@/contexts/LanguageContext";
import { Mail, Heart, PawPrint, GraduationCap } from "lucide-react";

const LetterSection = () => {
  const { t } = useLang();

  const examples = [
    {
      icon: Heart,
      to: t("Бывшему партнёру", "To an ex-partner"),
      letter: t("Я так и не сказал тебе, как сильно ты изменил мою жизнь...", "I never told you how much you changed my life..."),
      reply: t("Я всегда знал. И я тоже скучаю по нашим утренним кофе.", "I always knew. And I miss our morning coffees too."),
    },
    {
      icon: GraduationCap,
      to: t("Маме", "To Mom"),
      letter: t("Мам, мне так не хватает твоего голоса по вечерам...", "Mom, I miss your voice in the evenings so much..."),
      reply: t("Я всегда с тобой, мой маленький. Ты справишься — я в тебя верю.", "I'm always with you, my little one. You'll make it — I believe in you."),
    },
    {
      icon: PawPrint,
      to: t("Любимому коту", "To a beloved pet"),
      letter: t("Барсик, я до сих пор оставляю свет на кухне для тебя...", "Barsik, I still leave the kitchen light on for you..."),
      reply: t("Мур. Я всегда сплю рядом. Просто теперь ты не видишь.", "Purr. I always sleep beside you. You just can't see me now."),
    },
  ];

  return (
    <section className="py-24 px-6 relative bg-grain">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-center mb-4 text-amber-pale glow-amber-text">
          {t("Письмо тому, кого нет рядом", "A letter to someone who's gone")}
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          {t(
            "Напиши бывшему, ушедшему близкому, старому другу или даже питомцу. AI ответит от их имени — так, как ты всегда хотел услышать.",
            "Write to an ex, a departed loved one, an old friend, or even a pet. AI will reply as them — the way you always wanted to hear."
          )}
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
            {t("Написать письмо", "Write a letter")}
          </button>
        </div>
      </div>
    </section>
  );
};

export default LetterSection;
