import { View, Text, ScrollView, SafeAreaView, Pressable } from "react-native";
import { Image } from "expo-image";
import { Image as ImageResource, Resource } from 'types/api-responses';
import { Skeleton } from "moti/skeleton";

import { borderRadius, styles } from "./styles";
import { modalVisableAtom } from 'atoms/index';
import { useMemo, useState } from "react";
import { MotiView } from "moti";
import TileModal from "./modal";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useImagesAtom } from "./atoms";


const TileSkeleton = () => {
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
            width={120}
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
  selectedItem: T | null;
  RenderTileComponent: React.ComponentType<{
    item: T;
  }>;
  RenderModalComponent: React.ComponentType<{ item: T }>;
}

const TileColumn = <T extends object>({
  data,
  selectedItem,
  tileLoading,
  RenderModalComponent,
  RenderTileComponent,
}: TilesProps<T>) => {
  const [modalVisable, setModalVisible] = useAtom(modalVisableAtom);

  const closeModal = () => {
    setModalVisible(false);
  }

  if (tileLoading) {
    return (
      <SafeAreaView>
        <ScrollView contentContainerStyle={styles.tilesColumContainer}>
          {[1, 2, 3].map(index => (
            <TileSkeleton key={index} />
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.tilesColumContainer}>
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

export {
  TileSkeleton,
  TileColumn,
};
