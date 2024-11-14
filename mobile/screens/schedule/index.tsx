import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import { ScheduleItem } from 'types/api-responses';
import { ScheduleNavigationProp } from './types';
import { useAtomValue } from 'jotai';
import { selectedEventAtom } from 'atoms/index';
import { useScheduleAtom } from './atoms';
import { TileColumn } from 'components/common/tiles';

const parseTime = (timeString: string): number => {
  return new Date(timeString).getTime();
};

const getCurrentItemIndex = (data: ScheduleItem[]): number => {
  const currentTime = new Date().getTime();

  const parsedData = data.map((item, index) => {
    const startTime = parseTime(item.startTime);
    const nextStartTime = data[index + 1]
      ? parseTime(data[index + 1].startTime)
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

const Schedule = ({ navigation }: ScheduleProps) => {
  const selectedEvent = useAtomValue(selectedEventAtom);
  const [, setTick] = useState(0); // Add this line

  useEffect(() => {
    const timer = setInterval(() => {
      setTick(prev => prev + 1); // This will trigger a re-render every second
    }, 1000);

    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

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

  const hightlightIndex = getCurrentItemIndex(schedule.data);

  console.log('hightlightIndex', hightlightIndex);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.eventList}>
        <TileColumn
          data={schedule.data}
          onClick={handleItemPress}
          hightlightIndex={hightlightIndex}
        />
      </View>
    </SafeAreaView>
  );
}

export default Schedule;

