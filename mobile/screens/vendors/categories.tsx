import { Text, View } from 'react-native';
import { styles } from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CateoryTileRow, Category } from 'components/common/category';
import { useVendorsAtom } from './atoms';
import { useAtomValue } from 'jotai';
import { selectedEventAtom } from 'atoms/index';
import { Vendor } from 'types/api-responses';

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
const Vendors = () => {
  const selectedEvent = useAtomValue(selectedEventAtom);

  if (!selectedEvent) {
    return <Text>Please select an event</Text>;
  }

  const vendorsAtom = useVendorsAtom(selectedEvent.resources.vendors.href);
  const vendors = useAtomValue(vendorsAtom);

  if (vendors.loading) {
    return <Text>Loading...</Text>;
  }

  if (vendors.error) {
    return <Text>Error: {vendors.error}</Text>;
  }

  if (!vendors.data) {
    return <Text>No data</Text>;
  }

  const navigateToVendor = (vendor: Vendor) => {
    console.log('Navigate to vendor', vendor);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <CateoryTileRow categories={categories} />
        <View style={styles.content}>
          <TileColumn data={vendors.data} onClick={navigateToVendor} />
        </View>
      </View>
    </SafeAreaView>
  );
};
export default Vendors;

