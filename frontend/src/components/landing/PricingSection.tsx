import { useLang } from "@/contexts/LanguageContext";
import { Star, Zap } from "lucide-react";

const PricingSection = () => {
  const { t } = useLang();

  const plans = [
    {
      name: t("landing.pricing_trial_name"),
      price: t("landing.pricing_trial_price"),
      period: t("landing.pricing_trial_period"),
      features: [
        t("landing.pricing_trial_feature_1"),
        t("landing.pricing_trial_feature_2"),
        t("landing.pricing_trial_feature_3"),
      ],
      cta: t("landing.pricing_trial_cta"),
      popular: false,
      badge: null,
    },
    {
      name: t("landing.pricing_monthly_name"),
      price: "$29",
      period: t("landing.pricing_monthly_period"),
      features: [
        t("landing.pricing_monthly_feature_1"),
        t("landing.pricing_monthly_feature_2"),
        t("landing.pricing_monthly_feature_3"),
      ],
      cta: t("landing.pricing_monthly_cta"),
      popular: true,
      badge: t("landing.pricing_monthly_badge"),
    },
    {
      name: t("landing.pricing_yearly_name"),
      price: "$299",
      period: t("landing.pricing_yearly_period"),
      features: [
        t("landing.pricing_yearly_feature_1"),
        t("landing.pricing_yearly_feature_2"),
        t("landing.pricing_yearly_feature_3"),
      ],
      cta: t("landing.pricing_yearly_cta"),
      popular: false,
      badge: t("landing.pricing_yearly_badge"),
    },
  ];

  return (
    <section className="py-24 px-6 relative bg-grain">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-center mb-4 text-amber-pale glow-amber-text">
          {t("landing.pricing_title")}
        </h2>
        <p className="text-center text-muted-foreground mb-12">
          {t("landing.pricing_subtitle")}
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
          {t("landing.pricing_disclaimer")}
        </p>
      </div>
    </section>
  );
};

export default PricingSection;
