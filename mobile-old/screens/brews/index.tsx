import { modalVisableAtom, selectedEventAtom } from "atoms/index";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { ActivityIndicator, SafeAreaView, Text, View } from "react-native";
import { categoryAtom, useBrewsAtom, writeCategoryAtom } from "./atoms";
import { styles } from "./styles";
import { Category, CateoryTileRow } from "components/common/category";
import { ScrollView } from "moti";
import { TileGrid } from "components/common/tiles";
import { InventoryItem } from "types/api-responses";
import { useCallback } from "react";
import { DrinkTile } from "components/drinks";
import DrinkModal from "components/drinks/modal";
import { NoResultsInfo } from "components/common/NoResultsInfo";

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
  const lowerCaseCategory = category.toLowerCase();
  return drinks.filter(drink =>
    drink.category.toLowerCase().includes(lowerCaseCategory)
  );
}

const selectedBrewAtom = atom<InventoryItem | undefined>(undefined);

const Brews = () => {
  const selectedEvent = useAtomValue(selectedEventAtom);
  const selectedCategory = useAtomValue(categoryAtom);
  const setCategoryAtom = useSetAtom(writeCategoryAtom);
  const setModalVisable = useSetAtom(modalVisableAtom);

  if (!selectedEvent) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <NoResultsInfo
          iconName="calendar-outline"
          title="No Event Selected"
          message="Please go back and select an event to see what's on tap."
        />
      </SafeAreaView>
    );
  }
  const brewsAtom = useBrewsAtom(selectedEvent.resources.brews.href);
  const brews = useAtomValue(brewsAtom);

  const setSelectedBrew = useSetAtom(selectedBrewAtom);

  const handleBrewPress = useCallback((brew: InventoryItem) => {
    setSelectedBrew(brew);
    setModalVisable(true);
  }, []);

  if (brews.loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={{ marginTop: 10 }}>Fetching the drink list...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (brews.error || !brews.data) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <NoResultsInfo
          iconName="cloud-offline-outline"
          title="Couldn't Load Drinks"
          message="We had trouble fetching the drink menu. Please try again later."
        />
      </SafeAreaView>
    );
  }

  const displayedBrews = selectedCategory
    ? filterDrinksByCategory(brews.data, selectedCategory)
    : brews.data;

  const isFilterActive = !!selectedCategory;
  const isInitialDataEmpty = brews.data.length === 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView
          style={{ maxHeight: 70 }}
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
          {displayedBrews.length > 0 ? (
            <TileGrid
              data={displayedBrews}
              RenderTileComponent={({ item }: { item: InventoryItem }) => (
                <DrinkTile
                  drink={item}
                  onPress={() => handleBrewPress(item)}
                />
              )}
              RenderModalComponent={({ item }: { item: InventoryItem }) => (
                <DrinkModal item={item} />
              )}
              tileLoading={brews.loading}
              itemAtom={selectedBrewAtom}
            />
          ) : (
            <NoResultsInfo
              iconName="beer-outline"
              title={isFilterActive ? `No '${selectedCategory}' Drinks Found` : 'No Drinks Available'}
              message={
                isInitialDataEmpty
                  ? "It looks like the drink menu for this event isn't available yet. Cheers to checking back soon!"
                  : "We couldn't find any drinks in this category. Try selecting another one!"
              }
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Brews;
