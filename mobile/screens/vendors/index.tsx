import { Text, View } from 'react-native';
import { styles, borderRadius } from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CateoryTileRow, Category } from 'components/common/category';
import { categoryAtom, useVendorsAtom, writeCategoryAtom } from './atoms';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { modalVisableAtom, selectedEventAtom } from 'atoms/index';
import { Vendor } from 'types/api-responses';
import { TileColumn } from 'components/common/tiles';
import { VendorModal, VendorTile } from 'components/vendors';
import { useCallback, useState } from 'react';
import { Skeleton } from "moti/skeleton";
import { MotiView } from "moti";

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

const VendorsLoadingSkeleton = () => {
  return (
    <View style={styles.tileContainer}>
      <Skeleton.Group show={true}>
        <Skeleton
          width={200}
          height={130}
          radius={borderRadius}
          colorMode="light"
        />

        <MotiView style={styles.textContainer}>
          <Skeleton
            width={130}
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
  )
}

const selectedVendorAtom = atom<Vendor | undefined>(undefined);

const Vendors = () => {
  const selectedEvent = useAtomValue(selectedEventAtom);
  const selectedCategory = useAtomValue(categoryAtom);
  const setCategoryAtom = useSetAtom(writeCategoryAtom);

  if (!selectedEvent) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text>Please select an event</Text>
      </SafeAreaView>
    )
  }

  const vendorsAtom = useVendorsAtom(selectedEvent.resources.vendors.href);
  const vendors = useAtomValue(vendorsAtom);
  const setModalVisable = useSetAtom(modalVisableAtom);

  const setSelectedItem= useSetAtom(selectedVendorAtom);

  const setSelectedItemCallback = useCallback((item: Vendor) => {
    setSelectedItem(item);
    setModalVisable(true);
  }, []);

  if (vendors.loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <CateoryTileRow
            categories={categories}
            setCategory={setCategoryAtom}
            selectedCategory={selectedCategory}
          />
          <View style={styles.skeletonContainer}>
            <VendorsLoadingSkeleton />
            <VendorsLoadingSkeleton />
            <VendorsLoadingSkeleton />
          </View>
        </View>
      </SafeAreaView>
    )
  }

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
              <VendorTile
                key={item.id}
                item={item}
                onPress={() => setSelectedItemCallback(item)}
              />
            )}
            itemAtom={selectedVendorAtom}
            tileLoading={vendors.loading}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Vendors;
