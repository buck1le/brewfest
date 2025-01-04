import { useSetAtom } from "jotai";
import { selectedEventAtom } from 'atoms/index';
import { Event } from "types/api-responses";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import S3Image from "components/common/image";
import { Pressable } from "react-native-gesture-handler";
import { Suspense } from "react";

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
    <Pressable
      onPress={() => handlePress(event)}
      style={{
        backgroundColor: '#FAF7F0',
        borderRadius: 10,
        width: width,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.2,
      }}>
      <S3Image
        onLoadStart={() => console.log('loading')}
        key={event.id}
        source={{ uri: event.thumbnail }}
        contentFit="cover"
        style={{
          width: "100%",
          height: 200,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          marginBottom: 5,
        }}
      />
      <Text style={{
        fontSize: 18,
        fontWeight: 'bold',
        paddingLeft: 5,
        fontFamily: 'Poppins-Regular',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5,
      }}>
        {event.name}
      </Text>
      <Text style={{
        fontSize: 12,
        paddingLeft: 5,
        fontFamily: 'Poppins',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5,
      }}>
        {event.description}
      </Text>
      <View style={{
        padding: 10,
        gap: 10,
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5,
        }}>
          <Ionicons name="calendar-outline" size={24} color="black" />
          <Text>{event.startDate} - {event.endDate}</Text>
        </View>
        <View style={{
          flexDirection: 'row',
        }}>
          <Ionicons name="location-outline" size={24} color="black" />
        </View>
      </View>
    </Pressable >
  )
}

export default EventCard;
