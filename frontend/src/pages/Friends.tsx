import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFriends } from "@/hooks/useChat";
import { useLang } from "@/contexts/LanguageContext";
import { UserMenu } from "@/components/UserMenu";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Users, MessageCircle, Trash2, Plus } from "lucide-react";

const Friends = () => {
  const navigate = useNavigate();
  const { t } = useLang();
  const { friends, isLoading, error, loadFriends, deleteFriend } = useFriends();

  useEffect(() => {
    loadFriends();
  }, [loadFriends]);

  const handleDelete = async (friendId: number, name: string) => {
    if (!confirm(t("friends.delete_confirm").replace("{name}", name))) return;

    const result = await deleteFriend(friendId);
    if (result.success) {
      toast.success(t("friends.delete_success").replace("{name}", name));
    } else {
      toast.error(t("friends.delete_error"));
    }
  };

  const handleChat = (friendId: number) => {
    navigate(`/chat/${friendId}`);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t("friends.page_title")}</h1>
            <p className="text-muted-foreground">
              {t("friends.page_description")}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <UserMenu />
            <Button onClick={() => navigate("/create-friend")}>
              <Plus className="mr-2 h-4 w-4" />
              {t("friends.create_button")}
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : error ? (
          <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
            {error}
          </div>
        ) : friends.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Users className="mb-4 h-16 w-16 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold">{t("friends.no_friends_title")}</h3>
            <p className="mb-4 text-muted-foreground">
              {t("friends.no_friends_description")}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {friends.map((friend) => (
              <Card key={friend.id}>
                <CardHeader>
                  <CardTitle>{friend.name}</CardTitle>
                  {friend.tone && (
                    <CardDescription>{friend.tone}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  {friend.personality && (
                    <p className="text-sm text-muted-foreground">
                      {friend.personality}
                    </p>
                  )}
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={() => handleChat(friend.id)}
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    {t("friends.chat_button")}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(friend.id, friend.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Friends;
