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
  query?: string;
}

type CategoryTileRowProps = {
  categories: Category[];
  selectedCategory?: string;
  showIcons?: boolean;
  setCategory: (category: string | undefined) => void;
};

const CateoryTileRow = ({
  categories,
  selectedCategory,
  showIcons,
  setCategory
}: CategoryTileRowProps) => {
  return (
    <View style={{
      flexDirection: 'row',
      gap: 10,
      paddingInline: 10,
    }}>
      {categories.map((category, i) => (
        <CategoryTile
          showIcon={showIcons}
          setCategory={setCategory}
          selected={selectedCategory === category.query}
          category={category}
          key={i}
        />
      ))}
    </View>
  );
}

interface CategoryTileProps {
  category: Category;
  selected: boolean;
  showIcon?: boolean;
  setCategory: (category: string | undefined) => void;
}

const CategoryTile = ({
  category,
  selected,
  showIcon = true,
  setCategory
}: CategoryTileProps) => {
  const [scale] = useState(new Animated.Value(1));
  const [opacity] = useState(new Animated.Value(1));

  const backgroundColor = selected ?
    'lightblue' :
    'white';

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
        minHeight: 24,
        gap: 5,
      }}>
        {showIcon && (
          <Ionicons
            name={category.icon}
            size={24}
            color="black" />
        )
        }
        <Text>
          {category.name}
        </Text>
      </View>
    </Animated.View>
  );

  return (
    <Pressable
      onPress={() => setCategory(category.query)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}>
      {content}
    </Pressable>
  );
};

export default CateoryTileRow;
