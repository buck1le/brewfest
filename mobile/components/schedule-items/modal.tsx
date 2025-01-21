import { ScheduleItem } from "types/api-responses";

import { View, Text, ScrollView, Dimensions } from "react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { useRef } from "react";
import { styles } from "./modal-styles";
import { useScheduleItemImagesAtom } from "./atom";
import { useAtomValue } from "jotai";
import S3Image from "components/common/image";

const width = Dimensions.get("window").width;

interface ScheduleModalProps {
  item: ScheduleItem;
}

const ScheduleModal = ({ item }: ScheduleModalProps) => {
  const ref = useRef<ICarouselInstance>(null);

  const scheduleItemImages = useScheduleItemImagesAtom(item.resources.images.href);
  const images = useAtomValue(scheduleItemImages);

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
                uri={item.url }
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
