import { Image, View } from 'react-native';
import HomeScreen from './screens/home';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const LogoTitle = (
  { navigation }: any
) => {
  return (
    <Image style={{ width: 60, height: 60, overflow: 'visible' }}
      source={require('./assets/WWBFKatyWhite-01-768x874.png')}
    />
  );
}

const TabTarBackground = () => {
  return (
    <View style={{
      backgroundColor: '#fff',
      height: 85,
      width: '100%',
      position: 'absolute',
      bottom: 0,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      overflow: 'hidden'
    }} />
  );
}

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#f1b863',
            shadowOffset: { height: 0, width: 0 },
          },
          headerTintColor: '#f1b863',
          headerLeftContainerStyle: {
            paddingLeft: 20,
            paddingTop: 20,
          },
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
          name="Home"
          component={HomeScreen}
          options={({ navigation }) => ({
            headerLeft: () => <LogoTitle navigation={navigation} />,
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                name={focused ? 'home' : 'home-outline'}
                size={size}
                color={color}
              />
            ),
          })}
        />
        <Tab.Screen
          name="Something"
          component={HomeScreen}
          options={({ navigation }) => ({
            headerLeft: () => <LogoTitle navigation={navigation} />,
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                name={focused ? 'home' : 'home-outline'}
                size={size}
                color={color}
              />
            ),
          })}
        />
        <Tab.Screen
          name="Hello"
          component={HomeScreen}
          options={({ navigation }) => ({
            headerLeft: () => <LogoTitle navigation={navigation} />,
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                name={focused ? 'home' : 'home-outline'}
                size={size}
                color={color}
              />
            ),
          })}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;

