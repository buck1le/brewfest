import { View, ScrollView, SafeAreaView, FlatList } from "react-native";
import { Skeleton } from "moti/skeleton";

import { borderRadius, styles } from "./styles";
import { modalVisableAtom } from 'atoms/index';
import { MotiView } from "moti";
import TileModal from "./modal";
import { Atom, useAtom, useAtomValue } from "jotai";
import { Suspense, useCallback } from "react";

const TileColumnSkeleton = () => {
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
  );
};

interface TilesProps<T extends object> {
  data: T[];
  tileLoading: boolean;
  itemAtom: Atom<T | undefined>;
  RenderTileComponent: React.ComponentType<{
    item: T;
  }>;
  RenderModalComponent: React.ComponentType<{ item: T }>;
}


const TileColumn = <T extends object>({
  data,
  itemAtom,
  tileLoading,
  RenderModalComponent,
  RenderTileComponent,
}: TilesProps<T>) => {
  const [modalVisable, setModalVisible] = useAtom(modalVisableAtom);

  const selectedItem = useAtomValue(itemAtom);

  const closeModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  if (tileLoading) {
    return (
      <SafeAreaView>
        <ScrollView contentContainerStyle={styles.tilesColumContainer}>
          {[1, 2, 3].map(index => (
            <TileColumnSkeleton key={index} />
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.tilesColumContainer}>
        <TileModal
          item={selectedItem}
          animationType="slide"
          transparent={true}
          visable={modalVisable}
          onRequestClose={() => closeModal()}
          RenderItem={({ item }: { item: T }) => (
            <RenderModalComponent item={item} />
          )}
        >
          {data.map((item, index) => (
            <RenderTileComponent
              key={index}
              item={item}
            />
          ))}
        </TileModal>
      </ScrollView>
    </SafeAreaView >
  );
}

const TileGridSkeleton = () => {
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
  );
}

const TileGrid = <T extends object>({
  data,
  itemAtom,
  tileLoading,
  RenderModalComponent,
  RenderTileComponent,
}: TilesProps<T>) => {
  const [modalVisable, setModalVisible] = useAtom(modalVisableAtom);

  const selectedItem = useAtomValue(itemAtom);

  const closeModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const keyExtractor = useCallback((item: T, index: number) =>
    `${(item as any).id || index}`, []);

  if (tileLoading) {
    return (
      <SafeAreaView>
        <ScrollView contentContainerStyle={styles.tilesGridContainer}>
          {[1, 2, 3].map(index => (
            <TileColumnSkeleton key={index} />
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <ScrollView
      style={{
        width: '100%',
      }}
      contentContainerStyle={styles.tilesGridContainer}>
      <TileModal
        item={selectedItem}
        animationType="slide"
        transparent={true}
        visable={modalVisable}
        onRequestClose={() => closeModal()}
        RenderItem={({ item }: { item: T }) => (
          <RenderModalComponent item={item} />
        )}
      >
        <Suspense fallback={
          <SafeAreaView>
            <ScrollView contentContainerStyle={styles.tilesGridContainer}>
              {[1, 2, 3].map(index => (
                <TileGridSkeleton key={index} />
              ))}
            </ScrollView>
          </SafeAreaView>
        }>
          <FlatList
            style={{
              width: '100%',
            }}
            columnWrapperStyle={{
              gap: 10,
              justifyContent: 'center',
            }}
            contentContainerStyle={{
              gap: 10,
              alignItems: 'flex-start',
              width: '100%',
            }}
            keyExtractor={keyExtractor}
            scrollEnabled={false}
            numColumns={2}
            data={data}
            renderItem={({ item }) => (
              <RenderTileComponent item={item} />
            )}

          />
        </Suspense>
      </TileModal>
    </ScrollView>
  );
}

export {
  TileColumnSkeleton,
  TileColumn,
  TileGridSkeleton,
  TileGrid,
};
