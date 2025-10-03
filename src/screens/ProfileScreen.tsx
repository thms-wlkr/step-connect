import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

export const ProfileScreen = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut();
          } catch (error: any) {
            Alert.alert('Error', error.message);
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings" size={24} color="#212121" />
        </TouchableOpacity>
      </View>

      <View style={styles.profileSection}>
        <Image
          source={{ uri: `https://i.pravatar.cc/200?u=${user?.id}` }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{user?.name || 'User'}</Text>
        <Text style={styles.profileEmail}>{user?.email}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>10,247</Text>
          <Text style={styles.statLabel}>Steps Today</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>5</Text>
          <Text style={styles.statLabel}>Walking Partners</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>12</Text>
          <Text style={styles.statLabel}>Walks This Week</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Walking Preferences</Text>
        
        <View style={styles.preferenceCard}>
          <Ionicons name="trending-up" size={24} color="#4CAF50" />
          <View style={styles.preferenceInfo}>
            <Text style={styles.preferenceLabel}>Daily Step Goal</Text>
            <Text style={styles.preferenceValue}>10,000 steps</Text>
          </View>
        </View>

        <View style={styles.preferenceCard}>
          <Ionicons name="location" size={24} color="#4CAF50" />
          <View style={styles.preferenceInfo}>
            <Text style={styles.preferenceLabel}>Preferred Pace</Text>
            <Text style={styles.preferenceValue}>Moderate (3-4 mph)</Text>
          </View>
        </View>

        <View style={styles.preferenceCard}>
          <Ionicons name="shield-checkmark" size={24} color="#4CAF50" />
          <View style={styles.preferenceInfo}>
            <Text style={styles.preferenceLabel}>Safety</Text>
            <Text style={styles.preferenceValue}>Verified • Public walks only</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        <View style={styles.badgesContainer}>
          {['Early Bird', '7-Day Streak', 'Step Master', 'Explorer'].map(
            (badge, idx) => (
              <View key={idx} style={styles.badgeCard}>
                <Text style={styles.badgeText}>{badge}</Text>
              </View>
            )
          )}
        </View>
      </View>

      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Ionicons name="log-out" size={20} color="#FF5252" />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>

      <View style={{ height: 100 }} />
    </ScrollView>
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
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: '#fff',
  },
  settingsButton: {
    padding: 10,
  },
  profileSection: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#fff',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
  },
  profileEmail: {
    fontSize: 16,
    color: '#757575',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  statLabel: {
    fontSize: 12,
    color: '#757575',
    marginTop: 5,
    textAlign: 'center',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 15,
  },
  preferenceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 10,
  },
  preferenceInfo: {
    marginLeft: 15,
    flex: 1,
  },
  preferenceLabel: {
    fontSize: 14,
    color: '#757575',
  },
  preferenceValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginTop: 5,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  badgeCard: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  badgeText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    marginHorizontal: 20,
    marginTop: 10,
    gap: 10,
  },
  signOutText: {
    color: '#FF5252',
    fontSize: 16,
    fontWeight: '600',
  },
});
