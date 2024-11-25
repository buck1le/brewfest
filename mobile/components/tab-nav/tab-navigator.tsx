import { TouchableWithoutFeedback, View } from 'react-native';
import Schedule from 'screens/schedule';
import Map from 'screens/map';
import Vendors from 'screens/vendors';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { styles, colors } from './styles';
import * as Haptics from 'expo-haptics';


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
          marginTop: -10
        },
        tabBarBackground: TabTarBackground,
        headerShown: false,
        tabBarButton: ({ onPress, ...props }) => (
          <TouchableWithoutFeedback
            onPress={(e) => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)
              onPress?.(e);
            }}
          >
            <View {...props} />
          </TouchableWithoutFeedback>
        ),
      }}>
      <Tab.Screen
        name="Vendors"
        component={Vendors}
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
        component={Map}
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
    </Tab.Navigator>
  );
}

export default MainTabNavigator;
