import TouchableImage from "components/common/touchable-image";
import { useSetAtom } from "jotai";
import { selectedEventAtom } from 'atoms/index';
import { Event } from "types/api-responses";
import { View, Text } from "react-native";

interface EventCardProps {
  event: Event;
  width: number;
  navigation: any;
}

const EventCard = ({ event, width, navigation }: EventCardProps) => {
  const setSelectedEvent = useSetAtom(selectedEventAtom);

  const handlePress = (event: Event) => {
    setSelectedEvent(event);
    navigation.navigate('Main');
  };

  return (
    <View style={{
      backgroundColor: '#FAF7F0',
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.2,
    }}>
      <TouchableImage
        key={event.id}
        onPress={() => handlePress(event)}
        image={event.thumbnail}
        style={{
          width: width,
          height: 300,
        }}
      />
    </View >
  )
}

export default EventCard;
