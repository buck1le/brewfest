import React, { useEffect } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import { ScheduleItem } from 'components/schedule/types';
import ItemCard from 'components/schedule/item/card/card';
import { ScheduleNavigationProp } from './types';
import { useAtomValue } from 'jotai';
import { selectedEventAtom } from 'atoms/index';
import { useScheduleAtom } from './atoms';


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
  const selectedEvent = useAtomValue(selectedEventAtom);

  if (!selectedEvent) {
    return <Text>Please select an event</Text>
  }

  const scheduleAtom = useScheduleAtom(selectedEvent.resources.schedule.href);
  const schedule = useAtomValue(scheduleAtom);

  const handleItemPress = (item: ScheduleItem) => {
    navigation.navigate('ScheduleItem', { item });
  }

  if (schedule.loading) {
    return <Text>Loading...</Text>
  }

  if (!schedule.data) {
    return <Text>No data</Text>
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.eventList}>
        <FlatList
          data={schedule}
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

