import { Pressable, View, Text } from "react-native";
import { ScheduleItem } from "types/api-responses";

import { styles } from "./tile-styles";
import S3Image from "components/common/image";

interface VendorTileProps {
  item: ScheduleItem;
  onPress: () => void;
}


const ScheduleTile = ({
  item,
  onPress,
}: VendorTileProps) => {
  return (
    <Pressable
      style={styles.tileContainer}
      onPress={onPress}
    >
      <S3Image
        style={styles.vendorImage}
        source={{ uri: item.thumbnail }}
      />
      <View style={styles.textContainer}>
        <Text style={{
          fontSize: 18,
          fontWeight: 'bold',
        }}>
          {item.title}
        </Text>
        <TimeInfo startTime={item.startDate} endTime={item.endDate} />
      </View>
    </Pressable>
  );
}

const extractDateFromTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  const day = date.getDay();
  const month = date.getMonth();
  return `${month}/${day}`;
}

const extractTimeFromTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const amOrPm = hours >= 12 ? 'pm' : 'am';
  return `${hours % 12}:${minutes} ${amOrPm}`;
}

const TimeInfo = ({ startTime, endTime }: {
  startTime: string,
  endTime: string,
}) => {
  return (
    <View style={{
      justifyContent: 'space-between',
      padding: 5,
      gap: 10,
      width: '100%',
    }}
    >
      <View style={{
        flex: 1,
        backgroundColor: 'lightgrey',
        flexDirection: 'row',
        padding: 5,
        borderRadius: 10,
        marginTop: 5,
        alignItems: 'center',
        alignSelf: 'flex-start',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
      }}>
        <Text style={{
          fontSize: 12,
          fontWeight: 'bold',
          marginRight: 5,
        }}
          >
          Start:
        </Text>
        <Text style={{
          fontSize: 12,
        }}>
          {extractDateFromTimestamp(startTime)} - {extractTimeFromTimestamp(startTime)}
        </Text>
      </View>
      <View style={{
        flex: 1,
        backgroundColor: 'lightgrey',
        flexDirection: 'row',
        padding: 5,
        borderRadius: 10,
        marginTop: 5,
        alignItems: 'center',
        alignSelf: 'flex-start',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
      }}>
        <Text style={{
          fontSize: 12,
          fontWeight: 'bold',
          marginRight: 5,
        }}
          >
          End:
        </Text>
        <Text style={{
          fontSize: 12,
        }}>
          {extractDateFromTimestamp(endTime)} - {extractTimeFromTimestamp(endTime)}
        </Text>
      </View>
    </View>
  );
}


export default ScheduleTile;
