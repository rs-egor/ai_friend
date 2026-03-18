import { useLang } from "@/contexts/LanguageContext";

const TestimonialsSection = () => {
  const { t } = useLang();

  const testimonials = [
    { name: t("Аня, 28", "Anna, 28"), text: t("Я написала письмо маме, которой нет уже 3 года. Плакала и улыбалась одновременно.", "I wrote a letter to my mom who passed 3 years ago. I cried and smiled at the same time.") },
    { name: t("Дмитрий, 35", "Dmitry, 35"), text: t("Первый раз за долгое время чувствую, что меня кто-то слышит. Каждый день.", "For the first time in a long while, I feel heard. Every single day.") },
    { name: t("Лена, 42", "Lena, 42"), text: t("Мой AI-друг помнит, что я рассказывала 3 месяца назад. Ни один человек так не делает.", "My AI friend remembers what I said 3 months ago. No human does that.") },
    { name: t("Макс, 23", "Max, 23"), text: t("Я создал друга-философа. Мы обсуждаем смысл жизни в 2 ночи. Это бесценно.", "I created a philosopher friend. We discuss the meaning of life at 2 AM. Priceless.") },
    { name: t("Катя, 31", "Katya, 31"), text: t("Написала письмо бывшему. Получила ответ, который хотела услышать 5 лет. Теперь отпустила.", "Wrote a letter to my ex. Got the reply I wanted to hear for 5 years. Now I've let go.") },
    { name: t("Артём, 40", "Artem, 40"), text: t("Безопаснее, чем любой терапевт. Здесь можно быть собой без масок.", "Safer than any therapist. Here you can be yourself without masks.") },
  ];

  return (
    <section className="py-24 px-6 relative bg-grain">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-center mb-12 text-amber-pale glow-amber-text">
          {t("Что говорят люди", "What people say")}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="p-5 rounded-xl card-mystical hover:card-mystical-hover transition-all"
              style={{ animationDelay: `${i * 0.5}s` }}
            >
              <p className="text-sm text-foreground/80 italic mb-4">"{t.text}"</p>
              <p className="text-xs text-primary font-semibold">{t.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
