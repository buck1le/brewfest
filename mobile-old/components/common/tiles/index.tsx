import { View, ScrollView, SafeAreaView, FlatList, Dimensions } from "react-native";
import { Skeleton } from "moti/skeleton";

import { borderRadius, styles } from "./styles";
import { modalVisableAtom } from 'atoms/index';
import { MotiView } from "moti";
import TileModal from "./modal";
import { Atom, useAtom, useAtomValue } from "jotai";
import { Suspense, useCallback } from "react";

const width = Dimensions.get("window").width;

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
    <View
      style={{
        flex: 1,
        marginInline: 10,
      }}
    >
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
          <View style={{
            width: '100%',
            flex: 1,
          }}>
            <FlatList
              style={{
                width: '100%',
              }}
              columnWrapperStyle={{
                gap: 10,
              }}
              contentContainerStyle={{
                gap: 10,
                alignItems: 'flex-start',
                flexGrow: 1,
                paddingBottom: 300,
              }}
              keyExtractor={keyExtractor}
              scrollEnabled={true}
              showsVerticalScrollIndicator={false}
              numColumns={2}
              data={data}
              renderItem={({ item }) => (
                <RenderTileComponent item={item} />
              )}

            />

          </View>
        </Suspense>
      </TileModal>
    </View>
  );
}

export {
  TileColumnSkeleton,
  TileColumn,
  TileGridSkeleton,
  TileGrid,
};
