import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { Ionicons } from '@expo/vector-icons';
import { useLocation } from '../hooks/useLocation';
import { UserProfile } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Mock profiles with locations
const mockProfiles: UserProfile[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    age: 28,
    location: { lat: 40.7580, lng: -73.9855 },
    stepGoal: 10000,
    pace: 'moderate',
    availability: ['morning', 'evening'],
    bio: 'Love morning walks in Central Park!',
    badges: ['Early Bird', '7-Day Streak'],
  },
  {
    id: '2',
    name: 'Mike Chen',
    age: 32,
    location: { lat: 40.7489, lng: -73.9680 },
    stepGoal: 12000,
    pace: 'brisk',
    availability: ['evening'],
    bio: 'Training for a half marathon, looking for walking partners.',
    badges: ['Weekend Warrior', 'Step Master'],
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    age: 25,
    location: { lat: 40.7614, lng: -73.9776 },
    stepGoal: 8000,
    pace: 'slow',
    availability: ['afternoon', 'evening'],
    bio: 'Casual walker, love exploring new neighborhoods.',
    badges: ['Explorer'],
  },
];

export const DiscoverScreen = () => {
  const [cardIndex, setCardIndex] = useState(0);
  const [matchModalVisible, setMatchModalVisible] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState<UserProfile | null>(null);
  const swiperRef = useRef<any>(null);
  const { location, calculateDistance } = useLocation();

  const handleSwipe = (index: number, direction: string) => {
    const profile = mockProfiles[index];
    
    if (direction === 'right') {
      // Simulate match (50% chance)
      if (Math.random() > 0.5) {
        setMatchedProfile(profile);
        setMatchModalVisible(true);
      }
    }

    if (index === mockProfiles.length - 1) {
      Alert.alert('No more profiles', 'Check back later for more walking partners!');
    }
  };

  const renderCard = (profile: UserProfile) => {
    const distance = location
      ? calculateDistance(
          location.latitude,
          location.longitude,
          profile.location.lat,
          profile.location.lng
        ).toFixed(1)
      : '?';

    return (
      <View style={styles.card}>
        <Image
          source={{ uri: `https://i.pravatar.cc/400?u=${profile.id}` }}
          style={styles.cardImage}
        />
        <View style={styles.cardContent}>
          <Text style={styles.cardName}>
            {profile.name}, {profile.age}
          </Text>
          <View style={styles.infoRow}>
            <Ionicons name="location" size={16} color="#757575" />
            <Text style={styles.infoText}>{distance} km away</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="trending-up" size={16} color="#757575" />
            <Text style={styles.infoText}>
              {profile.stepGoal.toLocaleString()} steps/day • {profile.pace} pace
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="time" size={16} color="#757575" />
            <Text style={styles.infoText}>
              Available: {profile.availability.join(', ')}
            </Text>
          </View>
          {profile.bio && <Text style={styles.bio}>{profile.bio}</Text>}
          <View style={styles.badges}>
            {profile.badges?.map((badge, idx) => (
              <View key={idx} style={styles.badge}>
                <Text style={styles.badgeText}>{badge}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover</Text>
        <Text style={styles.headerSubtitle}>Find your walking partner</Text>
      </View>

      <View style={styles.swiperContainer}>
        <Swiper
          ref={swiperRef}
          cards={mockProfiles}
          renderCard={renderCard}
          onSwipedLeft={(index) => handleSwipe(index, 'left')}
          onSwipedRight={(index) => handleSwipe(index, 'right')}
          cardIndex={cardIndex}
          backgroundColor="transparent"
          stackSize={2}
          stackScale={10}
          stackSeparation={15}
          disableTopSwipe
          disableBottomSwipe
          animateCardOpacity
          overlayLabels={{
            left: {
              title: 'PASS',
              style: {
                label: {
                  backgroundColor: '#FF5252',
                  color: '#fff',
                  fontSize: 24,
                  fontWeight: 'bold',
                  padding: 10,
                  borderRadius: 10,
                },
                wrapper: {
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  justifyContent: 'flex-start',
                  marginTop: 30,
                  marginLeft: -30,
                },
              },
            },
            right: {
              title: 'LIKE',
              style: {
                label: {
                  backgroundColor: '#4CAF50',
                  color: '#fff',
                  fontSize: 24,
                  fontWeight: 'bold',
                  padding: 10,
                  borderRadius: 10,
                },
                wrapper: {
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  marginTop: 30,
                  marginLeft: 30,
                },
              },
            },
          }}
        />
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.passButton]}
          onPress={() => swiperRef.current?.swipeLeft()}
        >
          <Ionicons name="close" size={32} color="#FF5252" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.likeButton]}
          onPress={() => swiperRef.current?.swipeRight()}
        >
          <Ionicons name="heart" size={32} color="#4CAF50" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#212121',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#757575',
    marginTop: 5,
  },
  swiperContainer: {
    flex: 1,
    marginTop: 20,
  },
  card: {
    height: SCREEN_WIDTH * 1.4,
    borderRadius: 20,
    backgroundColor: '#fff',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardImage: {
    width: '100%',
    height: '60%',
  },
  cardContent: {
    padding: 20,
  },
  cardName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#757575',
  },
  bio: {
    fontSize: 16,
    color: '#212121',
    marginTop: 10,
    lineHeight: 22,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  badge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  badgeText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 30,
    gap: 40,
  },
  actionButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  passButton: {
    borderWidth: 2,
    borderColor: '#FF5252',
  },
  likeButton: {
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
});
