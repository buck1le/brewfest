import { TouchableWithoutFeedback, View } from 'react-native';
import Schedule from 'screens/schedule';
import Vendors from 'screens/vendors';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';
import * as Haptics from 'expo-haptics';
import { colors } from 'global_styles';
import Brews from 'screens/brews';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Map from 'screens/map';


const Tab = createBottomTabNavigator();

const TabTarBackground = () => {
  return (
    <View style={styles.tabBackground} />
  );
}
const MainTabNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          position: 'absolute',
          paddingTop: 10,
          backgroundColor: colors.blue,
          paddingBottom: insets.bottom,

          height: 70 + insets.bottom,
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
        name="Drinks"
        component={Brews}
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
