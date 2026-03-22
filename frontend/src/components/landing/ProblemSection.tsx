import { useLang } from "@/contexts/LanguageContext";

const ProblemSection = () => {
  const { t } = useLang();

  const bullets = [
    t("landing.problem_1"),
    t("landing.problem_2"),
    t("landing.problem_3"),
    t("landing.problem_4"),
    t("landing.problem_5"),
    t("landing.problem_6"),
  ];

  return (
    <section className="py-24 px-6 bg-grain relative">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-center mb-12 text-amber-pale glow-amber-text">
          {t("landing.problem_title")}
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
