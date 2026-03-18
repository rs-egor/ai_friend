import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Memory } from "@/types";
import { Brain, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface MemoryPanelProps {
  memories: Memory[];
  isOpen: boolean;
  onClose: () => void;
}

export const MemoryPanel = ({ memories, isOpen, onClose }: MemoryPanelProps) => {
  if (!isOpen) return null;

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      fact: "Факт",
      preference: "Предпочтение",
      event: "Событие",
      relationship: "Отношения",
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      fact: "bg-blue-500",
      preference: "bg-green-500",
      event: "bg-purple-500",
      relationship: "bg-pink-500",
    };
    return colors[type] || "bg-gray-500";
  };

  return (
    <div className="w-80 border-l bg-muted/30 flex flex-col">
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Память</h3>
        </div>
        <button
          onClick={onClose}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ✕
        </button>
      </div>

      <ScrollArea className="flex-1 p-4">
        {memories.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <Brain className="mx-auto mb-2 h-8 w-8 opacity-20" />
            <p className="text-sm">
              Воспоминания появятся после общения
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {memories.map((memory) => (
              <div
                key={memory.id}
                className="rounded-lg border bg-card p-3 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Badge className={cn("text-xs", getTypeColor(memory.type))}>
                    {getTypeLabel(memory.type)}
                  </Badge>
                  {memory.access_count > 1 && (
                    <div
                      className="flex items-center gap-1 text-xs text-muted-foreground"
                      title="Количество упоминаний"
                    >
                      <TrendingUp className="h-3 w-3" />
                      {memory.access_count}
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{memory.content}</p>
                <p className="text-xs text-muted-foreground/50 mt-2">
                  {new Date(memory.created_at).toLocaleDateString('ru-RU')}
                </p>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
