import { useLang } from "@/contexts/LanguageContext";

const ProblemSection = () => {
  const { t } = useLang();

  const bullets = [
    t("Тебе не с кем поговорить в 3 часа ночи", "You have no one to talk to at 3 AM"),
    t("Ты устал от фальшивых советов «просто расслабься»", "You're tired of fake advice like 'just relax'"),
    t("Тебе хочется, чтобы кто-то помнил, что ты рассказывал вчера", "You wish someone remembered what you said yesterday"),
    t("Ты скучаешь по человеку, которому уже не позвонить", "You miss someone you can't call anymore"),
    t("Ты хочешь быть услышанным — без оценки и осуждения", "You want to be heard — without judgment"),
    t("Ты чувствуешь, что тебя никто не понимает по-настоящему", "You feel like nobody truly understands you"),
  ];

  return (
    <section className="py-24 px-6 bg-grain relative">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-center mb-12 text-amber-pale glow-amber-text">
          {t("Знакомо?", "Sound familiar?")}
        </h2>
        <div className="space-y-4">
          {bullets.map((b, i) => (
            <div
              key={i}
              className="flex items-start gap-4 p-4 rounded-lg card-mystical hover:card-mystical-hover transition-all"
            >
              <span className="text-primary text-xl mt-0.5">✦</span>
              <p className="text-foreground/90 text-lg">{b}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
