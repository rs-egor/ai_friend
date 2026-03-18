import { useLang } from "@/contexts/LanguageContext";

const LanguageSwitcher = () => {
  const { lang, setLang } = useLang();

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-1 rounded-full border border-primary/30 bg-secondary/80 backdrop-blur-md p-1">
      <button
        onClick={() => setLang("ru")}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
          lang === "ru"
            ? "bg-primary text-primary-foreground glow-amber-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        RU
      </button>
      <button
        onClick={() => setLang("en")}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
          lang === "en"
            ? "bg-primary text-primary-foreground glow-amber-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;
