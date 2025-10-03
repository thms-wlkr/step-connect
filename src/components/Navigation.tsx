import { Footprints, Users, MessageSquare, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavigationProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export const Navigation = ({ activeView, onViewChange }: NavigationProps) => {
  const navItems = [
    { id: 'discover', icon: Footprints, label: 'Walks' },
    { id: 'matches', icon: Users, label: 'Buddies' },
    { id: 'messages', icon: MessageSquare, label: 'Chats' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#141414] border-t border-[#ccff00]/20 shadow-elevated z-50 safe-area-inset-bottom">
      <div className="flex justify-around items-center h-16 px-4">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            size="icon"
            onClick={() => onViewChange(item.id)}
            className={`flex flex-col gap-1 h-14 hover:bg-transparent ${
              activeView === item.id 
                ? 'text-[#ccff00]' 
                : 'text-gray-500 hover:text-[#ccff00]'
            }`}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-xs">{item.label}</span>
          </Button>
        ))}
      </div>
    </nav>
  );
};
