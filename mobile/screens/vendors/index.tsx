import { Text, View } from 'react-native';
import { styles } from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CateoryTileRow, Category } from 'components/common/category';
import { Tile, TileColumn } from 'components/common/tiles';
import { useVendorsAtom } from './atoms';
import { useAtomValue } from 'jotai';

const categories: Category[] = [
  {
    name: 'Drinks',
    onPress: () => console.log('Drinks'),
    icon: 'beer-outline',
  },
  {
    name: 'Food',
    onPress: () => console.log('Food'),
    icon: 'fast-food-outline',
  },
  {
    name: 'Shop',
    onPress: () => console.log('Shop'),
    icon: 'pricetags-outline',
  },
];

interface VendorsProps {
  href: string;
}

const Vendors = ({ href }: VendorsProps) => {
  const vendorsAtom = useVendorsAtom(href);
  const vendors = useAtomValue(vendorsAtom);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <CateoryTileRow categories={categories} />
        <View style={styles.content}>
        </View>
      </View>
    </SafeAreaView>);
}

export default Vendors;
