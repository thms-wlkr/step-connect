import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send } from "lucide-react";
import { UserProfile, Message } from "@/types";

interface ChatViewProps {
  profile: UserProfile;
  onBack: () => void;
}

export const ChatView = ({ profile, onBack }: ChatViewProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      fromUserId: profile.id,
      toUserId: "current-user",
      content: "Hey! Ready for a walk today?",
      timestamp: new Date(Date.now() - 3600000)
    }
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (!newMessage.trim()) return;
    
    setMessages([...messages, {
      fromUserId: "current-user",
      toUserId: profile.id,
      content: newMessage,
      timestamp: new Date()
    }]);
    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <img 
          src={profile.photoUrl} 
          alt={profile.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <h3 className="font-semibold">{profile.name}</h3>
          <p className="text-xs text-muted-foreground">Active now</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => {
          const isOwn = msg.fromUserId === "current-user";
          return (
            <div key={idx} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                  isOwn 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-foreground'
                }`}
              >
                <p>{msg.content}</p>
                <p className={`text-xs mt-1 ${isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="bg-card border-t border-border p-4 flex gap-2">
        <Input 
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1"
        />
        <Button onClick={handleSend} size="icon">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
