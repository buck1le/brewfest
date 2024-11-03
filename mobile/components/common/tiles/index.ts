import { styles } from './styles';

import { View, Text, Image } from 'react-native';

interface TileProps {
  title: string;
  description: string;
  image: string;
}

type TilesProps = {
  tiles: TileProps[];
}

const Tile = ({ title, description, image }: TileProps) => {
  return (
  );
}

const TileColumn = ({ tiles }: TilesProps) => {
  return (
    
  );
}

const TileGrid = ({ tiles }: TilesProps) => {
  return (
  );
}

export {
  Tile,
  TileColumn
};
