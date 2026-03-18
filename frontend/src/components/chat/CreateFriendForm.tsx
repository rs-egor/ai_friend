import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Sparkles } from "lucide-react";

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
  { id: "male", name: "Мужской" },
  { id: "female", name: "Женский" },
  { id: "neutral", name: "Не указан" },
];

const AGES = [
  { id: "teen", name: "Подросток (14-17)" },
  { id: "young", name: "Молодой (18-25)" },
  { id: "adult", name: "Взрослый (26-45)" },
  { id: "mature", name: "Зрелый (46+)" },
];

const INTERESTS = [
  { id: "tech", name: "Технологии" },
  { id: "science", name: "Наука" },
  { id: "art", name: "Искусство" },
  { id: "literature", name: "Литература" },
  { id: "travel", name: "Путешествия" },
  { id: "psychology", name: "Психология" },
  { id: "career", name: "Карьера" },
  { id: "health", name: "Здоровье" },
  { id: "games", name: "Игры" },
  { id: "music", name: "Музыка" },
];

const SCENARIOS = [
  { id: "casual", name: "Повседневный" },
  { id: "professional", name: "Деловой" },
  { id: "emotional", name: "Душевный" },
  { id: "education", name: "Обучение" },
  { id: "mentorship", name: "Наставничество" },
  { id: "creative", name: "Творчество" },
];

interface CreateFriendFormProps {
  onCreate: (
    name: string,
    personality?: string,
    tone?: string,
    gender?: string,
    age?: string,
    interests?: string[],
    scenario?: string
  ) => Promise<void>;
}

export const CreateFriendForm = ({ onCreate }: CreateFriendFormProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [personality, setPersonality] = useState("");
  const [tone, setTone] = useState("");
  const [gender, setGender] = useState<string>("neutral");
  const [age, setAge] = useState<string>("adult");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [scenario, setScenario] = useState<string>("casual");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    await onCreate(
      name.trim(),
      personality.trim() || undefined,
      tone.trim() || undefined,
      gender,
      age,
      selectedInterests,
      scenario
    );
    setIsLoading(false);

    // Очистка и закрытие
    setName("");
    setPersonality("");
    setTone("");
    setGender("neutral");
    setAge("adult");
    setSelectedInterests([]);
    setScenario("casual");
    setOpen(false);
  };

  const handlePresetClick = (preset: typeof PERSONALITY_PRESETS[0]) => {
    setPersonality(preset.description);
  };

  const toggleInterest = (interestId: string) => {
    setSelectedInterests(prev => {
      // Если уже выбран, убираем его
      if (prev.includes(interestId)) {
        return prev.filter(id => id !== interestId);
      }
      // Если уже выбрано 3, не добавляем больше
      if (prev.length >= 3) {
        return prev;
      }
      // Добавляем новый интерес
      return [...prev, interestId];
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Создать друга
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Новый AI-друг</DialogTitle>
            <DialogDescription>
              Создайте нового виртуального друга с уникальным характером
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Пресеты личностей */}
            <div className="grid gap-3">
              <label className="text-sm font-medium">Быстрый выбор личности</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PERSONALITY_PRESETS.map((preset) => (
                  <Button
                    key={preset.id}
                    type="button"
                    variant="outline"
                    className="h-auto flex flex-col items-start gap-1 p-3"
                    onClick={() => handlePresetClick(preset)}
                  >
                    <Sparkles className="h-3 w-3 text-amber-500" />
                    <span className="font-medium text-sm">{preset.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Имя *
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Например: Алиса"
                required
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="personality" className="text-sm font-medium">
                Характер
              </label>
              <Textarea
                id="personality"
                value={personality}
                onChange={(e) => setPersonality(e.target.value)}
                placeholder="Например: Дружелюбный, поддерживающий, любит шутить"
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="tone" className="text-sm font-medium">
                Стиль общения
              </label>
              <Input
                id="tone"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                placeholder="Например: Тёплый и заботливый"
              />
            </div>

            {/* Пол */}
            <div className="grid gap-2">
              <label className="text-sm font-medium">Пол</label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите пол" />
                </SelectTrigger>
                <SelectContent>
                  {GENDERS.map((g) => (
                    <SelectItem key={g.id} value={g.id}>
                      {g.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Возраст */}
            <div className="grid gap-2">
              <label className="text-sm font-medium">Возраст</label>
              <Select value={age} onValueChange={setAge}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите возраст" />
                </SelectTrigger>
                <SelectContent>
                  {AGES.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Интересы */}
            <div className="grid gap-2">
              <label className="text-sm font-medium">Интересы (до 3)</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {INTERESTS.map((interest) => (
                  <div
                    key={interest.id}
                    className="flex items-center space-x-2 border rounded-md p-2 cursor-pointer hover:bg-accent transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleInterest(interest.id);
                    }}
                  >
                    <Checkbox
                      id={interest.id}
                      checked={selectedInterests.includes(interest.id)}
                      onCheckedChange={() => toggleInterest(interest.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <label
                      htmlFor={interest.id}
                      className="text-sm font-medium leading-none cursor-pointer flex-1 select-none"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {interest.name}
                    </label>
                  </div>
                ))}
              </div>
              {selectedInterests.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  Выбрано: {selectedInterests.map(id => INTERESTS.find(i => i.id === id)?.name).join(", ")}
                </p>
              )}
            </div>

            {/* Сценарий общения */}
            <div className="grid gap-2">
              <label className="text-sm font-medium">Сценарий общения</label>
              <Select value={scenario} onValueChange={setScenario}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите сценарий" />
                </SelectTrigger>
                <SelectContent>
                  {SCENARIOS.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Отмена
            </Button>
            <Button type="submit" disabled={isLoading || !name.trim()}>
              {isLoading ? "Создание..." : "Создать"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
