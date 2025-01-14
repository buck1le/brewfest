import { selectedEventAtom } from "atoms/index";
import { useAtomValue, useSetAtom } from "jotai";
import { SafeAreaView, Text, View } from "react-native";
import { categoryAtom, useBrewsAtom, writeCategoryAtom } from "./atoms";
import { styles } from "./styles";
import { Category, CateoryTileRow } from "components/common/category";
import { ScrollView } from "moti";
import { TileGrid } from "components/common/tiles";
import { InventoryItem } from "types/api-responses";
import { useState } from "react";

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
  {
    name: 'Shop',
    query: 'shop',
    icon: 'pricetags-outline',
  },
  {
    name: 'Shop',
    query: 'shop',
    icon: 'pricetags-outline',
  },
  {
    name: 'Shop',
    query: 'shop',
    icon: 'pricetags-outline',
  },
];

const Brews = () => {
  const selectedEvent = useAtomValue(selectedEventAtom);

  if (!selectedEvent) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text>Please select an event</Text>
      </SafeAreaView>
    )
  }

  const brewsAtom = useBrewsAtom(selectedEvent.resources.brews.href);
  const brews = useAtomValue(brewsAtom);

  const selectedCategory = useAtomValue(categoryAtom);
  const setCategoryAtom = useSetAtom(writeCategoryAtom);

  const [selectedBrew, setSelectedBrew] = useState<InventoryItem | undefined>(undefined);

  if (brews.error || !brews.data) {
    return
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView
          horizontal={true}
          style={{
            paddingLeft: 10,
          }}
        >
          <CateoryTileRow
            categories={categories}
            setCategory={setCategoryAtom}
            selectedCategory={selectedCategory}
          />
        </ScrollView>
        <View style={styles.content}>
          <TileGrid
            data={brews.data}
            RenderTileComponent={({ item }: { item: InventoryItem }) => (
              <Text>{item.name}</Text>
            )}
            RenderModalComponent={({ item }: { item: InventoryItem }) => (
              <Text>{item.name}</Text>
            )}
            selectedItem={selectedBrew}
            tileLoading={brews.loading}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Brews;
