import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { ScheduleItem } from "components/schedule/types";
import { RouteProp } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ScheduleItemResponse } from "types/api-responses";
import { ScheduleImages } from "modals/schedule/types";
import { Image } from "expo-image";
import { styles } from "./styles";
import Carousel from "react-native-reanimated-carousel";
import type { ICarouselInstance } from "react-native-reanimated-carousel";
import { Dimensions } from "react-native";

type ItemRouteProp = RouteProp<{ params: { item: ScheduleItem } }, "params">;

interface ItemProps {
  route: ItemRouteProp;
}

interface ImagesProps {
  images: ScheduleImages[] | undefined;
}

const PAGE_WIDTH = Dimensions.get('window').width;

const Pager = ({ images }: ImagesProps) => {
  const imagesBaseUrl = process.env.EXPO_PUBLIC_BREW_FEST_S3_BASE_URL;
  const ref = React.useRef<ICarouselInstance>(null);

  const baseOptions = {
        vertical: false,
        width: PAGE_WIDTH,
        height: 300,
      } as const; 

  return (
    <View style={styles.pager}>
      <Carousel
        {...baseOptions}
        loop={true}
        snapEnabled={true}
        pagingEnabled={true}
        ref={ref}
        data={[...images ?? []]}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 63,
        }}
        renderItem={({ index }) => (
          <View style={{ flex: 1, marginLeft: "2.5%" }}>
            <Image
              source={{
                uri: `${imagesBaseUrl}/${images?.[index].url}`,
              }}
              style={styles.image}
            />
          </View>
        )}
        >
      </Carousel>
    </View>
  );
};


const Item = ({ route }: ItemProps) => {
  const { item } = route.params;
  const [data, setData] = useState<ScheduleItemResponse>();

  const fetchScheduleItem = async () => {
    try {
      const uri = `https://02d0-71-221-88-171.ngrok-free.app/api/schedule/${item.id}`;

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
    <SafeAreaProvider>
      <ScrollView style={styles.container}>
        <Text>{item.title}</Text>
        <Text>{item.time}</Text>
        <Text>{item.description}</Text>
        <Pager images={data?.scheduleImages} />
      </ScrollView>
    </SafeAreaProvider>
  );
}

export default Item;
