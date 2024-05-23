import { View, Text, TouchableOpacity } from 'react-native';

import {
  NavigationHelpers,
  TabNavigationState,
  ParamListBase,
  Descriptor,
} from '@react-navigation/native';

interface MyTabBarProps {
  state: TabNavigationState<ParamListBase>;
  descriptors: {
    [key: string]: Descriptor<any, any, any>
  };
  navigation: NavigationHelpers<ParamListBase>;
}

export default function MyTabBar({ state, descriptors, navigation }: MyTabBarProps) {
  return (
    <View style={{ flexDirection: 'row' }}>
      {state.routes.map((route, index) => {
        console.log(route);
        console.log(index);
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1 }}
          >
            <Text style={{ color: isFocused ? '#673ab7' : '#222' }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
