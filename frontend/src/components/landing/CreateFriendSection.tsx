import { useLang } from "@/contexts/LanguageContext";
import { User, Smile, MessageCircle } from "lucide-react";

const CreateFriendSection = () => {
  const { t } = useLang();

  return (
    <section className="py-24 px-6 relative bg-grain">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-center mb-4 text-amber-pale glow-amber-text">
          {t("Найди / встреть друга", "Find / meet your friend")}
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
          {t(
            "Выбери имя, пол, характер, стиль общения — и твой AI-друг готов. Он будет таким, каким ты захочешь.",
            "Choose a name, gender, personality, communication style — and your AI friend is ready. They'll be exactly who you want."
          )}
        </p>

        {/* Creator mockup */}
        <div className="max-w-sm mx-auto card-mystical rounded-2xl p-6 glow-amber-sm">
          <h3 className="font-display text-lg font-semibold text-center text-foreground mb-6">
            {t("Создай друга", "Create a friend")}
          </h3>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">{t("Имя", "Name")}</label>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/60 border border-primary/10">
                <User className="w-4 h-4 text-primary" />
                <span className="text-foreground text-sm">{t("Алекс", "Alex")}</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">{t("Характер", "Personality")}</label>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/60 border border-primary/10">
                <Smile className="w-4 h-4 text-primary" />
                <span className="text-foreground text-sm">{t("Тёплый, с юмором, честный", "Warm, witty, honest")}</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">{t("Стиль общения", "Tone")}</label>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/60 border border-primary/10">
                <MessageCircle className="w-4 h-4 text-primary" />
                <span className="text-foreground text-sm">{t("Дружеский, но глубокий", "Friendly but deep")}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-10">
          <button className="px-8 py-4 rounded-lg bg-primary text-primary-foreground font-semibold text-lg glow-amber hover:brightness-110 transition-all">
            {t("Создать своего AI-друга прямо сейчас", "Create your AI friend right now")}
          </button>
        </div>
      </div>
    </section>
  );
};

export default CreateFriendSection;
