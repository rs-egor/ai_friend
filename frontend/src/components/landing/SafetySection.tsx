import { useLang } from "@/contexts/LanguageContext";
import { Lock, Eye, Trash2, Server, ShieldCheck, UserX } from "lucide-react";

const SafetySection = () => {
  const { t } = useLang();

  const items = [
    { icon: Lock, text: t("Все данные зашифрованы (AES-256)", "All data encrypted (AES-256)") },
    { icon: Eye, text: t("Никто не читает ваши разговоры — даже мы", "Nobody reads your conversations — not even us") },
    { icon: Trash2, text: t("Удалите всё в любой момент — навсегда", "Delete everything at any time — permanently") },
    { icon: Server, text: t("Серверы в ЕС — полное соответствие GDPR", "EU servers — full GDPR compliance") },
    { icon: ShieldCheck, text: t("Без рекламы, без продажи данных", "No ads, no data selling") },
    { icon: UserX, text: t("Анонимная регистрация — без паспорта и соцсетей", "Anonymous registration — no ID or social media") },
  ];

  return (
    <section className="py-24 px-6 relative bg-grain">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-center mb-12 text-amber-pale glow-amber-text">
          {t("Безопасность и приватность", "Safety & Privacy")}
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
