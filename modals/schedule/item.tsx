import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import { ScheduleItem } from "components/schedule/types";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ScheduleItemResponse } from "types/api-responses";
import { ScheduleImages } from "modals/schedule/types";
import { Image } from "expo-image";

type ItemRouteProp = RouteProp<{ params: { item: ScheduleItem } }, "params">;

interface ItemProps {
  route: ItemRouteProp;
}

interface ImagesProps {
  images: ScheduleImages[] | undefined;
}

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';


const Images = ({ images }: ImagesProps) => {
  const imagesBaseUrl = process.env.EXPO_PUBLIC_BREW_FEST_S3_BASE_URL;

  console.log("The images are", images);
  return (
    <View>
      {images && images.map((image, index) => {
        const imageUrl = `${imagesBaseUrl}/${image.url}`;
        console.log("The image url is", imageUrl);
        return (
          <Image
            key={index}
            source={imageUrl}
            placeholder={{ blurhash }}
            transition={1000}
          />
        );
      })}
    </View>
  );
};


const Item = ({ route }: ItemProps) => {
  const { item } = route.params;
  const [data, setData] = useState<ScheduleItemResponse>();

  const fetchScheduleItem = async () => {
    try {
      const uri = `https://4dae-71-221-110-22.ngrok-free.app/api/schedule/${item.id}`;

      const response = await fetch(uri, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log(response);

      const data = await response.json();
      console.log(data);
      setData(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchScheduleItem();
  }, []);

  console.log("The data is", data);

  return (
    <SafeAreaProvider>
      <Text>{item.title}</Text>
      <Text>{item.time}</Text>
      <Text>{item.description}</Text>
      <Images images={data?.scheduleImages} />
    </SafeAreaProvider>
  );
}

export default Item;
