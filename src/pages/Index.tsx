import { useState, useRef } from "react";
import { UserProfile } from "@/types";
import { SwipeCard } from "@/components/SwipeCard";
import { MatchModal } from "@/components/MatchModal";
import { Navigation } from "@/components/Navigation";
import { ChatView } from "@/components/ChatView";
import { ProfileView } from "@/components/ProfileView";
import { Button } from "@/components/ui/button";
import { X, Heart } from "lucide-react";
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
    location: { lat: 40.7580, lng: -73.9855 },
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
    location: { lat: 40.7489, lng: -73.9680 },
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
    location: { lat: 40.7614, lng: -73.9776 },
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
  location: { lat: 40.7128, lng: -74.0060 },
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

  const handleSwipe = (direction: 'left' | 'right') => {
    setSwipeDirection(direction);
    
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
      <div className="min-h-screen bg-background pb-20 px-4 pt-8">
        <h1 className="text-3xl font-bold mb-6">Your Matches</h1>
        <div className="grid grid-cols-2 gap-4">
          {mockProfiles.slice(0, 2).map((profile) => (
            <div 
              key={profile.id}
              onClick={() => {
                setChatProfile(profile);
                setActiveView("messages");
              }}
              className="bg-card rounded-xl overflow-hidden shadow-card cursor-pointer hover:shadow-elevated transition-shadow"
            >
              <img 
                src={profile.photoUrl} 
                alt={profile.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold">{profile.name}</h3>
                <p className="text-sm text-muted-foreground">Nearby</p>
              </div>
            </div>
          ))}
        </div>
        <Navigation activeView={activeView} onViewChange={setActiveView} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div 
        className="relative h-32 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBackground})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />
        <div className="relative h-full flex items-center justify-center">
          <h1 className="text-3xl font-bold text-white">StepBuddy</h1>
        </div>
      </div>

      {/* Swipe Cards */}
      <div className="max-w-md mx-auto px-4 py-8 pb-24">
        <div className="relative h-[600px]">
          {mockProfiles.map((profile, index) => {
            if (index < currentIndex || index > currentIndex + 1) return null;
            
            const isTop = index === currentIndex;
            const offset = (index - currentIndex) * 10;
            const scale = 1 - (index - currentIndex) * 0.05;
            
            return (
              <SwipeCard 
                key={profile.id}
                profile={profile}
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
        </div>

        {/* Swipe Buttons */}
        <div className="flex justify-center gap-6 mt-8">
          <Button
            variant="swipe"
            size="swipe"
            onClick={() => handleSwipe('left')}
            className="bg-card border-2 border-muted hover:border-destructive group"
          >
            <X className="w-8 h-8 text-muted-foreground group-hover:text-destructive" />
          </Button>
          <Button
            variant="swipe"
            size="swipe"
            onClick={() => handleSwipe('right')}
            className="bg-primary hover:bg-primary/90"
          >
            <Heart className="w-8 h-8 text-primary-foreground" />
          </Button>
        </div>
      </div>

      <MatchModal 
        isOpen={matchModalOpen}
        onClose={() => setMatchModalOpen(false)}
        matchedProfile={matchedProfile}
        onMessage={handleMessage}
      />

      <Navigation activeView={activeView} onViewChange={setActiveView} />
    </div>
  );
};

export default Index;
