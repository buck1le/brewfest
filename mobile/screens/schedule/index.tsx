import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import { ScheduleItem } from 'types/api-responses';
import { ScheduleNavigationProp } from './types';
import { useAtomValue } from 'jotai';
import { selectedEventAtom } from 'atoms/index';
import { useScheduleAtom } from './atoms';
import { TileColumn } from 'components/common/tiles';
import { useImagesAtom } from 'components/common/atoms';
import { ScheduleTile } from 'components/schedule-items';

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

const Schedule = () => {
  const selectedEvent = useAtomValue(selectedEventAtom);

  if (!selectedEvent) {
    return <Text>Please select an event</Text>
  }

  const scheduleAtom = useScheduleAtom(selectedEvent.resources.schedule.href);
  const schedule_items = useAtomValue(scheduleAtom);

  const [selectedItem, setSelectedItem] = useState<ScheduleItem | null>(null);
  const [modalVisable, setModalVisable] = useState(false);

  const imagesAtom = useImagesAtom(schedule_items.data?.map(item => item.image.url));
  const images = useAtomValue(imagesAtom);

  if (schedule_items.loading) {
    return <Text>Loading...</Text>
  }

  if (!schedule_items.data) {
    return <Text>No data</Text>
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.eventList}>
        <View style={styles.content}>
          <TileColumn
            data={schedule_items.data}
            RenderModalComponent={({ item }: { item: ScheduleItem }) => (
              <ScheduleItemModal item={item} />
            )}
            RenderTileComponent={({ item }: { item: ScheduleItem }) => (
              <ScheduleTile
                key={item.id}
                item={item}
                onPress={() => {
                  setSelectedItem(item);
                  setModalVisable(true);
                }
                }
              />
            )}
            selectedItem={selectedItem}
            tileLoading={schedule_items.loading || images.loading}
          />
        </View>

      </View>
    </SafeAreaView>
  );
}

export default Schedule;

