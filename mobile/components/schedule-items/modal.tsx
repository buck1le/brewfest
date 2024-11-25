import { ScheduleItem } from "types/api-responses";

import { View, Text, ScrollView, Dimensions } from "react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { useRef } from "react";
import { styles } from "./modal-styles";
import { Image } from "expo-image";

const width = Dimensions.get("window").width;

interface ScheduleModalProps {
  item: ScheduleItem;
}

const ScheduleModal = ({ item }: ScheduleModalProps) => {
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
      </ScrollView>
    </>

  )
}

export default ScheduleModal;
