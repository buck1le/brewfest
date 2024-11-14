import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { Image } from "expo-image";
import { Image as ImageResource, Vendor } from 'types/api-responses';

import { styles } from "./styles";
import { useEffect, useState } from "react";


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
      <View style={styles.tilesColumContainer}>
        <ActivityIndicator size="large" />
      </View>
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
  TileColumn,
  TileGrid,
};
