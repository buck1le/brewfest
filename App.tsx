import { Image, View } from 'react-native';
import HomeScreen from './screens/home';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { styles } from './styles';

const Tab = createBottomTabNavigator();

const LogoTitle = (
  { navigation }: any
) => {
  return (
    <Image style={styles.headerImage}
      source={require('./assets/WWBFKatyWhite-01-768x874.png')}
    />
  );
}

const TabTarBackground = () => {
  return (
    <View style={styles.tabBackground} />
  );
}

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#f1b863',
          },
          headerTintColor: '#f1b863',
          headerShadowVisible: false,
          headerLeftContainerStyle: styles.leftHeader,
          tabBarActiveTintColor: '#f1b863',
          tabBarStyle: {
            backgroundColor: '#f1b863',
          },
          tabBarBackground() {
            return (
              <TabTarBackground />
            );
          },
        }}>
        <Tab.Screen
          name="Schedule" 
          component={HomeScreen}
          options={({ navigation }) => ({
            headerLeft: () => <LogoTitle navigation={navigation} />,
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
          options={({ navigation }) => ({
            headerLeft: () => <LogoTitle navigation={navigation} />,
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
          options={({ navigation }) => ({
            headerLeft: () => <LogoTitle navigation={navigation} />,
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

export default App;

