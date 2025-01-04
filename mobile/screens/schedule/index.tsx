import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import { ScheduleItem } from 'types/api-responses';
import { useAtomValue, useSetAtom } from 'jotai';
import { modalVisableAtom, selectedEventAtom } from 'atoms/index';
import { useScheduleAtom } from './atoms';
import { TileColumn } from 'components/common/tiles';
import { ScheduleTile } from 'components/schedule-items';
import ScheduleModal from 'components/schedule-items/modal';


const Schedule = () => {
  const selectedEvent = useAtomValue(selectedEventAtom);

  if (!selectedEvent) {
    return <Text>Please select an event</Text>
  }

  const scheduleAtom = useScheduleAtom(selectedEvent.resources.schedule.href);
  const schedule_items = useAtomValue(scheduleAtom);

  const [selectedItem, setSelectedItem] = useState<ScheduleItem | null>(null);
  const setModalVisable = useSetAtom(modalVisableAtom);

  if (schedule_items.loading) {
    return <Text>Loading...</Text>
  }

  if (!schedule_items.data) {
    return <Text>No data</Text>
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.eventList}>
        <View style={{ flex: 1 }}>
          <TileColumn
            data={schedule_items.data}
            RenderModalComponent={({ item }: { item: ScheduleItem }) => (
              <ScheduleModal item={item} />
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
            tileLoading={schedule_items.loading}
          />
        </View>

      </View>
    </SafeAreaView>
  );
}

export default Schedule;

