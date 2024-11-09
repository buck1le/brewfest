import { View, Text, ScrollView, Image } from "react-native";
import { Image as ImageResource } from 'types/api-responses';

import { styles } from "./styles";


interface BaseTileProps {
  title: string;
  description: string;
  image: ImageResource;
}

interface TileProps<T extends BaseTileProps> {
  item: T;
  onClick: (arg: T) => void;
}

const Tile = <T extends BaseTileProps>({ item, onClick }: TileProps<T>) => {
  return (
    <View style={styles.tileContainer}>
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
      </View>
    </View >
  );
}

interface TilesProps<T extends BaseTileProps> {
  data: T[];
  onClick: (arg: T) => void;
}

const TileColumn = <T extends BaseTileProps>({ data, onClick }: TilesProps<T>) => {
  return (
    <ScrollView contentContainerStyle={styles.tilesColumContainer}>
      {data.map((item, index) => (
        <Tile key={index} item={item} onClick={onClick} />
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
