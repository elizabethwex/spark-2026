import { useNavigate } from "react-router-dom";
import {
  Button,
} from "@wexinc-healthbenefits/ben-ui-kit";
import { Send, Mic, FileText } from "lucide-react";
import SiriOrb from "@/components/ui/siri-orb";
import { quickActions } from "@/data/mockData";
import { useReimburseWorkspace } from "@/context/ReimburseWorkspaceContext";

export function AIChatSection() {
  const navigate = useNavigate();
  const { openReimburseWorkspace, openSendPaymentWorkspace } = useReimburseWorkspace();

  return (
    <div className="space-y-3">
      <div className="sticky top-20 z-40 mx-auto w-full transition-all duration-300">
        <div
          className="backdrop-blur-xl border border-border rounded-[2.5rem] p-2 pr-4 flex flex-col md:flex-row items-center gap-4 w-full justify-between"
          style={{
            background:
              "radial-gradient(ellipse at -4% 30%, rgba(23, 45, 161, 0.09) 0%, transparent 50%), radial-gradient(ellipse at 104% 75%, rgba(200, 16, 46, 0.07) 0%, transparent 45%), radial-gradient(ellipse at 55% 140%, rgba(23, 45, 161, 0.04) 0%, transparent 40%), rgba(255, 255, 255, 0.93)",
            boxShadow:
              "0 2px 8px rgba(23, 45, 161, 0.06), 0 8px 24px -12px rgba(23, 45, 161, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
          }}
        >
          <div className="flex items-center gap-3 pl-4 py-2 flex-1 w-full md:w-auto">
            <SiriOrb
              size="40px"
              animationDuration={12}
              colors={{
                bg: "oklch(97% 0.01 264)",
                c1: "oklch(40% 0.18 25)",
                c2: "oklch(35% 0.20 255)",
                c3: "oklch(50% 0.16 15)",
              }}
              className="flex-shrink-0"
            />
            <div className="flex flex-col flex-1">
              <span className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                Good morning, Penny. 
              </span>
              <span className="text-sm text-muted-foreground line-clamp-1">
                You have <strong className="text-foreground">49 days</strong> left to use your $250 FSA balance. Upload documentation?
              </span>
            </div>
            <Button 
              intent="primary" 
              size="sm" 
              className="rounded-full shrink-0 shadow-md shadow-primary/20 hidden sm:flex"
              onClick={() => openReimburseWorkspace()}
            >
              <FileText className="h-4 w-4 mr-1.5" />
              Upload Document
            </Button>
          </div>

          <div className="flex items-center w-full md:w-80 shrink-0 bg-muted/30 rounded-full border border-border/50 p-1 pl-4">
            <input
              type="text"
              placeholder="Ask the assistant..."
              className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground focus:ring-0"
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-primary/5 text-primary hover:bg-primary/10 ml-2 shrink-0"
              aria-label="Voice input"
            >
              <Mic className="h-4 w-4" />
            </Button>
            <Button
              intent="primary"
              size="icon"
              className="h-8 w-8 rounded-full ml-1 shrink-0"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {quickActions.length > 0 && (
        <nav aria-label="Quick actions">
          <div className="flex flex-wrap gap-2 px-1">
            {quickActions.map((action) => (
              <button
                key={action.href}
                onClick={() => {
                  if (action.href === "/reimburse") {
                    openReimburseWorkspace();
                    return;
                  }
                  if (action.href === "/send-payment") {
                    openSendPaymentWorkspace();
                    return;
                  }
                  navigate(action.href);
                }}
                className="rounded-full px-4 py-2.5 min-h-[44px] text-sm font-semibold text-foreground bg-white border border-slate-200/60 shadow-[0_1px_3px_rgb(0,0,0,0.04)] hover:shadow-md hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--wex-focus-ring-color))] focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:transform-none transition-all duration-200"
              >
                {action.label}
              </button>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}
