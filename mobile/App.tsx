import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';

import MainTabNavigator from "components/tab-nav/tab-navigator";
import TouchableImage from 'common/touchable-image';
import Item from "screens/schedule/item";
import Home from 'screens/home';
import { styles, colors } from './styles';
import { MainNavigationProp, RootStackParamList } from "types/navigation";

const Stack = createStackNavigator<RootStackParamList>();

const LogoTitle = () => {
  const navigation = useNavigation<MainNavigationProp>();

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
          <Stack.Screen name="Home" component={Home} />
        </Stack.Group>
        <Stack.Group screenOptions={{
          headerTransparent: true,
          headerLeft: () => <LogoTitle />,
          headerLeftContainerStyle: styles.leftHeader,
          headerTitle: '',
          }}>
          <Stack.Screen name="Main" component={MainTabNavigator} />
        </Stack.Group>
        <Stack.Group screenOptions={{
          presentation: 'card',
          headerShadowVisible: false,
          headerTransparent: true,
          headerTitle: '',
          headerBackTitle: 'Schedule',
        }}>
          <Stack.Screen name="ScheduleItem" component={Item}
          />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

