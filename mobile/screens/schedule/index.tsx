import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles, borderRadius } from './styles';
import { ScheduleItem } from 'types/api-responses';
import { useAtomValue, useSetAtom } from 'jotai';
import { modalVisableAtom, selectedEventAtom } from 'atoms/index';
import { useScheduleAtom } from './atoms';
import { TileColumn } from 'components/common/tiles';
import { ScheduleTile } from 'components/schedule-items';
import ScheduleModal from 'components/schedule-items/modal';
import { Skeleton } from 'moti/skeleton';
import { MotiView } from 'moti';

const ScheduleLoadingSkeleton = () => {
  return (
    <View style={styles.tileContainer}>
      <Skeleton.Group show={true}>
        <Skeleton
          width={200}
          height={130}
          radius={borderRadius}
          colorMode="light"
        />

        <MotiView style={styles.textContainer}>
          <Skeleton
            width={130}
            height={20}
            radius={4}
            colorMode="light"
          />

          <View style={{
            marginTop: 8,
            gap: 4,
          }}>
            <Skeleton
              width={120}
              height={12}
              radius={4}
              colorMode="light"
            />
            <Skeleton
              width={120}
              height={12}
              radius={4}
              colorMode="light"
            />
          </View>
        </MotiView>
      </Skeleton.Group>
    </View>
  )
}


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
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.skeletonContainer}>
            <ScheduleLoadingSkeleton />
            <ScheduleLoadingSkeleton />
            <ScheduleLoadingSkeleton />
          </View>
        </View>
      </SafeAreaView>
    )
  }

  if (schedule_items.error || !schedule_items.data) {
    return
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

