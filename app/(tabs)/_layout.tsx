import { Tabs } from 'expo-router';
import React from 'react';

import FloatingTabBar from '@/components/navigation/FloatingTabBar';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' }, // Hide default tab bar
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          href: null, // Hide from tab bar, redirect to index
        }}
      />
      <Tabs.Screen
        name="courses"
        options={{
          title: 'Produtos',
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progresso',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          href: null, // Hide from navigation
        }}
      />
    </Tabs>
  );
}
