import { View, Text } from "react-native";
import { Image, Resource } from 'types/api-responses';


interface BaseTileProps {
  title: string;
  description: string;
  image: Image[];
}

interface TileProps<T extends BaseTileProps> {
  item: T;
  onClick: (arg: T) => void;
}

const Tile = <T extends BaseTileProps>({ item, onClick }: TileProps<T>) => {
  return (
    <View>
      <Text>{item.title}</Text>
    </View >
  );
}

interface TilesProps<T extends BaseTileProps> {
  data: T[];
  onClick: (arg: T) => void;
}

const TileColumn = <T extends BaseTileProps>({ data, onClick }: TilesProps<T>) => {
  return (
    <View>
      {data.map((item, index) => (
        <Tile key={index} item={item} onClick={onClick} />
      ))}
    </View>
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
