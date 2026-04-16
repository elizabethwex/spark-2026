import { useState, useEffect } from "react";
import {
  Badge,
  Button,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  Separator
} from "@wexinc-healthbenefits/ben-ui-kit";
import { ChevronDown, FileText, Download, CheckCircle2, ChevronRight } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  getInitialMessages,
  saveReadStatus,
  UNREAD_COUNT_CHANGED_EVENT,
  type Message,
} from "@/data/messageCenterUtils";
import { buildDesktopMessagesFromVariant } from "@/data/messageCenterFromCatalog";
import { useAppVariant, type AppVariant } from "@/context/AppVariantContext";
import { tasksData } from "@/data/mockData";

interface MessageItem {
  id: string;
  title: string;
  category: string;
  date: string;
  actionDescription: string;
  icon: "alert" | "bell" | "document" | "banking" | "clock" | "mail";
  badge?: {
    label: string;
    intent: "destructive" | "info";
  };
  type: "message" | "task";
  isActionable: boolean;
}

function getMessageData(variant: AppVariant): Message[] {
  return getInitialMessages(buildDesktopMessagesFromVariant(variant).slice(0, 3));
}

const getActionDescription = (subject: string, _category: string): string => {
  if (subject.toLowerCase().includes("contribution maximum") || subject.toLowerCase().includes("contribution warning")) {
    return "Action recommended: Adjust your contribution settings";
  }
  if (subject.toLowerCase().includes("account summary") || subject.toLowerCase().includes("tax form")) {
    return "Ready for your review";
  }
  return "Review this message";
};

const isActionableItem = (subject: string, type: "message" | "task"): boolean => {
  if (type === "task") return true;
  if (subject.toLowerCase().includes("warning") || subject.toLowerCase().includes("action required")) return true;
  return false;
};

const getToDoMessages = (messages: Message[]): MessageItem[] => {
  const unreadMessages = messages
    .filter(msg => !msg.isArchived && !msg.isRead)
    .map(msg => ({
      id: `msg-${msg.id}`,
      title: msg.subject,
      category: msg.category,
      date: msg.deliveryDate,
      actionDescription: getActionDescription(msg.subject, msg.category),
      icon: "document" as const,
      type: "message" as const,
      isActionable: isActionableItem(msg.subject, "message"),
    }));

  const taskItems = tasksData
    .filter(task => task.isPending)
    .map(task => ({
      id: `task-${task.id}`,
      title: task.title,
      category: "Tasks",
      date: "Today",
      actionDescription: task.description,
      icon: task.category as "alert" | "bell" | "document",
      type: "task" as const,
      isActionable: true,
    }));

  return [...taskItems, ...unreadMessages].slice(0, 8); 
};

export function MessageCenterWidget() {
  const { variant } = useAppVariant();
  const [messages, setMessages] = useState<Message[]>(() =>
    getMessageData(variant)
  );
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasksExpanded, setTasksExpanded] = useState(false);

  useEffect(() => {
    setMessages(getMessageData(variant));
  }, [variant]);

  useEffect(() => {
    const handleUnreadCountChange = () => {};
    window.addEventListener(UNREAD_COUNT_CHANGED_EVENT as any, handleUnreadCountChange);

    const refreshMessages = () => {
      setMessages(getMessageData(variant));
    };

    window.addEventListener("focus", refreshMessages);

    return () => {
      window.removeEventListener(UNREAD_COUNT_CHANGED_EVENT as any, handleUnreadCountChange);
      window.removeEventListener("focus", refreshMessages);
    };
  }, [variant]);

  const getIcon = (_iconType: string, isActionable: boolean) => {
    if (isActionable) {
      return <div className="w-8 h-8 rounded-full bg-[var(--app-secondary-50)] flex items-center justify-center">
        <CheckCircle2 className="h-4 w-4 text-[var(--theme-secondary)]" />
      </div>;
    }
    return <div className="w-8 h-8 rounded-full bg-[var(--app-secondary-50)] flex items-center justify-center">
      <FileText className="h-4 w-4 text-[var(--theme-secondary)]" />
    </div>;
  };

  const handleItemClick = (itemId: string, itemType: "message" | "task") => {
    if (itemType === "message") {
      const actualMessageId = itemId.replace("msg-", "");
      const message = messages.find(m => m.id === actualMessageId);
      if (message) {
        setSelectedMessage(message);
        setIsModalOpen(true);
        if (!message.isRead) {
          saveReadStatus(actualMessageId, true);
          setMessages(getMessageData(variant));
        }
      }
    } else {
      console.log("Task clicked:", itemId);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMessage(null);
  };

  const toDoMessages = getToDoMessages(messages);
  
  const INITIAL_VISIBLE_TASKS = 3;
  const actionableItems = toDoMessages.filter(m => m.isActionable);
  const readOnlyItems = toDoMessages.filter(m => !m.isActionable);
  const visibleActionItems = tasksExpanded ? actionableItems : actionableItems.slice(0, INITIAL_VISIBLE_TASKS);
  const hiddenTaskCount = actionableItems.length - INITIAL_VISIBLE_TASKS;

  return (
    <GlassCard className="h-full">
      <CardContent className="p-6 flex flex-col gap-6">
        
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-400 ease-out fill-mode-both">
          <div className="mb-5">
            <SectionHeader
              title="Task Center"
            />
          </div>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-2 duration-400 ease-out fill-mode-both" style={{ animationDelay: "80ms" }}>
          <div className="flex items-center gap-2 mb-3 px-1">
            <h3 className="text-[13px] font-semibold tracking-tight text-foreground flex items-center gap-2 uppercase tracking-widest text-muted-foreground">
              Action Required
              {actionableItems.length > 0 && (
                <Badge className="bg-[var(--app-secondary-50)] text-[var(--theme-secondary)] hover:bg-[var(--app-secondary-50)] border-0 h-5 px-1.5 rounded-md font-bold text-[10px]">
                  {actionableItems.length}
                </Badge>
              )}
            </h3>
          </div>
          
          <div className="flex flex-col gap-1.5">
            {visibleActionItems.length > 0 ? (
              <>
                {visibleActionItems.map((item, index) => (
                  <div 
                    key={item.id}
                    onClick={() => handleItemClick(item.id, item.type)}
                    style={{ animationDelay: `${index * 50}ms` }}
                    className="group cursor-pointer rounded-[16px] bg-white/50 border border-white/80 p-3 shadow-sm hover:bg-white transition-all duration-200 ease-out flex gap-3 items-center animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-300"
                  >
                    <div className="shrink-0">{getIcon(item.icon, true)}</div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                        {item.actionDescription}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </div>
                ))}
                {hiddenTaskCount > 0 && (
                  <button
                    onClick={() => setTasksExpanded(!tasksExpanded)}
                    className="group flex items-center justify-between p-3 rounded-[16px] border border-dashed border-primary/20 bg-primary/[0.03] hover:bg-primary/[0.06] hover:border-primary/30 transition-all duration-200 mt-0.5"
                  >
                    <span className="text-sm font-semibold text-primary/80 group-hover:text-primary transition-colors">
                      {tasksExpanded ? "Show less" : `Show ${hiddenTaskCount} more`}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-primary/60 group-hover:text-primary transition-all duration-300 shrink-0 ${tasksExpanded ? "rotate-180" : ""}`}
                    />
                  </button>
                )}
              </>
            ) : (
              <div className="py-6 text-center text-sm font-medium text-muted-foreground bg-white/30 rounded-[16px] border border-dashed border-border/50">
                No actions required
              </div>
            )}
          </div>
        </div>

        {readOnlyItems.length > 0 && (
          <div className="pt-2 border-t border-border/40">
            <div className="flex items-center mb-3 px-1 mt-2">
              <h3 className="text-[13px] font-semibold tracking-tight uppercase tracking-widest text-muted-foreground">
                For Your Records
              </h3>
            </div>
            
            <div className="flex flex-col gap-1.5">
              {readOnlyItems.map((item, index) => (
                <div 
                  key={item.id}
                  onClick={() => handleItemClick(item.id, item.type)}
                  style={{ animationDelay: `${(actionableItems.length + index) * 50}ms` }}
                  className="group cursor-pointer rounded-[16px] bg-white/50 border border-white/80 p-3 shadow-sm hover:bg-white transition-all duration-200 ease-out flex gap-3 items-center animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-300"
                >
                  <div className="shrink-0">{getIcon(item.icon, false)}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {item.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {item.actionDescription}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}

      </CardContent>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-full max-w-lg p-6">
          <div className="space-y-0 animate-in fade-in slide-in-from-bottom-3 duration-300 ease-out fill-mode-both">
            <div className="space-y-0 mb-4">
              <DialogTitle className="text-base font-semibold text-foreground tracking-tight leading-6 mb-0">
                {selectedMessage?.subject}
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-2">
                {selectedMessage?.deliveryDate}
              </p>
              <Separator className="my-4" />
            </div>
            <div className="space-y-0 min-h-[120px]">
              <p className="text-sm text-foreground leading-relaxed mb-4">
                {selectedMessage?.body || "Please see attachment."}
              </p>
              {selectedMessage?.hasAttachment && (
                <div className="border border-border rounded-xl p-3 bg-neutral-50 flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary shrink-0" />
                  <p className="text-sm font-semibold text-primary flex-1 truncate">
                    {selectedMessage.attachmentFileName || "Attachment.pdf"}
                  </p>
                  <Button variant="ghost" size="icon" className="shrink-0 bg-white rounded-full">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            <div className="flex justify-end pt-4 mt-2">
              <Button intent="primary" onClick={handleCloseModal} className="rounded-full px-6">
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </GlassCard>
  );
}
