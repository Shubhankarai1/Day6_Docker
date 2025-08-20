import { useState, useRef, useEffect } from "react";
import { Trash2, MessageSquare, Bot, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Message } from "@/types/chat";
import { sendMessage } from "@/services/chatApi";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import TypingIndicator from "./TypingIndicator";
import ErrorMessage from "./ErrorMessage";

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (content: string) => {
    setError(null);
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    try {
      // Use new sendMessage signature
      const response = await sendMessage(content, conversationId);
      // Set conversationId if returned
      if (response.conversation_id) {
        setConversationId(response.conversation_id);
      }
      // Show output from backend (response.output or response.response or response.answer)
      const aiContent = response.output || response.response || response.answer || JSON.stringify(response);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiContent,
        sender: 'ai',
        timestamp: new Date(),
        agentType: response.agent_type as 'General Support' | 'Product Specialist' | 'Technical Support',
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setError(null);
    setConversationId(undefined);
  };

  const handleRetry = () => {
    if (messages.length > 0) {
      const lastUserMessage = [...messages].reverse().find(m => m.sender === 'user');
      if (lastUserMessage) {
        handleSendMessage(lastUserMessage.content);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-background to-background/80">
      {/* Header */}
      <Card className="rounded-none border-x-0 border-t-0 shadow-sm">
        <CardHeader className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">AI Customer Support</h1>
                <p className="text-sm text-muted-foreground">Powered by intelligent assistance</p>
              </div>
            </div>
            {messages.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearChat}
                className="flex items-center space-x-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>Clear Chat</span>
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Messages Area */}
      <div className="flex-1 relative">
        <ScrollArea className="h-full">
          <div className="pb-4">
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                <Card className="max-w-md mx-4">
                  <CardContent className="text-center p-8">
                    <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4">
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-lg font-semibold text-foreground mb-2">
                      Welcome to AI Customer Support
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      Our specialized AI agents are ready to help you with any questions or concerns.
                    </p>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center space-x-2 text-left">
                        <div className="w-2 h-2 bg-badge-general rounded-full flex-shrink-0"></div>
                        <span>General Support & Account Questions</span>
                      </div>
                      <div className="flex items-center space-x-2 text-left">
                        <div className="w-2 h-2 bg-badge-product rounded-full flex-shrink-0"></div>
                        <span>Product Information & Specifications</span>
                      </div>
                      <div className="flex items-center space-x-2 text-left">
                        <div className="w-2 h-2 bg-badge-technical rounded-full flex-shrink-0"></div>
                        <span>Technical Troubleshooting & Support</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}

            {isLoading && (
              <div className="px-4">
                <Card className="max-w-[85%] sm:max-w-[75%] bg-muted/30">
                  <CardContent className="p-0">
                    <TypingIndicator />
                  </CardContent>
                </Card>
              </div>
            )}
            
            {error && <ErrorMessage message={error} onRetry={handleRetry} />}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Input Area */}
      <MessageInput onSendMessage={handleSendMessage} disabled={isLoading} />
    </div>
  );
};

export default ChatInterface;