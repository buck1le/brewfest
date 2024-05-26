import React from 'react';
import { Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

interface ItemProps {
  item: {
    title: string;
    time: string;
    description: string;
  };
  isCurrent?: boolean;
}

const Item = ({ item, isCurrent }: ItemProps) => {
  return (
    <TouchableOpacity style={[styles.container, isCurrent && styles.currentContainer]}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.time}>{item.time}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff', // White background borderRadius: 10, // Rounded corners
    borderRadius: 10,
    padding: 15, // Padding inside the container
    margin: 5, // Margin between items
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.3, // Shadow opacity
    shadowRadius: 4, // Shadow radius
    elevation: 5, // Android shadow effect
  },
  currentContainer: {
    borderColor: 'blue', // Highlight color
    borderWidth: 2, // Border width for highlighting
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  time: {
    fontSize: 14,
    color: '#666',
  },
  description: {
    fontSize: 14,
    color: '#999',
  },
});

export default Item;

