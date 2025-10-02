import { UserProfile } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, MapPin, TrendingUp, Clock, Award } from "lucide-react";

interface ProfileViewProps {
  profile: UserProfile;
}

export const ProfileView = ({ profile }: ProfileViewProps) => {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="relative h-64 bg-gradient-primary">
        <Button 
          variant="ghost" 
          size="icon"
          className="absolute top-4 right-4 bg-card/20 backdrop-blur-sm text-white hover:bg-card/30"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>

      {/* Profile Image */}
      <div className="px-6 -mt-20 mb-6">
        <img 
          src={profile.photoUrl} 
          alt={profile.name}
          className="w-32 h-32 rounded-full object-cover border-4 border-background shadow-elevated"
        />
      </div>

      {/* Profile Info */}
      <div className="px-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            {profile.age && <span>{profile.age} years old</span>}
            <span>•</span>
            <MapPin className="w-4 h-4" />
            <span>{profile.location}</span>
          </div>
        </div>

        {profile.bio && (
          <p className="text-muted-foreground">{profile.bio}</p>
        )}

        {/* Walking Stats */}
        <div className="bg-card rounded-xl p-6 shadow-card space-y-4">
          <h2 className="font-semibold text-lg mb-4">Walking Profile</h2>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Daily Goal</p>
              <p className="font-semibold">{profile.stepGoal.toLocaleString()} steps</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-xl">
              {profile.pace === 'slow' ? '🚶' : profile.pace === 'moderate' ? '🚶‍♂️' : '🏃'}
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Pace</p>
              <p className="font-semibold capitalize">{profile.pace}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-accent" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-2">Availability</p>
              <div className="flex gap-2 flex-wrap">
                {profile.availability.map((time) => (
                  <Badge key={time} variant="secondary" className="capitalize">
                    {time}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Badges */}
        {profile.badges && profile.badges.length > 0 && (
          <div className="bg-card rounded-xl p-6 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-secondary" />
              <h2 className="font-semibold text-lg">Achievements</h2>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {profile.badges.map((badge, idx) => (
                <div key={idx} className="flex-shrink-0 w-20 text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-secondary flex items-center justify-center text-3xl mb-2 shadow-card">
                    {badge === 'streak' ? '🔥' : badge === 'steps' ? '👟' : '⭐'}
                  </div>
                  <p className="text-xs text-muted-foreground capitalize">{badge}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button variant="outline" className="w-full" size="lg">
          Edit Profile
        </Button>
      </div>
    </div>
  );
};
