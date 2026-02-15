import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useRouter } from 'expo-router';
import { Image, View, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';

const Tab = createMaterialTopTabNavigator();

export default function PostGuideSleepLayout() {
  const router = useRouter();
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const userId = 1; // สมมุติว่า login แล้วได้ user_id

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const res = await fetch(`http://192.168.1.10:8000/users/${userId}`);
        const data = await res.json();
        setProfileImageUrl(data.image_url || null);
      } catch {
        setProfileImageUrl(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileImage();
  }, []);

  return (
    <>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/profile')}>
          {loading ? (
            <ActivityIndicator size="small" />
          ) : profileImageUrl ? (
            <Image source={{ uri: profileImageUrl }} style={styles.profileIcon} />
          ) : (
            <View style={styles.profilePlaceholder}>
              <Image
                source={require('../../assets/images/icon.png')}
                style={styles.profileIcon}
              />
            </View>
          )}
        </TouchableOpacity>

        <Image
          source={require('../../assets/images/logo_flashsleep.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={{ width: 30 }} />
      </View>

      {/* Material Top Tabs */}
      <Tab.Navigator
        screenOptions={{
          tabBarIndicatorStyle: { backgroundColor: '#007AFF' },
          tabBarLabelStyle: { fontSize: 14 },
          tabBarStyle: { backgroundColor: '#fff' },
        }}
      >
        <Tab.Screen
          name="guidesleep"
          component={() => null}
          options={{ title: 'Guidesleep' }}
        />
        <Tab.Screen
          name="diarysleep"
          component={() => null}
          options={{ title: 'Diarysleep' }}
        />
        <Tab.Screen
          name="questsleep"
          component={() => null}
          options={{ title: 'Questsleep' }}
        />
      </Tab.Navigator>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profileIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  profilePlaceholder: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 40,
  },
});
