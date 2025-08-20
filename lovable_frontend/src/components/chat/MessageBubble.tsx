import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Message } from "@/types/chat";
import AgentBadge from "./AgentBadge";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isUser = message.sender === 'user';

  return (
    <div className={cn("flex mb-4 px-4", isUser ? "justify-end" : "justify-start")}>
      <div className={cn("max-w-[85%] sm:max-w-[75%]", isUser ? "ml-auto" : "mr-auto")}>
        {!isUser && message.agentType && (
          <div className="mb-2">
            <AgentBadge agentType={message.agentType} />
          </div>
        )}
        
        <Card className={cn(
          "group relative",
          isUser 
            ? "bg-primary text-primary-foreground border-primary/20" 
            : "bg-card text-card-foreground border-border"
        )}>
          <div className="p-4">
            <div className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</div>
            
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/50">
              <span className={cn(
                "text-xs",
                isUser ? "text-primary-foreground/70" : "text-muted-foreground"
              )}>
                {formatTime(message.timestamp)}
              </span>
              
              {!isUser && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="h-6 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Copy message"
                >
                  {copied ? (
                    <Check className="h-3 w-3 text-success" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MessageBubble;