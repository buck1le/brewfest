import { Pressable, View, Text } from "react-native";
import { Vendor } from "types/api-responses";
import { Image } from "expo-image";

import { styles } from "./tile-styles";
import { BREW_FEST_IMAGE_HOST } from "lib/request";

interface VendorTileProps {
  item: Vendor;
  onPress: () => void;
}


const VendorTile = ({
  item,
  onPress,
}: VendorTileProps) => {
  const image_url = `${BREW_FEST_IMAGE_HOST}${item.thumbnail}`;

  return (
    <Pressable
      style={styles.tileContainer}
      onPress={onPress}
      >
      <Image
        style={styles.vendorImage}
        source={{ uri: image_url }}
      />
      <View style={styles.textContainer}>
        <Text style={{
          fontSize: 18,
          fontWeight: 'bold',
        }}>
          {item.name}
        </Text>
        <OperatingOutOfChip operatingOutOf={item.operatingOutOf} />
      </View>
    </Pressable>
  );
}

const OperatingOutOfChip = ({ operatingOutOf }: { operatingOutOf: string }) => {
  return (
    <View style={{
      backgroundColor: 'lightgrey',
      padding: 5,
      borderRadius: 10,
      marginTop: 5,
      maxWidth: 100,
      minWidth: '90%',
      alignItems: 'center',
      alignSelf: 'flex-start',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
    }}>
      <Text style={{
        fontSize: 12,
      }}>
        {operatingOutOf}
      </Text>
    </View>
  );
}


export default VendorTile;
