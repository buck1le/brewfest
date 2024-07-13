import React, { useState } from 'react';
import { Animated, Platform, View, TouchableNativeFeedback, Pressable } from 'react-native';
import { styles } from './styles';

interface ButtonProps {
  children: React.ReactNode;
  onPress: () => void;
}

const Button = ({ children, onPress }: ButtonProps) => {
  const [scale] = useState(new Animated.Value(1));
  const [opacity] = useState(new Animated.Value(1));

  const backgroundColor = scale.interpolate({
    inputRange: [0.98, 1],
    outputRange: ['rgb(210, 230, 255)', 'white'],
  });

  const animateScale = (newScale: number) => {
    Animated.spring(scale, {
      toValue: newScale,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const animateOpacity = (newOpacity: number) => {
    Animated.timing(opacity, {
      toValue: newOpacity,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressIn = () => {
    animateScale(0.95);
  };

  const handlePressOut = () => {
    animateScale(1);
    animateOpacity(1);
  };

  const content = (
    <Animated.View
      style={[
      styles.button,
        {
          padding: 10,
          borderRadius: 5,
          backgroundColor,
          transform: [{ scale }],
          opacity
        },
      ]}
    >
      {children}
    </Animated.View>
  );

  if (Platform.OS === 'android') {
    return (
      <TouchableNativeFeedback
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        background={TouchableNativeFeedback.Ripple('rgba(0, 0, 0, .32)', false)}
        useForeground={TouchableNativeFeedback.canUseNativeForeground()}
      >
        <View style={styles.button}>{content}</View>
      </TouchableNativeFeedback>
    );
  }

  return (
    <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      {content}
    </Pressable>
  );
};

export default Button;


