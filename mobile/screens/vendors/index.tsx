import { Text, View } from 'react-native';
import { styles } from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CateoryTileRow, Category } from 'components/common/category';
import { categoryAtom, useVendorsAtom, writeCategoryAtom } from './atoms';
import { useAtomValue, useSetAtom } from 'jotai';
import { selectedEventAtom } from 'atoms/index';
import { Vendor } from 'types/api-responses';
import { TileColumn } from 'components/common/tiles';
import { useState } from 'react';

const categories: Category[] = [
  {
    name: 'Drinks',
    query: 'drinks',
    icon: 'beer-outline',
  },
  {
    name: 'Food',
    query: 'food',
    icon: 'fast-food-outline',
  },
  {
    name: 'Shop',
    query: 'shop',
    icon: 'pricetags-outline',
  },
];


const filterVedorByCategory = (vendors: Vendor[], category: string) => {
  return vendors.filter(vendor => vendor.category.includes(category));
}

const Vendors = () => {
  const selectedEvent = useAtomValue(selectedEventAtom);
  const selectedCategory = useAtomValue(categoryAtom);
  const setCategoryAtom = useSetAtom(writeCategoryAtom);

  if (!selectedEvent) {
    return <Text>Please select an event</Text>
  }

  const vendorsAtom = useVendorsAtom(selectedEvent.resources.vendors.href);
  const vendors = useAtomValue(vendorsAtom);

  if (vendors.loading) {
    return <Text>Loading...</Text>
  }

  if (vendors.error) {
    return <Text>Error: {vendors.error}</Text>
  }

  if (!vendors.data) {
    return <Text>No data</Text>
  }

  const navigateToVendor = (vendor: Vendor) => {
    console.log('Navigate to vendor', vendor);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <CateoryTileRow
          categories={categories}
          setCategory={setCategoryAtom}
          selectedCategory={selectedCategory}
        />
        <View style={styles.content}>
          <TileColumn
            data={selectedCategory ?
              filterVedorByCategory(vendors.data, selectedCategory)
              : vendors.data
            }
            onClick={navigateToVendor} />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Vendors;
