import { Home, MessageSquare, User, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavigationProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export const Navigation = ({ activeView, onViewChange }: NavigationProps) => {
  const navItems = [
    { id: 'discover', icon: Home, label: 'Discover' },
    { id: 'matches', icon: Trophy, label: 'Matches' },
    { id: 'messages', icon: MessageSquare, label: 'Messages' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-elevated z-50">
      <div className="max-w-md mx-auto flex justify-around items-center h-16 px-4">
        {navItems.map(({ id, icon: Icon, label }) => (
          <Button
            key={id}
            variant="ghost"
            size="icon"
            onClick={() => onViewChange(id)}
            className={`flex flex-col gap-1 h-14 ${
              activeView === id ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <Icon className="w-6 h-6" />
            <span className="text-xs">{label}</span>
          </Button>
        ))}
      </div>
    </nav>
  );
};
