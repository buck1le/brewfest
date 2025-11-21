import { useAtomValue } from "jotai";
import { FlatList, SafeAreaView } from "react-native";
import { View } from "react-native";
import { Resource } from "types/api-responses";
import { useInventoryAtom } from "./atoms";
import { InventoryItem } from "types/api-responses";
import { Skeleton } from "moti/skeleton";
import { styles } from "./inventory-grid-styles";

interface TileGridProps {
  inventoryResource: Resource;
}

const InventoryGrid = ({ inventoryResource }: TileGridProps) => {
  const inventoryAtom = useInventoryAtom(inventoryResource.href);
  const inventory = useAtomValue(inventoryAtom);

  if (inventory.loading) {
    return (
      <SafeAreaView>
        <View style={styles.inventoryContainer}>
          {[1, 2, 3, 4, 5].map((id) => (
            <Skeleton
              key={id}
              width={200}
              height={200}
            />
          ))}
        </View>
      </SafeAreaView>
    );
  }

  if (!inventory.data) {
    return
  }

  return (
    <SafeAreaView>
      <View style={styles.inventoryContainer}>
        <FlatList
          scrollEnabled={false}
          data={inventory.data}
          numColumns={2}
          contentContainerStyle={{
            flexGrow: 1,
            marginBottom: 200
          }}
          renderItem={({ item }) => (
            <InventoryTile item={item} />
          )}
          keyExtractor={(item) => String(item.id)}
        />
      </View>
    </SafeAreaView>
  );
};

const InventoryTile = ({ item }: {
  item: InventoryItem
}) => {
  return (
    <View style={styles.tileContainer}>
      <Skeleton
        width={200}
        height={200}
        colorMode="light"
      />
    </View>
  );
}


export default InventoryGrid;
