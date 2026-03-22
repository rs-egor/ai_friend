import { useLang } from "@/contexts/LanguageContext";
import { User, Smile, MessageCircle } from "lucide-react";

const CreateFriendSection = () => {
  const { t } = useLang();

  return (
    <section className="py-24 px-6 relative bg-grain">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-center mb-4 text-amber-pale glow-amber-text">
          {t("landing.create_friend_section_title")}
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
          {t("landing.create_friend_section_description")}
        </p>

        {/* Creator mockup */}
        <div className="max-w-sm mx-auto card-mystical rounded-2xl p-6 glow-amber-sm">
          <h3 className="font-display text-lg font-semibold text-center text-foreground mb-6">
            {t("landing.create_friend_mockup_title")}
          </h3>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">{t("landing.create_friend_mockup_name")}</label>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/60 border border-primary/10">
                <User className="w-4 h-4 text-primary" />
                <span className="text-foreground text-sm">{t("landing.create_friend_mockup_name_value")}</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">{t("landing.create_friend_mockup_personality")}</label>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/60 border border-primary/10">
                <Smile className="w-4 h-4 text-primary" />
                <span className="text-foreground text-sm">{t("landing.create_friend_mockup_personality_value")}</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">{t("landing.create_friend_mockup_tone")}</label>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/60 border border-primary/10">
                <MessageCircle className="w-4 h-4 text-primary" />
                <span className="text-foreground text-sm">{t("landing.create_friend_mockup_tone_value")}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-10">
          <button className="px-8 py-4 rounded-lg bg-primary text-primary-foreground font-semibold text-lg glow-amber hover:brightness-110 transition-all">
            {t("landing.create_friend_button")}
          </button>
        </div>
      </div>
    </section>
  );
};

export default CreateFriendSection;
