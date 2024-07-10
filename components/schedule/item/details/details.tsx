import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './styles';
import { ScheduleItem } from 'components/schedule/types';

interface ItemProps {
  item: ScheduleItem
}

const formatDate = (dateTime: string) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateTime).toLocaleDateString('en-US', options);
}

const ItemDetails = ({ item }: ItemProps) => {
  const formattedStartDate = formatDate(item.startDate);
  const formattedEndDate = formatDate(item.endDate);

  return (
    <View>
      <Text>{item.title}</Text>
      <Text>Start: {formattedStartDate}</Text>
      <Text>End: {formattedEndDate}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );
}

export default ItemDetails;
