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
                uri={item.url}
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
        showsVerticalScrollIndicator={false}
        style={{
          flexShrink: 0,
          width: '100%',
        }}
      >
        <Text style={{
          alignSelf: 'flex-start',
          fontSize: 30,
          marginBottom: 10,
          fontWeight: 'bold',
          fontFamily: 'Poppins_700Bold',
        }}>{item?.name}</Text>
        <View style={styles.textContainer}>
          <Text
            style={{
              fontSize: 15,
              fontFamily: 'Poppins_400Regular',
            }}
          >{item?.description}</Text>
        </View>
        <View style={[styles.textContainer, {
          marginTop: 30,
        }]}>
          <Text style={{
            fontSize: 18,
            fontFamily: 'Poppins_700Bold',
            fontWeight: 'bold',
          }}>Featured Items</Text>
        </View>
        <View style={styles.inventoryListContainer}>
          <InventoryList vendor={item} />
        </View>
      </ScrollView>
    </>

  )
}

const numColumns = 2;

const InventoryList = ({ vendor }: { vendor: Vendor }) => {
  const inventoryAtom = useInventoryAtom(vendor.resources.inventory.href);
  const inventory = useAtomValue(inventoryAtom);

  return (
    <FlatList
      scrollEnabled={false}
      showsHorizontalScrollIndicator={false}
      numColumns={numColumns}
      contentContainerStyle={{
        marginTop: 10,
        gap: 15,
        marginBottom: 300,
        alignItems: 'flex-start',
        backgroundColor: 'transparent',
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
            uri={item.thumbnail}
            style={{
              borderRadius: 8,
              width: (width / numColumns) - 20,
              height: 200,
            }}
            contentFit="cover"
          />
          <View style={{
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            padding: 5,
            borderRadius: 8,
            marginTop: 5,
            alignItems: 'center',
            minWidth: 50,
          }}
          >
            <Text>{item.category}</Text>
          </View>
        </View>
      )}
    />
  );
}

export default VendorModal;
