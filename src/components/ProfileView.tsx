import { useState } from "react";
import { UserProfile } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, MapPin, TrendingUp, Clock, Award } from "lucide-react";
import { EditProfileModal } from "@/components/EditProfileModal";

interface ProfileViewProps {
  profile: UserProfile;
  onProfileUpdate?: (profile: UserProfile) => void;
}

export const ProfileView = ({ profile, onProfileUpdate }: ProfileViewProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentProfile, setCurrentProfile] = useState(profile);

  const handleSave = (updatedProfile: UserProfile) => {
    setCurrentProfile(updatedProfile);
    onProfileUpdate?.(updatedProfile);
  };

  return (
    <div className="min-h-screen bg-[#141414] pb-20">
      {/* Header */}
      <div className="flex items-center justify-between py-3 px-4 bg-[#141414]">
        <h1 className="text-lg font-bold text-[#ccff00]">Profile</h1>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setIsEditOpen(true)}
          className="text-[#ccff00] hover:bg-transparent"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>

      {/* Profile Image */}
      <div className="px-6 mt-6 mb-6">
        <img 
          src={currentProfile.photoUrl} 
          alt={currentProfile.name}
          className="w-32 h-32 rounded-full object-cover border-4 border-[#141414] shadow-elevated"
        />
      </div>

      {/* Profile Info */}
      <div className="px-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-white">{currentProfile.name}</h1>
          <div className="flex items-center gap-2 text-gray-400">
            {currentProfile.age && <span>{currentProfile.age} years old</span>}
            <span>•</span>
            <MapPin className="w-4 h-4" />
            <span>{currentProfile.location}</span>
          </div>
        </div>

        {currentProfile.bio && (
          <p className="text-gray-400">{currentProfile.bio}</p>
        )}

        {/* Walking Stats */}
        <div className="bg-[#1a1a1a] rounded-xl p-6 shadow-card space-y-4">
          <h2 className="font-semibold text-lg mb-4 text-white">Walking Profile</h2>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#ccff00]/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#ccff00]" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-400">Daily Goal</p>
              <p className="font-semibold text-white">{currentProfile.stepGoal.toLocaleString()} steps</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#ccff00]/10 flex items-center justify-center">
              <span className="text-xl">👟</span>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-400">Pace</p>
              <p className="font-semibold capitalize text-white">{currentProfile.pace}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#ccff00]/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-[#ccff00]" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-400 mb-2">Availability</p>
              <div className="flex gap-2 flex-wrap">
                {currentProfile.availability.map((time) => (
                  <Badge key={time} variant="secondary" className="capitalize">
                    {time}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Badges */}
        {currentProfile.badges && currentProfile.badges.length > 0 && (
          <div className="bg-[#1a1a1a] rounded-xl p-6 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-[#ccff00]" />
              <h2 className="font-semibold text-lg text-white">Achievements</h2>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {currentProfile.badges.map((badge, idx) => (
                <div key={idx} className="flex-shrink-0 w-20 text-center">
                  <div className="w-16 h-16 rounded-full bg-[#ccff00]/20 flex items-center justify-center text-3xl mb-2 shadow-card">
                    {badge === 'streak' ? '🔥' : badge === 'steps' ? '👟' : '⭐'}
                  </div>
                  <p className="text-xs text-gray-400 capitalize">{badge}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button variant="outline" className="w-full border-[#ccff00] text-[#ccff00] hover:bg-[#ccff00] hover:text-[#141414]" size="lg" onClick={() => setIsEditOpen(true)}>
          Edit Profile
        </Button>
      </div>

      <EditProfileModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        profile={currentProfile}
        onSave={handleSave}
      />
    </div>
  );
};
