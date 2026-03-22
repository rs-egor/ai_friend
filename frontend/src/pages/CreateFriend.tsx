import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLang } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft, Sparkles, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const CreateFriend = () => {
  const navigate = useNavigate();
  const { t } = useLang();
  const [name, setName] = useState("");
  const [personality, setPersonality] = useState("");
  const [tone, setTone] = useState("");
  const [gender, setGender] = useState<string>("neutral");
  const [age, setAge] = useState<string>("adult");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [scenario, setScenario] = useState<string>("casual");
  const [isLoading, setIsLoading] = useState(false);

  const PERSONALITY_PRESETS = [
    { id: "friend", name: t("personality_presets.friend"), description: t("personality_presets.friend_desc") },
    { id: "assistant", name: t("personality_presets.assistant"), description: t("personality_presets.assistant_desc") },
    { id: "mentor", name: t("personality_presets.mentor"), description: t("personality_presets.mentor_desc") },
    { id: "companion", name: t("personality_presets.companion"), description: t("personality_presets.companion_desc") },
    { id: "tutor", name: t("personality_presets.tutor"), description: t("personality_presets.tutor_desc") },
    { id: "creative", name: t("personality_presets.creative"), description: t("personality_presets.creative_desc") },
  ];

  const GENDERS = [
    { id: "male", name: t("create_friend.gender_male"), icon: "👨" },
    { id: "female", name: t("create_friend.gender_female"), icon: "👩" },
    { id: "neutral", name: t("create_friend.gender_neutral"), icon: "👤" },
  ];

  const AGES = [
    { id: "teen", name: t("create_friend.age_teen"), description: t("create_friend.age_teen_desc"), icon: "🧒" },
    { id: "young", name: t("create_friend.age_young"), description: t("create_friend.age_young_desc"), icon: "🧑" },
    { id: "adult", name: t("create_friend.age_adult"), description: t("create_friend.age_adult_desc"), icon: "👨‍💼" },
    { id: "mature", name: t("create_friend.age_mature"), description: t("create_friend.age_mature_desc"), icon: "🧓" },
  ];

  const INTERESTS = [
    { id: "tech", name: t("create_friend.interest_tech"), icon: "💻" },
    { id: "science", name: t("create_friend.interest_science"), icon: "🔬" },
    { id: "art", name: t("create_friend.interest_art"), icon: "🎨" },
    { id: "literature", name: t("create_friend.interest_literature"), icon: "📚" },
    { id: "travel", name: t("create_friend.interest_travel"), icon: "✈️" },
    { id: "psychology", name: t("create_friend.interest_psychology"), icon: "🧠" },
    { id: "career", name: t("create_friend.interest_career"), icon: "💼" },
    { id: "health", name: t("create_friend.interest_health"), icon: "💪" },
    { id: "games", name: t("create_friend.interest_games"), icon: "🎮" },
    { id: "music", name: t("create_friend.interest_music"), icon: "🎵" },
  ];

  const SCENARIOS = [
    { id: "casual", name: t("create_friend.scenario_casual"), description: t("create_friend.scenario_casual_desc") },
    { id: "professional", name: t("create_friend.scenario_professional"), description: t("create_friend.scenario_professional_desc") },
    { id: "emotional", name: t("create_friend.scenario_emotional"), description: t("create_friend.scenario_emotional_desc") },
    { id: "education", name: t("create_friend.scenario_education"), description: t("create_friend.scenario_education_desc") },
    { id: "mentorship", name: t("create_friend.scenario_mentorship"), description: t("create_friend.scenario_mentorship_desc") },
    { id: "creative", name: t("create_friend.scenario_creative"), description: t("create_friend.scenario_creative_desc") },
  ];

  const toggleInterest = (interestId: string) => {
    setSelectedInterests(prev => {
      if (prev.includes(interestId)) {
        return prev.filter(id => id !== interestId);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, interestId];
    });
  };

  const handlePresetClick = (preset: typeof PERSONALITY_PRESETS[0]) => {
    setPersonality(preset.description);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error(t("create_friend.name_label"));
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/friends/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          personality: personality.trim() || undefined,
          tone: tone.trim() || undefined,
          gender,
          age,
          interests: selectedInterests.length > 0 ? selectedInterests : undefined,
          scenario,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || t("create_friend.error"));
      }

      toast.success(t("create_friend.success").replace("{name}", name));
      navigate("/friends");
    } catch (err) {
      const message = err instanceof Error ? err.message : t("create_friend.error");
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Заголовок */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/friends")}
              className="h-10 w-10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">{t("create_friend.page_title")}</h1>
              <p className="text-sm text-muted-foreground">
                {t("create_friend.page_description")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Форма */}
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Имя - всегда первое */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-lg font-semibold">
              {t("create_friend.name_label")}
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("create_friend.name_placeholder")}
              className="text-lg h-12"
              required
              autoFocus
            />
          </div>

          {/* Быстрый выбор личности */}
          <div className="space-y-3">
            <label className="text-lg font-semibold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              {t("create_friend.preset_title")}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {PERSONALITY_PRESETS.map((preset) => (
                <Button
                  key={preset.id}
                  type="button"
                  variant="outline"
                  className={cn(
                    "h-auto min-h-[100px] flex flex-col items-start justify-start gap-2 p-4 transition-all text-left",
                    "hover:bg-primary/5 hover:border-primary",
                    personality.includes(preset.description) && "border-primary bg-primary/5"
                  )}
                  onClick={() => handlePresetClick(preset)}
                >
                  <div className="flex items-center gap-2 w-full shrink-0">
                    <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
                    <span className="font-semibold text-base">{preset.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground text-left leading-snug w-full break-words whitespace-normal">
                    {preset.description}
                  </span>
                </Button>
              ))}
            </div>
          </div>

          {/* Характер */}
          <div className="space-y-2">
            <label htmlFor="personality" className="text-lg font-semibold">
              {t("create_friend.personality_label")}
            </label>
            <Textarea
              id="personality"
              value={personality}
              onChange={(e) => setPersonality(e.target.value)}
              placeholder={t("create_friend.personality_placeholder")}
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Стиль общения - кнопки */}
          <div className="space-y-3">
            <label className="text-lg font-semibold">
              {t("create_friend.tone_label")}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { id: "warm", name: t("create_friend.tone_warm"), desc: t("create_friend.tone_warm_desc") },
                { id: "friendly", name: t("create_friend.tone_friendly"), desc: t("create_friend.tone_friendly_desc") },
                { id: "professional", name: t("create_friend.tone_professional"), desc: t("create_friend.tone_professional_desc") },
                { id: "humorous", name: t("create_friend.tone_humorous"), desc: t("create_friend.tone_humorous_desc") },
              ].map((toneOption) => (
                <Button
                  key={toneOption.id}
                  type="button"
                  variant="outline"
                  className={cn(
                    "h-auto flex flex-col items-center gap-1 p-3 transition-all",
                    tone === toneOption.id && "border-primary bg-primary/5"
                  )}
                  onClick={() => setTone(tone === toneOption.id ? "" : toneOption.id)}
                >
                  {tone === toneOption.id && <Check className="h-4 w-4 text-primary" />}
                  <span className="font-medium">{toneOption.name}</span>
                  <span className="text-xs text-muted-foreground">{toneOption.desc}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Пол - кнопки */}
          <div className="space-y-3">
            <label className="text-lg font-semibold">{t("create_friend.gender_label")}</label>
            <div className="grid grid-cols-3 gap-3">
              {GENDERS.map((g) => (
                <Button
                  key={g.id}
                  type="button"
                  variant="outline"
                  className={cn(
                    "h-20 flex flex-col items-center gap-2 transition-all",
                    gender === g.id && "border-primary bg-primary/5"
                  )}
                  onClick={() => setGender(g.id)}
                >
                  <span className="text-2xl">{g.icon}</span>
                  <span className="font-medium text-sm">{g.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Возраст - кнопки */}
          <div className="space-y-3">
            <label className="text-lg font-semibold">{t("create_friend.age_label")}</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {AGES.map((a) => (
                <Button
                  key={a.id}
                  type="button"
                  variant="outline"
                  className={cn(
                    "h-auto flex flex-col items-center gap-1 p-3 transition-all",
                    age === a.id && "border-primary bg-primary/5"
                  )}
                  onClick={() => setAge(a.id)}
                >
                  <span className="text-2xl">{a.icon}</span>
                  <span className="font-medium">{a.name}</span>
                  <span className="text-xs text-muted-foreground">{a.description}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Интересы - кнопки */}
          <div className="space-y-3">
            <label className="text-lg font-semibold">
              {t("create_friend.interests_label")} <span className="text-muted-foreground font-normal">({t("create_friend.interests_max")})</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {INTERESTS.map((interest) => (
                <Button
                  key={interest.id}
                  type="button"
                  variant="outline"
                  className={cn(
                    "h-auto flex flex-col items-center gap-2 p-3 transition-all",
                    selectedInterests.includes(interest.id) && "border-primary bg-primary/5"
                  )}
                  onClick={() => toggleInterest(interest.id)}
                  disabled={!selectedInterests.includes(interest.id) && selectedInterests.length >= 3}
                >
                  <span className="text-2xl">{interest.icon}</span>
                  <span className="font-medium text-sm">{interest.name}</span>
                  {selectedInterests.includes(interest.id) && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </Button>
              ))}
            </div>
            {selectedInterests.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedInterests.map(id => {
                  const interest = INTERESTS.find(i => i.id === id);
                  return (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                    >
                      {interest?.icon} {interest?.name}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Сценарий общения - кнопки */}
          <div className="space-y-3">
            <label className="text-lg font-semibold">{t("create_friend.scenario_label")}</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {SCENARIOS.map((s) => (
                <Button
                  key={s.id}
                  type="button"
                  variant="outline"
                  className={cn(
                    "h-auto flex flex-col items-start gap-1 p-3 transition-all",
                    scenario === s.id && "border-primary bg-primary/5"
                  )}
                  onClick={() => setScenario(s.id)}
                >
                  <span className="font-medium">{s.name}</span>
                  <span className="text-xs text-muted-foreground text-left">{s.description}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Кнопки действий */}
          <div className="flex justify-end gap-4 pt-8 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/friends")}
              className="min-w-[120px]"
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !name.trim()}
              className="min-w-[120px]"
            >
              {isLoading ? t("create_friend.submitting") : t("create_friend.submit_button")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFriend;
