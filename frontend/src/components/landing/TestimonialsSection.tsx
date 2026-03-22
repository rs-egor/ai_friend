import { useLang } from "@/contexts/LanguageContext";

const TestimonialsSection = () => {
  const { t } = useLang();

  const testimonials = [
    { name: t("landing.testimonial_1_name"), text: t("landing.testimonial_1_text") },
    { name: t("landing.testimonial_2_name"), text: t("landing.testimonial_2_text") },
    { name: t("landing.testimonial_3_name"), text: t("landing.testimonial_3_text") },
    { name: t("landing.testimonial_4_name"), text: t("landing.testimonial_4_text") },
    { name: t("landing.testimonial_5_name"), text: t("landing.testimonial_5_text") },
    { name: t("landing.testimonial_6_name"), text: t("landing.testimonial_6_text") },
  ];

  return (
    <section className="py-24 px-6 relative bg-grain">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-center mb-12 text-amber-pale glow-amber-text">
          {t("landing.testimonials_title")}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <div
              key={i}
              className="p-5 rounded-xl card-mystical hover:card-mystical-hover transition-all"
              style={{ animationDelay: `${i * 0.5}s` }}
            >
              <p className="text-sm text-foreground/80 italic mb-4">"{testimonial.text}"</p>
              <p className="text-xs text-primary font-semibold">{testimonial.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
