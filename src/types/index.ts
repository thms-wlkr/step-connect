export interface UserProfile {
  id: string;
  name: string;
  photoUrl?: string;
  age?: number;
  location: { lat: number; lng: number };
  stepGoal: number;
  pace: 'slow' | 'moderate' | 'brisk';
  availability: string[];
  bio?: string;
  badges?: string[];
}

export interface Match {
  userA: string;
  userB: string;
  matchedAt: Date;
}

export interface Message {
  fromUserId: string;
  toUserId: string;
  content: string;
  timestamp: Date;
}
