import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle } from "lucide-react";

const SubscriptionCancel = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
            <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-2xl">{t("subscription.cancel.title")}</CardTitle>
          <CardDescription>{t("subscription.cancel.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            {t("subscription.cancel.help")}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="w-full" onClick={() => navigate("/")}>
              {t("subscription.cancel.go_home")}
            </Button>
            <Button className="w-full" onClick={() => navigate("/chat")}>
              {t("subscription.cancel.try_again")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionCancel;
