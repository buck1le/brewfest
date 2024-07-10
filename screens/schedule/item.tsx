import React, { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ScheduleItemResponse } from "types/api-responses";
import { ItemNavigationProp, ScheduleImages } from "./types";
import { Image } from "expo-image";
import { styles } from "./styles";
import Carousel from "react-native-reanimated-carousel";
import type { ICarouselInstance } from "react-native-reanimated-carousel";
import { Dimensions } from "react-native";
import ItemDetails from "components/schedule/item/details/details";
import { ItemRouteProp } from "./types";


interface ImagesProps {
  images: ScheduleImages[] | undefined;
}

const PAGE_WIDTH = Dimensions.get('window').width;

const ImageCarousel = ({ images }: ImagesProps) => {
  const imagesBaseUrl = process.env.EXPO_PUBLIC_BREW_FEST_S3_BASE_URL;
  const ref = React.useRef<ICarouselInstance>(null);

  const baseOptions = {
    vertical: false,
    width: PAGE_WIDTH,
    height: 400,
  } as const;

  return (
    <Carousel
      {...baseOptions}
      loop={true}
      autoPlay={true}
      autoPlayInterval={3000}
      ref={ref}
      data={[...images ?? []]}
      style={{
        flex: 1,
        paddingBottom: 0,
      }}
      modeConfig={{}}
      renderItem={({ index }) => (
        <Image
          source={{
            uri: `${imagesBaseUrl}/${images?.[index].url}`,
          }}
          style={styles.image}
        />
      )}
    >
    </Carousel>
  );
};

interface ItemProps {
  route: ItemRouteProp;
  navigation: ItemNavigationProp;
}

const Item = ({ route, navigation }: ItemProps) => {
  const { item } = route.params;
  const [data, setData] = useState<ScheduleItemResponse>();

  const fetchScheduleItem = async () => {
    try {
      const uri = `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/schedule/${item.id}`;

      const response = await fetch(uri, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchScheduleItem();
  }, []);

  return (
    <SafeAreaProvider style={styles.screenContainer}>
      <ScrollView>
        <View style={styles.imageContainer}>
          <ImageCarousel images={data?.scheduleImages} />
        </View>
        <ItemDetails item={item} />
      </ScrollView>
    </SafeAreaProvider>
  );
}

export default Item;
