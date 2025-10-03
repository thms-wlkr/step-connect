import { UserProfile } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface MatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchedProfile: UserProfile | null;
  onMessage: () => void;
}

export const MatchModal = ({ isOpen, onClose, matchedProfile, onMessage }: MatchModalProps) => {
  if (!matchedProfile) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold flex items-center justify-center gap-2">
            <span className="text-3xl">👟</span>
            Step in sync!
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center gap-6 py-4">
          <div className="relative">
            <img 
              src={matchedProfile.photoUrl} 
              alt={matchedProfile.name}
              className="w-32 h-32 rounded-full object-cover shadow-elevated ring-4 ring-primary/20"
            />
            <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center text-xl">
              🚶‍♂️
            </div>
          </div>
          
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-1">{matchedProfile.name}</h3>
            <p className="text-muted-foreground">
              Ready to take some steps together!
            </p>
          </div>
          
          <div className="flex gap-3 w-full">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Keep Walking
            </Button>
            <Button 
              onClick={onMessage}
              className="flex-1 gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Send Message
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
