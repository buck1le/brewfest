import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import MainTabNavigator from "components/tab-nav/tab-navigator";

import Home from 'screens/home';

import { useNavigation } from '@react-navigation/native';
import { styles, colors } from './styles';
import TouchableImage from 'common/touchable-image';
import { ClerkProvider } from "@clerk/clerk-expo";

const Stack = createStackNavigator();

const LogoTitle = () => {
  const navigation = useNavigation();

  return (
    <TouchableImage
      onPress={() => navigation.navigate('Home')}
      image={require('assets/WWBFKatyWhite-01-768x874.png')}
      style={styles.headerImage}
    />
  );
}

const clerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

const App = () => {
  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerLeft: () => <LogoTitle />,
            headerStyle: {
              backgroundColor: colors.primary,
            },
            headerTintColor: colors.primary,
            headerShadowVisible: false,
            headerLeftContainerStyle: styles.leftHeader,
          }}
        >
          <Stack.Screen name="Main" component={MainTabNavigator} />
          <Stack.Screen name="Home" component={Home} />
        </Stack.Navigator>
      </NavigationContainer>
    </ClerkProvider>
  );
}

export default App;

