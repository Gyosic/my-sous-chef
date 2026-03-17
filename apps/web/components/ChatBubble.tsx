import { Zap } from "lucide-react";

interface AiMessageProps {
  type: "ai";
  children: React.ReactNode;
}

interface UserMessageProps {
  type: "user";
  children: React.ReactNode;
}

type ChatBubbleProps = AiMessageProps | UserMessageProps;

export function ChatBubble({ type, children }: ChatBubbleProps) {
  if (type === "user") {
    return (
      <div className="flex w-full justify-end">
        <div className="max-w-[280px] rounded-[16px_4px_16px_16px] bg-foreground px-3.5 py-3 text-sm leading-relaxed text-background">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full gap-2">
      <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-foreground">
        <Zap className="size-3.5 text-background" />
      </div>
      <div className="max-w-[280px] rounded-[4px_16px_16px_16px] bg-muted/50 px-3.5 py-3 text-sm font-medium leading-relaxed text-foreground">
        {children}
      </div>
    </div>
  );
}
