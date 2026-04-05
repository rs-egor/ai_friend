import { useLang } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export const LanguageSwitcher = () => {
  const { lang, setLang } = useLang();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setLang(lang === "ru" ? "en" : "ru")}
      title={lang === "ru" ? "Switch to English" : "Переключить на русский"}
      className="relative"
    >
      <Globe className="h-5 w-5" />
      <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-primary-foreground">
        {lang === "ru" ? "RU" : "EN"}
      </span>
    </Button>
  );
};
