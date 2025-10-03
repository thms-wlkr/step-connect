import { useState } from "react";
import { UserProfile } from "@/types";
import { SwipeCard } from "@/components/SwipeCard";
import { MatchModal } from "@/components/MatchModal";
import { ProfileDetailModal } from "@/components/ProfileDetailModal";
import { Navigation } from "@/components/Navigation";
import { ChatView } from "@/components/ChatView";
import { ProfileView } from "@/components/ProfileView";
import { Button } from "@/components/ui/button";
import { X, Footprints } from "lucide-react";
import heroBackground from "@/assets/hero-background.jpg";
import profile1 from "@/assets/profile-1.jpg";
import profile2 from "@/assets/profile-2.jpg";
import profile3 from "@/assets/profile-3.jpg";

const mockProfiles: UserProfile[] = [
  {
    id: "1",
    name: "Sarah",
    photoUrl: profile1,
    age: 32,
    location: "Downtown",
    stepGoal: 10000,
    pace: "moderate",
    availability: ["morning", "evening"],
    bio: "Love morning walks in the park! Looking for a walking buddy to stay motivated.",
    badges: ["streak", "steps"]
  },
  {
    id: "2",
    name: "Mike",
    photoUrl: profile2,
    age: 45,
    location: "Riverside",
    stepGoal: 8000,
    pace: "brisk",
    availability: ["afternoon", "evening"],
    bio: "Marathon runner looking for casual walking partners. Let's explore new trails!",
    badges: ["steps"]
  },
  {
    id: "3",
    name: "Emma",
    photoUrl: profile3,
    age: 28,
    location: "Park District",
    stepGoal: 12000,
    pace: "moderate",
    availability: ["morning"],
    bio: "Early bird walker 🌅 Coffee enthusiast ☕ Let's walk and talk!",
    badges: ["streak", "steps", "early"]
  }
];

const currentUserProfile: UserProfile = {
  id: "current-user",
  name: "You",
  photoUrl: profile1,
  age: 30,
  location: "City Center",
  stepGoal: 10000,
  pace: "moderate",
  availability: ["morning", "evening"],
  badges: ["streak", "steps"]
};

const Index = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matchModalOpen, setMatchModalOpen] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState<UserProfile | null>(null);
  const [activeView, setActiveView] = useState("discover");
  const [chatProfile, setChatProfile] = useState<UserProfile | null>(null);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [footsteps, setFootsteps] = useState<Array<{ id: number; x: number; y: number; direction: 'left' | 'right' }>>([]);
  const [detailProfile, setDetailProfile] = useState<UserProfile | null>(null);

  const handleSwipe = (direction: 'left' | 'right') => {
    setSwipeDirection(direction);
    
    // Create footstep trail
    const newFootsteps = Array.from({ length: 5 }, (_, i) => ({
      id: Date.now() + i,
      x: direction === 'right' ? 20 + (i * 15) : 80 - (i * 15),
      y: 50 + (Math.random() * 10 - 5),
      direction
    }));
    setFootsteps(newFootsteps);
    
    setTimeout(() => setFootsteps([]), 800);
    
    setTimeout(() => {
      if (direction === 'right') {
        // Simulate match (50% chance)
        if (Math.random() > 0.5) {
          setMatchedProfile(mockProfiles[currentIndex]);
          setMatchModalOpen(true);
        }
      }
      
      setCurrentIndex((prev) => (prev + 1) % mockProfiles.length);
      setSwipeDirection(null);
    }, 300);
  };

  const handleMessage = () => {
    setMatchModalOpen(false);
    setChatProfile(matchedProfile);
    setActiveView("messages");
  };

  if (chatProfile && activeView === "messages") {
    return <ChatView profile={chatProfile} onBack={() => setChatProfile(null)} />;
  }

  if (activeView === "profile") {
    return (
      <>
        <ProfileView profile={currentUserProfile} />
        <Navigation activeView={activeView} onViewChange={setActiveView} />
      </>
    );
  }

  if (activeView === "matches") {
    return (
      <div className="min-h-screen bg-[#141414] pb-20 px-4 pt-8">
        <h1 className="text-3xl font-bold mb-6 text-[#ccff00]">Your Buddies</h1>
        <div className="grid grid-cols-2 gap-4">
          {mockProfiles.slice(0, 2).map((profile) => (
            <div 
              key={profile.id}
              onClick={() => {
                setChatProfile(profile);
                setActiveView("messages");
              }}
              className="bg-[#1a1a1a] rounded-xl overflow-hidden shadow-card cursor-pointer hover:shadow-elevated transition-shadow"
            >
              <img 
                src={profile.photoUrl} 
                alt={profile.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-white">{profile.name}</h3>
                <p className="text-sm text-gray-400">{profile.location}</p>
              </div>
            </div>
          ))}
        </div>
        <Navigation activeView={activeView} onViewChange={setActiveView} />
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#141414] overflow-hidden flex flex-col">
      {/* Logo Header - Compact */}
      <div className="flex items-center py-3 px-4 bg-[#141414] z-10">
        <img src="/logo.png" alt="walkr" className="h-6 mr-2" onError={(e) => {
          e.currentTarget.style.display = 'none';
        }} />
        <h1 className="text-lg font-bold text-[#ccff00]">walkr</h1>
      </div>

      {/* Swipe Cards - Full Width */}
      <div className="flex-1 relative">
        <div className="absolute inset-0 px-3">
          <div className="relative w-full h-full">
            {/* Footstep Animation */}
            {footsteps.map((step, idx) => (
              <div
                key={step.id}
                className="absolute pointer-events-none animate-fade-out"
                style={{
                  left: `${step.x}%`,
                  top: `${step.y}%`,
                  animationDelay: `${idx * 50}ms`,
                  opacity: 0
                }}
              >
                {step.direction === 'right' ? (
                  <Footprints className="w-6 h-6 text-[#ccff00]" />
                ) : (
                  <X className="w-6 h-6 text-gray-400" />
                )}
              </div>
            ))}
            {mockProfiles.map((profile, index) => {
              if (index < currentIndex || index > currentIndex + 1) return null;
              
              const isTop = index === currentIndex;
              const offset = (index - currentIndex) * 10;
              const scale = 1 - (index - currentIndex) * 0.05;
              
              return (
                <SwipeCard 
                  key={profile.id}
                  profile={profile}
                  onClick={() => isTop && setDetailProfile(profile)}
                  onSwipeLeft={() => isTop && handleSwipe('left')}
                  onSwipeRight={() => isTop && handleSwipe('right')}
                  style={{
                    transform: `translateY(${offset}px) scale(${scale}) ${
                      swipeDirection && isTop 
                        ? swipeDirection === 'left' 
                          ? 'translateX(-150%) rotate(-20deg)' 
                          : 'translateX(150%) rotate(20deg)'
                        : ''
                    }`,
                    transition: swipeDirection && isTop ? 'transform 0.3s ease-out' : 'transform 0.3s ease-in-out',
                    zIndex: mockProfiles.length - index,
                    opacity: isTop ? 1 : 0.5,
                  }}
                />
              );
            })}
            
            {/* Swipe Buttons - Overlaying Card */}
            <div className="absolute bottom-20 left-0 right-0 flex justify-center gap-6 z-20">
              <Button
                variant="swipe"
                size="swipe"
                onClick={() => handleSwipe('left')}
                className="bg-[#141414]/90 backdrop-blur-sm border-2 border-gray-600 hover:border-red-500 shadow-elevated"
              >
                <X className="w-8 h-8 text-gray-400" />
              </Button>
              <Button
                variant="swipe"
                size="swipe"
                onClick={() => handleSwipe('right')}
                className="bg-[#ccff00]/90 backdrop-blur-sm hover:bg-[#ccff00] shadow-elevated"
              >
                <Footprints className="w-8 h-8 text-[#141414]" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <MatchModal 
        isOpen={matchModalOpen}
        onClose={() => setMatchModalOpen(false)}
        matchedProfile={matchedProfile}
        onMessage={handleMessage}
      />

      <ProfileDetailModal
        isOpen={!!detailProfile}
        onClose={() => setDetailProfile(null)}
        profile={detailProfile}
      />

      {/* Navigation - Fixed Bottom */}
      <div className="z-30">
        <Navigation activeView={activeView} onViewChange={setActiveView} />
      </div>
    </div>
  );
};

export default Index;
