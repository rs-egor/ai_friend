import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useChat } from "@/hooks/useChat";
import { useFriends } from "@/hooks/useChat";
import { UserMenu } from "@/components/UserMenu";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { MessageInput } from "@/components/chat/MessageInput";
import { MemoryPanel } from "@/components/chat/MemoryPanel";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Users, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

const Chat = () => {
  const { friendId } = useParams<{ friendId: string }>();
  const navigate = useNavigate();
  const { friends, loadFriends } = useFriends();
  const [selectedFriendId, setSelectedFriendId] = useState<number | null>(
    friendId ? parseInt(friendId) : null
  );
  const [showMemoryPanel, setShowMemoryPanel] = useState(false);

  const { messages, memories, isLoading, error, sendMessage, loadHistory, clearMessages, loadMemories } =
    useChat(selectedFriendId);

  // Загрузка друзей и истории при монтировании
  useEffect(() => {
    loadFriends();
  }, [loadFriends]);

  useEffect(() => {
    if (selectedFriendId) {
      clearMessages();
      loadHistory();
      loadMemories();
    }
  }, [selectedFriendId, loadHistory, clearMessages, loadMemories]);

  const selectedFriend = friends.find((f) => f.id === selectedFriendId);

  const handleSend = async (message: string) => {
    await sendMessage(message);
  };

  return (
    <div className="flex h-screen">
      {/* Боковая панель со списком друзей */}
      <div className="w-80 border-r bg-muted/30">
        <div className="flex items-center gap-2 border-b p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/friends")}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold">Чаты</h2>
        </div>
        <ScrollArea className="h-[calc(100vh-65px)]">
          <div className="p-2">
            {friends.map((friend) => (
              <button
                key={friend.id}
                onClick={() => setSelectedFriendId(friend.id)}
                className={cn(
                  "w-full rounded-lg p-3 text-left transition-colors",
                  selectedFriendId === friend.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
              >
                <p className="font-medium">{friend.name}</p>
                {friend.tone && (
                  <p
                    className={cn(
                      "text-xs",
                      selectedFriendId === friend.id
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    )}
                  >
                    {friend.tone}
                  </p>
                )}
              </button>
            ))}
            {friends.length === 0 && (
              <div className="p-4 text-center text-sm text-muted-foreground">
                <Users className="mx-auto mb-2 h-8 w-8 opacity-50" />
                <p>Нет друзей</p>
                <Button
                  variant="link"
                  className="mt-2"
                  onClick={() => navigate("/friends")}
                >
                  Создать друга
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Окно чата */}
      <div className="flex flex-1 flex-col">
        {selectedFriend ? (
          <>
            {/* Заголовок */}
            <div className="flex items-center justify-between border-b p-4">
              <div>
                <h3 className="text-lg font-semibold">{selectedFriend.name}</h3>
                {selectedFriend.personality && (
                  <p className="text-sm text-muted-foreground">
                    {selectedFriend.personality}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMemoryPanel(!showMemoryPanel)}
                  className={cn(
                    showMemoryPanel && "bg-primary text-primary-foreground"
                  )}
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Память
                </Button>
                <UserMenu />
              </div>
            </div>

            {/* Сообщения */}
            <ChatWindow messages={messages} isLoading={isLoading} />

            {/* Ввод сообщения */}
            <MessageInput onSend={handleSend} isLoading={isLoading} />
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Users className="mx-auto mb-4 h-16 w-16 opacity-20" />
              <p className="text-lg">Выберите друга для начала чата</p>
            </div>
          </div>
        )}
      </div>

      {/* Панель памяти */}
      <MemoryPanel
        memories={memories}
        isOpen={showMemoryPanel}
        onClose={() => setShowMemoryPanel(false)}
      />
    </div>
  );
};

export default Chat;
