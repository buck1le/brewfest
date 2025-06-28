import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import * as SplashScreen from 'expo-splash-screen';

import { useFonts } from "expo-font";

import {
  Poppins_400Regular,
  Poppins_700Bold
} from '@expo-google-fonts/poppins';

import { ROOT_RESOURCE } from "types/api-responses";

import MainTabNavigator from "components/tab-nav/tab-navigator";
import TouchableImage from 'components/common/touchable-image';
import Home from 'screens/home';
import { styles, colors } from './styles';
import { MainNavigationProp, RootStackParamList } from "types/navigation";
import { server } from "./mocks/server";
import { selectedEventAtom } from "./atoms";
import { useAtomValue, useSetAtom } from "jotai";
import { modalVisableAtom } from "./atoms";
import { View } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { eventsAtom, useEventsAtom } from "screens/home/atoms";

if (process.env.EXPO_PUBLIC_TEST_SERVER === "true") {
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

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 1500,
  fade: true,
});

const App = () => {
  const [appIsReady, setAppIsReady] = useState(false);
  const modalVisable = useAtomValue(modalVisableAtom);
  
  const eventsFetchAtom = useEventsAtom(ROOT_RESOURCE);
  const events = useAtomValue(eventsFetchAtom);
  const setEvents = useSetAtom(eventsAtom);

  const [fontLoaded, error] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold
  });

  useEffect(() => {
    if (fontLoaded && !events.loading) {
      setEvents(events.data);
      setAppIsReady(true);
    }

  }, [fontLoaded, events.data]);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady || !fontLoaded) {
    return null;
  }

  if (error) {
    // TODO: improve error handling at some point
    console.error(error);
  }

  return (
    <View onLayout={onLayoutRootView} style={{ flex: 1 }}>
      <NavigationContainer
        theme={{
          colors: {
            background: colors.primary,
            primary: colors.primary,
            card: colors.primary,
            border: colors.primary,
            notification: colors.primary,
            text: colors.text,
          },
          dark: true,
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
            },
          },
        }}
      >
        <Stack.Navigator
          initialRouteName="Home"
        >
          <Stack.Group screenOptions={{
            headerShown: false,
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
    </View>
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

