import { Text, View } from 'react-native';
import { styles } from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CateoryTileRow, Category } from 'components/common/category';
import { categoryAtom, useVendorsAtom, writeCategoryAtom } from './atoms';
import { useAtomValue, useSetAtom } from 'jotai';
import { modalVisableAtom, selectedEventAtom } from 'atoms/index';
import { Vendor } from 'types/api-responses';
import { TileColumn } from 'components/common/tiles';
import { VendorModal, VendorTile } from 'components/vendors';
import { useImagesAtom } from 'components/common/atoms';
import { Suspense, useMemo, useState } from 'react';
import { BREW_FEST_IMAGE_HOST } from 'lib/request';

const categories: Category[] = [
  {
    name: 'Drinks',
    query: 'beverage',
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

  const setModalVisable = useSetAtom(modalVisableAtom);

  const [selectedItem, setSelectedItem] = useState<Vendor | null>(null);

  if (vendors.error || !vendors.data) {
    return
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
            RenderModalComponent={({ item }: { item: Vendor }) => (
              <VendorModal item={item} />
            )}
            RenderTileComponent={({ item }: { item: Vendor }) => (
              <Suspense fallback={<Text>Loading...</Text>}>
                <VendorTile
                  key={item.id}
                  item={item}
                  onPress={() => {
                    setSelectedItem(item);
                    setModalVisable(true);
                  }
                  }
                />
              </Suspense>
            )}
            selectedItem={selectedItem}
            tileLoading={vendors.loading}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Vendors;
