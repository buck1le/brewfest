import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { Image } from "expo-image";
import { Image as ImageResource, Vendor } from 'types/api-responses';
import { Skeleton } from "moti/skeleton";

import { borderRadius, styles } from "./styles";
import { useEffect, useState } from "react";
import { MotiView } from "moti";


interface BaseTileProps {
  title: string;
  description: string;
  image: ImageResource;
}

interface TileProps<T extends BaseTileProps> {
  item: T;
  heiglight?: boolean;
  children?: React.ReactNode;
  onClick: (arg: T) => void;
}

const Tile = <T extends BaseTileProps>({
  item,
  heiglight,
  onClick,
  children
}: TileProps<T>) => {
  return (
    <View style={[
      styles.tileContainer,
      heiglight && styles.tileContainerHightlight
    ]}>
      <Image
        style={styles.vendorImage}
        source={{ uri: item.image.url }} />
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
    </View >
  );
}

const TileSkeleton = () => {
  return (
    <View style={styles.tileContainer}>
      <Skeleton.Group show={true}>
        {/* Image skeleton */}
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
  onClick: (arg: T) => void;
}

const TileColumn = <T extends BaseTileProps>({
  data,
  hightlightIndex,
  onClick
}: TilesProps<T>) => {
  const [imagesLoading, setImagesLoading] = useState(false);

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

  if (imagesLoading) {
    return (
      <ScrollView contentContainerStyle={styles.tilesColumContainer}>
        {[1, 2, 3].map(index => (
          <TileSkeleton key={index} />
        ))}
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.tilesColumContainer}>
      {data.map((item, index) => (
        <Tile key={index} item={item} onClick={onClick} heiglight={
          index === hightlightIndex
        }
        />
      ))}
    </ScrollView>
  );
}

const TileGrid = <T extends BaseTileProps>({ data, onClick }: TilesProps<T>) => {
  return (
    <View>
      {data.map((item, index) => (
        <Tile key={index} item={item} onClick={onClick} />
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
