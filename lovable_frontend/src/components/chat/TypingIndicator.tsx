const TypingIndicator = () => {
  return (
    <div className="flex items-center space-x-3 p-4">
      <div className="flex space-x-1">
        <div className="h-2 w-2 bg-primary/60 rounded-full animate-bounce-gentle" style={{ animationDelay: '0ms' }}></div>
        <div className="h-2 w-2 bg-primary/60 rounded-full animate-bounce-gentle" style={{ animationDelay: '150ms' }}></div>
        <div className="h-2 w-2 bg-primary/60 rounded-full animate-bounce-gentle" style={{ animationDelay: '300ms' }}></div>
      </div>
      <span className="text-sm text-muted-foreground">AI is thinking...</span>
    </div>
  );
};

export default TypingIndicator;