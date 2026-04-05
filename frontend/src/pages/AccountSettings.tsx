import { useLang } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export const AccountSettings = () => {
  const { t, lang, setLang } = useLang();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("account.settings")}</h1>

      {/* Language */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            {t("settings.language")}
          </CardTitle>
          <CardDescription>{t("settings.language_description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button
              variant={lang === "ru" ? "default" : "outline"}
              onClick={() => setLang("ru")}
            >
              Русский
            </Button>
            <Button
              variant={lang === "en" ? "default" : "outline"}
              onClick={() => setLang("en")}
            >
              English
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
