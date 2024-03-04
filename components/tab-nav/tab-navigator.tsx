import { View } from 'react-native';
import HomeScreen from 'screens/home';
import Schedule from 'screens/schedule';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { styles, colors } from './styles';

const Tab = createBottomTabNavigator();

const TabTarBackground = () => {
  return (
    <View style={styles.tabBackground} />
  );
}
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarStyle: {
          backgroundColor: colors.primary,
        },
        tabBarBackground() {
          return (
            <TabTarBackground />
          );
        },
      }}>
      <Tab.Screen
        name="Schedule"
        component={Schedule}
        options={() => ({
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? 'calendar' : 'calendar-outline'}
              size={size}
              color={color}
            />
          ),
          tabBarLabelStyle: styles.tabLabel,
        })}
      />
      <Tab.Screen
        name="Map"
        component={HomeScreen}
        options={() => ({
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? 'map' : 'map-outline'}
              size={size}
              color={color}
            />
          ),
          tabBarLabelStyle: styles.tabLabel,
        })}
      />
      <Tab.Screen
        name="Vendors"
        component={HomeScreen}
        options={() => ({
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? 'list' : 'list-outline'}
              size={size}
              color={color}
            />
          ),
          tabBarLabelStyle: styles.tabLabel,
        })}
      />
    </Tab.Navigator>
  );
}

export default MainTabNavigator;
