import { useState } from "react";
import { UserProfile } from "@/types";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MapPin, TrendingUp, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile | null;
}

export const ProfileDetailModal = ({ isOpen, onClose, profile }: ProfileDetailModalProps) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  
  if (!profile) return null;

  const photos = [profile.photoUrl]; // TODO: Add multiple photos support
  
  const paceEmoji = {
    slow: "🚶",
    moderate: "🚶♂️",
    brisk: "🏃"
  };

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md h-[90vh] p-0 overflow-y-auto">
        <div className="relative">
          {/* Photo Gallery */}
          <div className="relative h-[50vh]">
            <img 
              src={photos[currentPhotoIndex]} 
              alt={profile.name}
              className="w-full h-full object-cover"
            />
            {photos.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={prevPhoto}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50"
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={nextPhoto}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50"
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                  {photos.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-2 h-2 rounded-full ${
                        idx === currentPhotoIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Profile Details */}
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-3xl font-bold mb-1">{profile.name}, {profile.age}</h2>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{profile.location}</span>
              </div>
            </div>

            {profile.bio && (
              <div>
                <h3 className="font-semibold mb-2">About</h3>
                <p className="text-muted-foreground">{profile.bio}</p>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="font-semibold">Walking Profile</h3>
              
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Daily Goal</p>
                  <p className="font-semibold">{profile.stepGoal.toLocaleString()} steps</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="text-2xl">{paceEmoji[profile.pace]}</div>
                <div>
                  <p className="text-sm text-muted-foreground">Pace</p>
                  <p className="font-semibold capitalize">{profile.pace}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-secondary" />
                <div>
                  <p className="text-sm text-muted-foreground">Availability</p>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    {profile.availability.map((time) => (
                      <Badge key={time} variant="secondary" className="capitalize">
                        {time}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
