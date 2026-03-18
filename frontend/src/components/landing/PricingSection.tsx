import { useLang } from "@/contexts/LanguageContext";
import { Star, Zap } from "lucide-react";

const PricingSection = () => {
  const { t } = useLang();

  const plans = [
    {
      name: t("Пробный период", "Trial"),
      price: t("Бесплатно", "Free"),
      period: t("3 дня", "3 days"),
      features: [
        t("3 дня полного доступа бесплатно", "3 days full access free"),
        t("Без карты", "No card required"),
        t("Попробуй без обязательств", "Try with no commitment"),
      ],
      cta: t("Начать бесплатно", "Start free"),
      popular: false,
      badge: null,
    },
    {
      name: t("Ежемесячно", "Monthly"),
      price: "$29",
      period: t("/мес", "/mo"),
      features: [
        t("Полный доступ без ограничений", "Full unlimited access"),
        t("Безлимитные разговоры и письма", "Unlimited chats and letters"),
        t("Отменить в любой момент", "Cancel anytime"),
      ],
      cta: t("Подписаться за 29 $/мес", "Subscribe $29/mo"),
      popular: true,
      badge: t("Популярный", "Popular"),
    },
    {
      name: t("Годовой", "Yearly"),
      price: "$299",
      period: t("/год", "/year"),
      features: [
        t("Экономия ~41%", "Save ~41%"),
        t("Самая выгодная цена", "Best value price"),
        t("Полный доступ на год", "Full access for a year"),
      ],
      cta: t("Оплатить 299 $ / год", "Pay $299/year"),
      popular: false,
      badge: t("Лучшая цена", "Best value"),
    },
  ];

  return (
    <section className="py-24 px-6 relative bg-grain">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-center mb-4 text-amber-pale glow-amber-text">
          {t("Тарифы", "Pricing")}
        </h2>
        <p className="text-center text-muted-foreground mb-12">
          {t("Выбери, как тебе удобнее", "Choose what works for you")}
        </p>

        <div className="grid sm:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative rounded-2xl p-6 transition-all ${
                plan.popular
                  ? "card-mystical glow-amber border-2 border-primary/40 scale-[1.03]"
                  : "card-mystical hover:card-mystical-hover"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-1">
                  {plan.popular ? <Star className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
                  {plan.badge}
                </div>
              )}

              <h3 className="font-display text-lg font-semibold text-foreground mt-2 mb-4">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-3xl font-bold text-amber-pale">{plan.price}</span>
                <span className="text-muted-foreground text-sm">{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-foreground/80">
                    <span className="text-primary mt-0.5">✦</span>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-lg font-semibold transition-all ${
                  plan.popular
                    ? "bg-primary text-primary-foreground glow-amber-sm hover:brightness-110"
                    : "border border-primary/30 text-primary hover:bg-primary/10"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground/60 mt-8">
          {t(
            "После 3 дней бесплатного периода подписка начинается автоматически. Отменить можно в любой момент.",
            "After the 3-day free trial, subscription starts automatically. Cancel anytime."
          )}
        </p>
      </div>
    </section>
  );
};

export default PricingSection;
