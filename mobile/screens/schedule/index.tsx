import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles, borderRadius } from './styles';
import { ScheduleItem } from 'types/api-responses';
import { atom, useAtomValue, useSetAtom } from 'jotai';
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

const selectedScheduleItemAtom = atom<ScheduleItem | undefined>(undefined);


const Schedule = () => {
  const selectedEvent = useAtomValue(selectedEventAtom);

  if (!selectedEvent) {
    return <Text>Please select an event</Text>
  }

  const scheduleAtom = useScheduleAtom(selectedEvent.resources.schedule.href);
  const scheduleItems = useAtomValue(scheduleAtom);

  const setSelectedItem = useSetAtom(selectedScheduleItemAtom);
  const setModalVisable = useSetAtom(modalVisableAtom);

  if (scheduleItems.loading) {
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

  if (scheduleItems.error || !scheduleItems.data) {
    return
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.eventList}>
        <View style={{ flex: 1 }}>
          <TileColumn
            data={scheduleItems.data}
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
            tileLoading={scheduleItems.loading}
            itemAtom={selectedScheduleItemAtom}
          />
        </View>

      </View>
    </SafeAreaView>
  );
}

export default Schedule;

