import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserProfile } from '../types';

const mockMatches: UserProfile[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    age: 28,
    location: { lat: 40.7580, lng: -73.9855 },
    stepGoal: 10000,
    pace: 'moderate',
    availability: ['morning', 'evening'],
    badges: ['Early Bird'],
  },
  {
    id: '2',
    name: 'Mike Chen',
    age: 32,
    location: { lat: 40.7489, lng: -73.9680 },
    stepGoal: 12000,
    pace: 'brisk',
    availability: ['evening'],
    badges: ['Step Master'],
  },
];

export const MatchesScreen = ({ navigation }: any) => {
  const renderMatch = ({ item }: { item: UserProfile }) => (
    <TouchableOpacity
      style={styles.matchCard}
      onPress={() => navigation.navigate('Chat', { profile: item })}
    >
      <Image
        source={{ uri: `https://i.pravatar.cc/200?u=${item.id}` }}
        style={styles.matchImage}
      />
      <View style={styles.matchInfo}>
        <Text style={styles.matchName}>{item.name}</Text>
        <View style={styles.matchDetails}>
          <Ionicons name="location" size={14} color="#757575" />
          <Text style={styles.matchText}>
            {item.stepGoal.toLocaleString()} steps • {item.pace}
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.messageButton}>
        <Ionicons name="chatbubble" size={24} color="#4CAF50" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Matches</Text>
        <Text style={styles.headerSubtitle}>
          {mockMatches.length} walking partner{mockMatches.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={mockMatches}
        renderItem={renderMatch}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
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
  list: {
    padding: 20,
  },
  matchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  matchImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  matchInfo: {
    flex: 1,
    marginLeft: 15,
  },
  matchName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 5,
  },
  matchDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  matchText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#757575',
  },
  messageButton: {
    padding: 10,
  },
});
