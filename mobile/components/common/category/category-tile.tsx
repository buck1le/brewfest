import {
  Text,
  Animated,
  View,
  Pressable
} from 'react-native';

import React, { useState } from 'react';

import { Ionicons } from '@expo/vector-icons';
import { styles } from './category-tile-styles';

type IconNames = keyof typeof Ionicons.glyphMap;

export interface Category {
  name: string;
  icon: IconNames;
  onPress: () => void;
}

type CategoryTileRowProps = {
  categories: Category[];
};

const CateoryTileRow = ({ categories }: CategoryTileRowProps) => {
  return (
    <View style={{
      flexDirection: 'row',
      gap: 10,
    }}>
      <View style={{
        flexDirection: 'row',
        gap: 10,
      }}>
        {categories.map((category, i) => (
          <CategoryTile
            category={category}
            key={i}
          />
        ))}
      </View>
    </View>
  );
}

const CategoryTile = ({ category }: { category: Category }) => {
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
          backgroundColor,
          transform: [{ scale }],
          opacity,
          marginBottom: 20,
        },
      ]}
    >
      <View style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
      }}>
        <Ionicons
          name={category.icon}
          size={24}
          color="black" />
        <Text>
          {category.name}
        </Text>
      </View>
    </Animated.View>
  );

  return (
    <Pressable onPress={() => null} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      {content}
    </Pressable>
  );
};

export default CateoryTileRow;
