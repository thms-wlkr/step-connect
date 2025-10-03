import { UserProfile } from "@/types";
import { Badge } from "@/components/ui/badge";
import { MapPin, TrendingUp, Clock } from "lucide-react";

interface SwipeCardProps {
  profile: UserProfile;
  style?: React.CSSProperties;
}

export const SwipeCard = ({ profile, style }: SwipeCardProps) => {
  const paceEmoji = {
    slow: "🚶",
    moderate: "🚶‍♂️",
    brisk: "🏃"
  };

  return (
    <div 
      className="absolute w-full h-full bg-card rounded-2xl overflow-hidden shadow-elevated"
      style={style}
    >
      <div className="relative h-[60%]">
        <img 
          src={profile.photoUrl} 
          alt={profile.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
          <h2 className="text-3xl font-bold text-white mb-1">{profile.name}</h2>
          <div className="flex items-center gap-2 text-white/90">
            {profile.age && <span>{profile.age}</span>}
            <MapPin className="w-4 h-4" />
            <span className="text-sm">Nearby</span>
          </div>
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        {profile.bio && (
          <p className="text-muted-foreground">{profile.bio}</p>
        )}
        
        <div className="space-y-3">
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
              <div className="flex gap-2 mt-1">
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
  );
};
