import { Vendor } from "types/api-responses";

interface VendorModalProps {
  item: Vendor;
}

import { View, Text, Image, ScrollView, Dimensions } from "react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { useRef } from "react";
import { styles } from "./modal-styles";
import { useInventoryAtom } from "components/common/tiles/atoms";
import { useAtomValue } from "jotai";

const width = Dimensions.get("window").width;

const VendorModal = ({ item }: VendorModalProps) => {
  const ref = useRef<ICarouselInstance>(null);

  return (
    <>
      <View style={styles.carouselContainer}>
        <Carousel
          ref={ref}
          width={width}
          height={width / 2}
          data={item?.resources.images}
          loop
          autoPlay
          autoPlayInterval={3000}
          renderItem={({ item }) => (
            <View
              style={{
                justifyContent: "center",
                flex: 1,
              }}
            >
              <Image
                source={{ uri: item.url }}
                style={{
                  width: width,
                  height: width / 2,
                }}
              />
            </View>
          )}
        />
      </View>
      <ScrollView
        style={{
          flexShrink: 0,
          width: '100%',
        }}
      >
        <View style={styles.textContainer}>
          <Text style={styles.itemTitle}>{item?.title}</Text>
          <Text>{item?.description}</Text>
        </View>
        <View style={styles.inventoryListContainer}>
          <InventoryList vendor={item} />
        </View>
      </ScrollView>
    </>

  )
}

const InventoryList = ({ vendor }: { vendor: Vendor }) => {
  const inventoryAtom = useInventoryAtom(vendor.resources.inventory.href);
  const inventory = useAtomValue(inventoryAtom);

  return (
    <View>
      {inventory.data?.map((item) => (
        <View key={item.id}>
          <Text>{item.title}</Text>
          <Text>{item.description}</Text>
        </View>
      ))}
    </View>
  );
}

export default VendorModal;
