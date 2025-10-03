import { useState } from "react";
import { UserProfile } from "@/types";
import { MapPin } from "lucide-react";

interface SwipeCardProps {
  profile: UserProfile;
  style?: React.CSSProperties;
  onClick?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export const SwipeCard = ({ profile, style, onClick, onSwipeLeft, onSwipeRight }: SwipeCardProps) => {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe && onSwipeLeft) {
      onSwipeLeft();
    } else if (isRightSwipe && onSwipeRight) {
      onSwipeRight();
    }
  };

  return (
    <div 
      className="absolute w-full h-full bg-card rounded-3xl overflow-hidden shadow-elevated cursor-pointer"
      style={style}
      onClick={onClick}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="relative h-full">
        <img 
          src={profile.photoUrl} 
          alt={profile.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 pb-36">
          <h2 className="text-3xl font-bold text-white mb-1">{profile.name}, {profile.age}</h2>
          <div className="flex items-center gap-2 text-white/90 mb-2">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">Nearby</span>
          </div>
          <div className="flex items-center gap-3 text-white/80 text-xs">
            <span>{profile.stepGoal.toLocaleString()} steps</span>
            <span>•</span>
            <span className="capitalize">{profile.pace}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
