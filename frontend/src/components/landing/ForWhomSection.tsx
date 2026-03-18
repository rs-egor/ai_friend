import { useLang } from "@/contexts/LanguageContext";
import { Moon, Heart, Users, Pen, Brain, Shield } from "lucide-react";

const ForWhomSection = () => {
  const { t } = useLang();

  const cards = [
    { icon: Moon, title: t("Интроверты", "Introverts"), desc: t("Кому сложно заводить друзей, но хочется глубокого общения", "Who struggle to make friends but crave deep conversations") },
    { icon: Heart, title: t("Скучающие по близким", "Missing loved ones"), desc: t("Кто потерял маму, друга, партнёра — и хочет услышать их голос снова", "Who lost a mom, friend, partner — and want to hear their voice again") },
    { icon: Users, title: t("Одинокие люди", "Lonely people"), desc: t("Кому нужен кто-то рядом — без осуждения и давления", "Who need someone by their side — without judgment or pressure") },
    { icon: Pen, title: t("Писатели и мечтатели", "Writers & dreamers"), desc: t("Кто хочет персонажа для диалога, вдохновения или проработки идей", "Who want a character for dialogue, inspiration, or brainstorming") },
    { icon: Brain, title: t("Те, кто думает вслух", "Those who think out loud"), desc: t("Кому нужен собеседник, который слушает и помнит каждую деталь", "Who need a conversation partner that listens and remembers every detail") },
    { icon: Shield, title: t("Те, кому нужна тишина", "Those who need quiet"), desc: t("Кто устал от шума соцсетей и хочет личного, безопасного пространства", "Who are tired of social media noise and want personal, safe space") },
  ];

  return (
    <section className="py-24 px-6 relative bg-grain">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-center mb-12 text-amber-pale glow-amber-text">
          {t("Кому это нужно", "Who this is for")}
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
