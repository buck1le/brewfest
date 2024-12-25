import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';

import MainTabNavigator from "components/tab-nav/tab-navigator";
import TouchableImage from 'components/common/touchable-image';
import Home from 'screens/home';
import { styles, colors } from './styles';
import { MainNavigationProp, RootStackParamList } from "types/navigation";
import { server } from "./mocks/server";
import { selectedEventAtom } from "./atoms";
import { useAtomValue } from "jotai";
import { modalVisableAtom } from "./atoms";
import { View } from "react-native";

if (false) {
  server.listen({
    onUnhandledRequest: 'bypass',
  });
}

const Stack = createStackNavigator<RootStackParamList>();

const LogoTitle = () => {
  const navigation = useNavigation<MainNavigationProp>();
  const selectedEvent = useAtomValue(selectedEventAtom);

  return (
    <TouchableImage
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
        navigation.navigate('Home')
      }
      }
      image={selectedEvent?.thumbnail}
      style={styles.headerImage}
    />
  );
}

const App = () => {
  const modalVisable = useAtomValue(modalVisableAtom);

  return (
    <>
      <NavigationContainer
        theme={{
          colors: {
            background: colors.primary,
          },
          fonts: {
            regular: {
              fontFamily: 'Montserrat-Regular',
              fontWeight: 'normal',
            },
            medium: {
              fontFamily: 'Montserrat-Medium',
              fontWeight: 'normal',
            },
            heavy: {
              fontFamily: 'Montserrat-Heavy',
              fontWeight: 'normal',
            },
            bold: {
              fontFamily: 'Montserrat-Bold',
              fontWeight: 'normal',
            }
          },
        }}
      >
        <Stack.Navigator
          initialRouteName="Home"
        >
          <Stack.Group screenOptions={{
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
        </Stack.Navigator>
      </NavigationContainer>
      {modalVisable && <Overlay />}
    </>
  );
}

const Overlay = () => (
  <View style={{
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  }} />
);

export default App;

