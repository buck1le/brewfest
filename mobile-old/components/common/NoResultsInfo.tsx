import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Or your preferred icon library

interface NoResultsInfoProps {
  iconName?: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
}

export const NoResultsInfo = ({
  iconName = 'search-outline',
  title,
  message,
}: NoResultsInfoProps) => {
  return (
    <View style={styles.container}>
      <Ionicons name={iconName} size={64} color="#333" />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    marginTop: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 18,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 22,
  },
});

