import React, { useEffect, useState } from 'react';
import { Button, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import { ScheduleItem } from 'components/schedule/types';
import { useNavigation } from '@react-navigation/native'; 
import ItemCard from 'components/schedule/item/card/card';


const parseTime = (timeString: string) => {
  const [time, modifier] = timeString.split(' ');
  let [hours, minutes] = time.split(':').map(Number);

  if (hours === 12) {
    hours = 0;
  }
  if (modifier === 'PM') {
    hours += 12;
  }
  return new Date().setHours(hours, minutes);
};

const getCurrentItemIndex = (data: ScheduleItem[]) => {
  const currentTime = new Date().getTime();

  const parsedData = data.map((item, index) => {
    const startTime = parseTime(item.time);
    const nextStartTime = data[index + 1]
      ? parseTime(data[index + 1].time)
      : Infinity;

    return { startTime, nextStartTime };
  });

  return parsedData.findIndex(({ startTime, nextStartTime }) => {
    return currentTime >= startTime && currentTime < nextStartTime;
  });
};


const Schedule = () => {
  const [data, setData] = useState<ScheduleItem[]>([]);
  const currentItemIndex = getCurrentItemIndex([]);
  const navigation = useNavigation();

  const fetchSchedule = async () => {
    try {
      const response = await fetch('https://d02e-71-221-88-171.ngrok-free.app/api/schedule', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchSchedule();
  }, []);

  const handleItemPress = (item: ScheduleItem) => {
    console.log('item', item);
    navigation.navigate('ScheduleItem', { item });
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Button title="Fetch Schedule" onPress={fetchSchedule} />
      <Text style={styles.header}>Schedule</Text>
      <View style={styles.eventList}>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
          <TouchableOpacity 
            onPress={() => handleItemPress(item)}>
            <ItemCard item={item} isCurrent={index === currentItemIndex} />
          </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContainer}
          numColumns={1}
        />
      </View>
    </SafeAreaView>
  );
}

export default Schedule;

