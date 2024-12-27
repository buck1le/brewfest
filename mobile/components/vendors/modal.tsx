import { Vendor } from "types/api-responses";

import { View, Text, ScrollView, Dimensions, FlatList } from "react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { useRef } from "react";
import { styles } from "./modal-styles";
import { useInventoryAtom } from "components/common/tiles/atoms";
import { useAtomValue } from "jotai";
import S3Image from "components/common/image";
import { useVendorImagesAtom } from "./atoms";

const width = Dimensions.get("window").width;

interface VendorModalProps {
  item: Vendor;
}

const VendorModal = ({ item }: VendorModalProps) => {
  const ref = useRef<ICarouselInstance>(null);

  console.log("VendorModal", item);

  const vendorImagesAtom = useVendorImagesAtom(item.resources.images.href);
  const images = useAtomValue(vendorImagesAtom);

  if (!images.data) {
    return
  }

  return (
    <>
      <View style={styles.carouselContainer}>
        <Carousel
          ref={ref}
          width={width}
          height={width / 2}
          data={images.data}
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
              <S3Image
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
          <Text style={styles.itemTitle}>{item?.name}</Text>
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

  const numColumns = 3;

  return (
    <FlatList
      scrollEnabled={false}
      numColumns={numColumns}
      contentContainerStyle={{
        padding: 10,
        gap: 15,
        marginBottom: 300,
      }}
      columnWrapperStyle={{
        gap: 15,
      }}
      data={inventory.data}
      renderItem={({ item }) => (
        <View
          key={item.id}
          style={styles.inventoryTile}
        >
          <S3Image
            source={{ uri: item.image.url }}
            style={{
              width: 100,
              height: 100,
              aspectRatio: 1,
            }}
          />
          <Text style={styles.inventoryTitle}>{item.title}</Text>
          <View style={{
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            padding: 5,
            borderRadius: 8,
            marginTop: 5,
            alignItems: 'center',
            minWidth: 50,
          }}
          >
            <Text>{item.type}</Text>
          </View>
        </View>
      )}
    />
  );
}

export default VendorModal;
