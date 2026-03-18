import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft, Sparkles, Check } from "lucide-react";
import { cn } from "@/lib/utils";

// Данные из personality.py
const PERSONALITY_PRESETS = [
  { id: "friend", name: "Друг", description: "Дружелюбный собеседник для повседневного общения" },
  { id: "assistant", name: "Помощник", description: "Профессиональный помощник для решения задач" },
  { id: "mentor", name: "Наставник", description: "Опытный советчик для карьеры и развития" },
  { id: "companion", name: "Спутник", description: "Тёплый собеседник для душевных разговоров" },
  { id: "tutor", name: "Репетитор", description: "Терпеливый учитель для изучения нового" },
  { id: "creative", name: "Творец", description: "Креативная личность для генерации идей" },
];

const GENDERS = [
  { id: "male", name: "Мужской", icon: "👨" },
  { id: "female", name: "Женский", icon: "👩" },
  { id: "neutral", name: "Не указан", icon: "👤" },
];

const AGES = [
  { id: "teen", name: "Подросток", description: "14-17 лет", icon: "🧒" },
  { id: "young", name: "Молодой", description: "18-25 лет", icon: "🧑" },
  { id: "adult", name: "Взрослый", description: "26-45 лет", icon: "👨‍💼" },
  { id: "mature", name: "Зрелый", description: "46+ лет", icon: "🧓" },
];

const INTERESTS = [
  { id: "tech", name: "Технологии", icon: "💻" },
  { id: "science", name: "Наука", icon: "🔬" },
  { id: "art", name: "Искусство", icon: "🎨" },
  { id: "literature", name: "Литература", icon: "📚" },
  { id: "travel", name: "Путешествия", icon: "✈️" },
  { id: "psychology", name: "Психология", icon: "🧠" },
  { id: "career", name: "Карьера", icon: "💼" },
  { id: "health", name: "Здоровье", icon: "💪" },
  { id: "games", name: "Игры", icon: "🎮" },
  { id: "music", name: "Музыка", icon: "🎵" },
];

const SCENARIOS = [
  { id: "casual", name: "Повседневный", description: "Дружелюбное общение" },
  { id: "professional", name: "Деловой", description: "Решение задач" },
  { id: "emotional", name: "Душевный", description: "Поддержка и забота" },
  { id: "education", name: "Обучение", description: "Изучение нового" },
  { id: "mentorship", name: "Наставничество", description: "Глубокие советы" },
  { id: "creative", name: "Творчество", description: "Генерация идей" },
];

const CreateFriend = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [personality, setPersonality] = useState("");
  const [tone, setTone] = useState("");
  const [gender, setGender] = useState<string>("neutral");
  const [age, setAge] = useState<string>("adult");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [scenario, setScenario] = useState<string>("casual");
  const [isLoading, setIsLoading] = useState(false);

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
      toast.error("Введите имя друга");
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
        throw new Error(error.detail || "Не удалось создать друга");
      }

      toast.success(`Друг "${name}" создан!`);
      navigate("/friends");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Не удалось создать друга";
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
              <h1 className="text-xl font-semibold">Создание AI-друга</h1>
              <p className="text-sm text-muted-foreground">
                Настройте характер и предпочтения вашего друга
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
              Имя друга *
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например: Алиса, Макс, София..."
              className="text-lg h-12"
              required
              autoFocus
            />
          </div>

          {/* Быстрый выбор личности */}
          <div className="space-y-3">
            <label className="text-lg font-semibold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              Быстрый выбор личности
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
              Характер
            </label>
            <Textarea
              id="personality"
              value={personality}
              onChange={(e) => setPersonality(e.target.value)}
              placeholder="Опишите характер друга своими словами..."
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Стиль общения - кнопки */}
          <div className="space-y-3">
            <label className="text-lg font-semibold">
              Стиль общения
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { id: "warm", name: "Тёплый", desc: "Заботливый" },
                { id: "friendly", name: "Дружелюбный", desc: "Открытый" },
                { id: "professional", name: "Деловой", desc: "Строгий" },
                { id: "humorous", name: "Весёлый", desc: "С юмором" },
              ].map((t) => (
                <Button
                  key={t.id}
                  type="button"
                  variant="outline"
                  className={cn(
                    "h-auto flex flex-col items-center gap-1 p-3 transition-all",
                    tone === t.id && "border-primary bg-primary/5"
                  )}
                  onClick={() => setTone(tone === t.id ? "" : t.id)}
                >
                  {tone === t.id && <Check className="h-4 w-4 text-primary" />}
                  <span className="font-medium">{t.name}</span>
                  <span className="text-xs text-muted-foreground">{t.desc}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Пол - кнопки */}
          <div className="space-y-3">
            <label className="text-lg font-semibold">Пол</label>
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
            <label className="text-lg font-semibold">Возраст</label>
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
              Интересы <span className="text-muted-foreground font-normal">(максимум 3)</span>
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
            <label className="text-lg font-semibold">Сценарий общения</label>
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
              Отмена
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !name.trim()}
              className="min-w-[120px]"
            >
              {isLoading ? "Создание..." : "Создать друга"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFriend;
