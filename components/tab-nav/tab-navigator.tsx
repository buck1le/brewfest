import { View } from 'react-native';
import HomeScreen from './screens/home';
import Schedule from './screens/schedule';

import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { styles, colors } from './styles';
import { TouchableImage } from './common';

const Tab = createBottomTabNavigator();

const LogoTitle = () => {
  const navigation = useNavigation();

  return (
    <TouchableImage
      onPress={() => navigation.navigate('Home')}
      image={require('./assets/WWBFKatyWhite-01-768x874.png')}
      style={styles.headerImage}
    />
  );
}

const TabTarBackground = () => {
  return (
    <View style={styles.tabBackground} />
  );
}
const MainNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.primary,
          headerShadowVisible: false,
          headerLeftContainerStyle: styles.leftHeader,
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
            headerLeft: () => <LogoTitle />,
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
            headerLeft: () => <LogoTitle />,
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
            headerLeft: () => <LogoTitle />,
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
    </NavigationContainer>
  );
}
