import { useEffect, useState } from "react";
import { useLang } from "@/contexts/LanguageContext";
import { subscriptionApi } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

export const AccountSubscription = () => {
  const { t } = useLang();
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await subscriptionApi.get();
        setSubscription(data);
      } catch (e) {
        console.error("Failed to load subscription:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSubscribe = async (planType: "monthly" | "yearly") => {
    try {
      const { checkout_url } = await subscriptionApi.createCheckout(planType);
      window.location.href = checkout_url;
    } catch (err: any) {
      toast({
        title: t("subscription.error"),
        description: err.response?.data?.detail || err.message,
        variant: "destructive",
      });
    }
  };

  const handleManage = async () => {
    try {
      const { portal_url } = await subscriptionApi.getPortal();
      window.location.href = portal_url;
    } catch (err: any) {
      toast({
        title: t("subscription.error"),
        description: err.response?.data?.detail || err.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">{t("common.loading")}</div>;
  }

  const isPremium = subscription?.is_premium;
  const planType = subscription?.plan_type || "free";
  const expiresAt = subscription?.expires_at;
  const messagesCount = subscription?.messages_count ?? 0;
  const messagesLimit = subscription?.messages_limit ?? 5;
  const remaining = subscription?.remaining_messages ?? 0;
  const usagePercent = Math.min((messagesCount / messagesLimit) * 100, 100);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("account.subscription")}</h1>

      {/* Status */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t("subscription.status")}</CardTitle>
            <CardDescription>
              {isPremium
                ? t(`subscription.${planType}`)
                : t("subscription.free_description")}
            </CardDescription>
          </div>
          <Badge variant={isPremium ? "default" : "secondary"}>
            {isPremium ? t(`subscription.${planType}`) : t("subscription.free")}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          {isPremium ? (
            <>
              <p className="text-sm text-muted-foreground">
                {t("account.expires_at")}: {expiresAt ? new Date(expiresAt).toLocaleDateString() : "—"}
              </p>
              <Button onClick={handleManage}>
                {t("account.manage_subscription")}
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{t("account.messages_used")}: {messagesCount} / {messagesLimit}</span>
                  <span>{remaining} {t("account.remaining")}</span>
                </div>
                <Progress value={usagePercent} />
              </div>
              <div className="flex gap-3">
                <Button onClick={() => handleSubscribe("monthly")}>
                  {t("subscription.subscribe_monthly")}
                </Button>
                <Button variant="outline" onClick={() => handleSubscribe("yearly")}>
                  {t("subscription.subscribe_yearly")}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
