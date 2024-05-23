import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import MyTabBar from '@/components/navigation/TabBar';
import { styles, colors } from './styles';
import { View } from 'react-native';

const TabBarBackground = () => {
  return (
    <View style={styles.tabBackground}/>
  )
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

      return (
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarStyle: {
            backgroundColor: colors.primary,
          },
          tabBarBackground() {
            return (
              <TabBarBackground />
            );
          },
        }}
      >
      <Tabs.Screen
        name="schedule"
        options={{
          title: 'schedule',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'map',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
