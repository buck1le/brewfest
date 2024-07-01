import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';

import MainTabNavigator from "components/tab-nav/tab-navigator";
import TouchableImage from 'common/touchable-image';
import Item from "screens/schedule/item";
import Home from 'screens/home';
import { styles, colors } from './styles';

const Stack = createStackNavigator();

const LogoTitle = () => {
  const navigation = useNavigation();

  return (
    <TouchableImage
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
        navigation.navigate('Home')
        }
      }
      image={require('assets/WWBFKatyWhite-01-768x874.png')}
      style={styles.headerImage}
    />
  );
}

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
      >
        <Stack.Group screenOptions={{
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
        </Stack.Group>
        <Stack.Group screenOptions={{
          presentation: 'card',
          headerShadowVisible: false,
          headerTitle: '',
          headerBackTitle: 'Schedule',
          headerStyle: {
            backgroundColor: colors.secondary,
          },
        }}>
          <Stack.Screen name="ScheduleItem" component={Item}
          />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

