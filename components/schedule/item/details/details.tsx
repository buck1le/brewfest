
import React from 'react';
import { Text, StyleSheet, TouchableOpacity, Dimensions, View } from 'react-native';
import { styles } from './styles';

interface ItemProps {
  item: {
    title: string;
    time: string;
    startDate: string;
    endDate: string;
    description: string;
  };
}

const formatDate = (dateTime: string) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateTime).toLocaleDateString('en-US', options);
}

const ItemDetails = ({ item }: ItemProps) => {
  const formattedStartDate = formatDate(item.startDate);
  const formattedEndDate = formatDate(item.endDate);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{item.title}</Text>
      <Text>Start: {formattedStartDate}</Text>
      <Text>End: {formattedEndDate}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );
}

export default ItemDetails;
