import React, { useEffect, useState } from 'react';
import { Button, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import { ScheduleItem } from 'components/schedule/types';
import ItemCard from 'components/schedule/item/card/card';
import { ScheduleNavigationProp } from './types';


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

interface ScheduleProps {
  navigation: ScheduleNavigationProp;
}

const Schedule = ( { navigation }: ScheduleProps ) => {
  const [data, setData] = useState<ScheduleItem[]>([]);
  const currentItemIndex = getCurrentItemIndex([]);

  const fetchSchedule = async () => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/events/5/schedule`, {
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
    navigation.navigate('ScheduleItem', { item });
  }

  return (
    <SafeAreaView style={styles.safeArea}>
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

