import React, { useEffect, useState } from 'react';
import { Button, FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Item } from 'components/schedule';
import { styles } from './styles';
import { ScheduleItem } from 'components/schedule/types';


const mockData = [
  { id: '1', title: 'Opening Ceremony', time: '7:00 AM', description: 'Some really long description about the event and why you should come to it' },
  { id: '2', title: 'Keynote Speech', time: '11:00 AM', description: 'Keynote address' },
  { id: '3', title: 'Lunch Break', time: '12:00 PM', description: 'Lunch is served' },
  { id: '4', title: 'Workshop: React Native', time: '1:00 PM', description: 'Hands-on workshop' },
  { id: '5', title: 'Networking Event', time: '3:00 PM', description: 'Meet and greet' },
  { id: '6', title: 'Closing Remarks', time: '5:00 PM', description: 'Summary and closure' },
];

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
  const [data, setData] = useState(mockData);
  const currentItemIndex = getCurrentItemIndex(mockData);

  const fetchSchedule = async () => {
    try {
      const response = await fetch('https://8f12-71-221-77-104.ngrok-free.app/api/schedule', {
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <Button title="Fetch Schedule" onPress={fetchSchedule} />
      <Text style={styles.header}>Schedule</Text>
      <View style={styles.eventList}>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <Item item={item} isCurrent={index === currentItemIndex} />
          )}
          contentContainerStyle={styles.listContainer}
          numColumns={1}
        />
      </View>
    </SafeAreaView>
  );
}

export default Schedule;

