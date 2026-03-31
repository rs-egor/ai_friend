import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLang } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const SubscriptionSuccess = () => {
  const navigate = useNavigate();
  const { t } = useLang();
  const [sessionId, setSessionId] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const session_id = params.get("session_id");
    if (session_id) {
      setSessionId(session_id);
      // Можно отправить запрос на бэкенд для подтверждения
      // fetch(`/api/subscription/verify?session_id=${session_id}`)
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl">{t("subscription.success.title")}</CardTitle>
          <CardDescription>{t("subscription.success.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            {sessionId && (
              <p>Session ID: {sessionId.slice(0, 20)}...</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button className="w-full" onClick={() => navigate("/chat")}>
              {t("subscription.success.go_to_chat")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionSuccess;
