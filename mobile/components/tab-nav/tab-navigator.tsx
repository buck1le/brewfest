import { TouchableWithoutFeedback, View } from 'react-native';
import Schedule from 'screens/schedule';
import Map from 'screens/map';
import Vendors from 'screens/vendors';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';
import * as Haptics from 'expo-haptics';
import { colors } from 'global_styles';


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
        tabBarStyle: {
          backgroundColor: colors.blue,
          paddingTop: 10,
        },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'white',
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
        name="Brews"
        component={Map}
        options={() => ({
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? 'beer' : 'beer-outline'}
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
    </Tab.Navigator>
  );
}

export default MainTabNavigator;
