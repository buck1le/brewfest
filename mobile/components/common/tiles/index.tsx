import { View, Text, ScrollView, SafeAreaView, Pressable } from "react-native";
import { Image } from "expo-image";
import { Image as ImageResource } from 'types/api-responses';
import { Skeleton } from "moti/skeleton";

import { borderRadius, styles } from "./styles";
import { modalVisableAtom } from 'atoms/index';
import { useEffect, useState } from "react";
import { MotiView } from "moti";
import TileModal from "./modal";
import { useAtom } from "jotai";


export interface BaseTileProps {
  title: string;
  description: string;
  image: ImageResource;
}

interface TileProps<T extends BaseTileProps> {
  item: T;
  highlight?: boolean;
  children?: React.ReactNode;
  onClick: (item: T) => void;
}

const Tile = <T extends BaseTileProps>({
  item,
  highlight,
  onClick,
  children
}: TileProps<T>) => {
  return (
    <Pressable
      style={[styles.tileContainer,
      highlight && styles.tileContainerHightlight]}
      onPress={() => onClick(item)}>
      <Image
        style={styles.vendorImage}
        source={{ uri: item.image.url }}
      />
      <View style={styles.textContainer}>
        <Text style={{
          fontSize: 18,
          fontWeight: 'bold',
        }}>
          {item.title}
        </Text>
        <Text style={{
          marginTop: 5,
        }}>
          {item.description}
        </Text>
        {children}
      </View>
    </Pressable>
  );
}

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

interface TilesProps<T extends BaseTileProps> {
  data: T[];
  hightlightIndex?: number;
}

type NullableItem<T extends BaseTileProps> = T | null;

const TileColumn = <T extends BaseTileProps>({
  data,
  hightlightIndex,
}: TilesProps<T>) => {
  const [imagesLoading, setImagesLoading] = useState(false);
  const [modelVisible, setModalVisible] = useAtom(modalVisableAtom);
  const [selectedItem, setSelectedItem] = useState<NullableItem<T>>(null);

  useEffect(() => {
    const loadImages = async () => {
      setImagesLoading(true);

      try {
        await Image.prefetch(data.map(item => item.image.url));
      } finally {
        setImagesLoading(false);
      }
    }
    loadImages();

    return () => {
      setImagesLoading(false);
    }
  }, []);

  const openModal = (item: T) => {
    setSelectedItem(item);
    setModalVisible(true);
  }

  if (imagesLoading) {
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
          animationType="fade"
          transparent={true}
          visable={modelVisible && selectedItem !== null}
          onRequestClose={() => setModalVisible(false)}
          item={selectedItem}
        >
          {data.map((item, index) => (
            <Tile
              key={index}
              item={item}
              onClick={openModal}
              highlight={index === hightlightIndex
              }
            />
          ))}
        </TileModal>
      </ScrollView>
    </SafeAreaView >
  );
}

const TileGrid = <T extends BaseTileProps>({ data }: TilesProps<T>) => {
  return (
    <View>
      {data.map((item, index) => (
        <Tile key={index} item={item} />
      ))}
    </View>
  );
}

export {
  Tile,
  TileSkeleton,
  TileColumn,
  TileGrid,
};
