import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLang } from "@/contexts/LanguageContext";
import { authApi, subscriptionApi } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, MessageSquare, CreditCard, Plus, MessageCircle } from "lucide-react";

interface Stats {
  total_friends: number;
  total_messages: number;
  subscription_plan: string;
  messages_remaining: number;
}

interface Subscription {
  is_premium: boolean;
  plan_type: string;
  messages_count: number;
  messages_limit: number;
  remaining_messages: number;
  expires_at: string | null;
}

export const AccountOverview = () => {
  const { t } = useLang();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, subData] = await Promise.all([
          authApi.getStats(),
          subscriptionApi.get(),
        ]);
        setStats(statsData);
        setSubscription(subData);
      } catch (e) {
        console.error("Failed to load account data:", e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64">{t("common.loading")}</div>;
  }

  const planLabels: Record<string, string> = {
    free: t("subscription.free"),
    monthly: t("subscription.monthly"),
    yearly: t("subscription.yearly"),
    premium: t("subscription.premium"),
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("account.overview")}</h1>

      {/* Subscription card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            {t("account.subscription")}
          </CardTitle>
          <Badge variant={subscription?.is_premium ? "default" : "secondary"}>
            {planLabels[subscription?.plan_type || "free"] || "free"}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          {!subscription?.is_premium ? (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {t("account.messages_remaining")}: {subscription?.remaining_messages ?? 0} / {subscription?.messages_limit ?? 5}
              </p>
              <Button onClick={() => navigate("/account/subscription")}>
                {t("account.subscribe")}
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {t("account.expires_at")}: {subscription?.expires_at
                  ? new Date(subscription.expires_at).toLocaleDateString()
                  : "—"}
              </p>
              <Button variant="outline" onClick={() => navigate("/account/subscription")}>
                {t("account.manage_subscription")}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick actions */}
      <Card>
        <CardHeader>
          <CardTitle>{t("account.quick_actions")}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button onClick={() => navigate("/create-friend")}>
            <Plus className="mr-2 h-4 w-4" />
            {t("account.create_friend")}
          </Button>
          <Button variant="outline" onClick={() => navigate("/chat")}>
            <MessageCircle className="mr-2 h-4 w-4" />
            {t("account.open_chat")}
          </Button>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("account.total_friends")}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_friends ?? 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("account.total_messages")}
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_messages ?? 0}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
