import { Resource } from 'types/api-responses';


interface BaseTileProps<T = Record<string, Resource>> {
  title: string;
  description: string;
  image: string;
  resources: T
}

interface TileProps<T extends BaseTileProps> {
  item: T;
}

interface VendorTileProps extends BaseTileProps {
  vendor: Resource;
}



const Tile = <T extends BaseTileProps>({ item, onPress }: TileProps<T>) => {
  return (
  );
}

const TileColumn = <T extends BaseTileProps>({ data }: { data: T[] }) => {
  return (
    
  );
}

const TileGrid = <T extends BaseTileProps>({ data }: { data: T[] }) => {
  return (
  );
}

export {
  Tile,
  TileColumn
};
