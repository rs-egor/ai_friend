import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLang } from "@/contexts/LanguageContext";
import { friendsApi, chatApi } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, Trash2, ExternalLink } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Friend {
  id: number;
  name: string;
  personality: string | null;
  scenario: string | null;
  created_at: string;
}

export const AccountFriends = () => {
  const { t } = useLang();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const loadFriends = async () => {
    try {
      const data = await friendsApi.list();
      // Бэкенд возвращает массив напрямую
      setFriends(Array.isArray(data) ? data : (data.friends || []));
    } catch (e) {
      console.error("Failed to load friends:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFriends();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await friendsApi.delete(deleteId);
      setFriends((prev) => prev.filter((f) => f.id !== deleteId));
      toast({ title: t("friends.deleted") });
    } catch (err: any) {
      toast({
        title: t("friends.delete_error"),
        description: err.response?.data?.detail || err.message,
        variant: "destructive",
      });
    } finally {
      setDeleteId(null);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">{t("common.loading")}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("account.friends")}</h1>
        <Button onClick={() => navigate("/create-friend")}>
          {t("friends.create")}
        </Button>
      </div>

      {friends.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <p>{t("friends.no_friends")}</p>
            <Button className="mt-4" onClick={() => navigate("/create-friend")}>
              {t("friends.create_first")}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {friends.map((friend) => (
            <Card key={friend.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold">{friend.name}</h3>
                    {friend.personality && (
                      <Badge variant="secondary">{friend.personality}</Badge>
                    )}
                    {friend.scenario && (
                      <p className="text-xs text-muted-foreground">
                        {t(`scenarios.${friend.scenario}`)}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/chat/${friend.id}`)}
                      title={t("friends.open_chat")}
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(friend.id)}
                      title={t("friends.delete")}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  {t("friends.created_at")}: {new Date(friend.created_at).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("friends.delete_confirm_title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("friends.delete_confirm_description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              {t("friends.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
