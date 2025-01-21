import { useSetAtom } from "jotai";
import { selectedEventAtom } from 'atoms/index';
import { Event } from "types/api-responses";
import { Dimensions } from "react-native";
import S3Image from "components/common/image";
import { Pressable } from "react-native-gesture-handler";

interface EventCardProps {
  event: Event;
  width: number;
  navigation: any;
}

const height = Dimensions.get('window').height;

const EventCard = ({ event, width, navigation }: EventCardProps) => {
  const setSelectedEvent = useSetAtom(selectedEventAtom);

  const handlePress = (event: Event) => {
    setSelectedEvent(event);
    navigation.navigate('Main');
  };

  return (
    <Pressable
      onPress={() => handlePress(event)}
      style={{
        height: height / 2 * 0.8,
        width: width,
      }}>
      <S3Image
        onLoadStart={() => console.log('loading')}
        key={event.id}
        uri={event.thumbnail}
        contentFit="contain"
        style={{
          width: "100%",
          height: "100%",
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          marginBottom: 5,
        }}
      />
    </Pressable >
  )
}

export default EventCard;
