import { modalVisableAtom, selectedEventAtom } from "atoms/index";
import { useAtomValue, useSetAtom } from "jotai";
import { SafeAreaView, Text, View } from "react-native";
import { categoryAtom, useBrewsAtom, writeCategoryAtom } from "./atoms";
import { styles } from "./styles";
import { Category, CateoryTileRow } from "components/common/category";
import { ScrollView } from "moti";
import { TileGrid } from "components/common/tiles";
import { InventoryItem } from "types/api-responses";
import { useState } from "react";
import { DrinkTile } from "components/drinks";
import { VendorModal } from "components/vendors";
import DrinkModal from "components/drinks/modal";

const categories: Category[] = [
  {
    name: 'Sour',
    query: 'sour',
    icon: 'beer-outline',
  },
  {
    name: 'IPA',
    query: 'ipa',
    icon: 'beer-outline',
  },
  {
    name: 'Stout',
    query: 'stout',
    icon: 'beer-outline',
  },
  {
    name: 'Wine',
    query: 'wine',
    icon: 'beer-outline',
  },
  {
    name: 'Other',
    query: 'other',
    icon: 'beer-outline',
  },
];

const filterDrinksByCategory = (drinks: InventoryItem[], category: string) => {
  return drinks.filter(drink => drink.category.includes(category));
}


const Brews = () => {
  const selectedEvent = useAtomValue(selectedEventAtom);
  const selectedCategory = useAtomValue(categoryAtom);
  const setCategoryAtom = useSetAtom(writeCategoryAtom);
  const setModalVisable = useSetAtom(modalVisableAtom);

  if (!selectedEvent) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text>Please select an event</Text>
      </SafeAreaView>
    )
  }

  const brewsAtom = useBrewsAtom(selectedEvent.resources.brews.href);
  const brews = useAtomValue(brewsAtom);

  const [selectedBrew, setSelectedBrew] = useState<InventoryItem | undefined>(undefined);

  if (brews.error || !brews.data) {
    return
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView
          style={{
            maxHeight: 70,
          }}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
          <CateoryTileRow
            categories={categories}
            setCategory={setCategoryAtom}
            selectedCategory={selectedCategory}
            showIcons={false}
          />
        </ScrollView>
        <View style={styles.content}>
          <TileGrid
            data={selectedCategory ?
              filterDrinksByCategory(brews.data, selectedCategory) :
              brews.data
            }
            RenderTileComponent={({ item }: { item: InventoryItem }) => (
              <DrinkTile
                drink={item}
                onPress={() => {
                  setSelectedBrew(item);
                  setModalVisable(true);
                  }
                }
              />
            )}
            RenderModalComponent={({ item }: { item: InventoryItem }) => (
              <DrinkModal item={item} />
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
