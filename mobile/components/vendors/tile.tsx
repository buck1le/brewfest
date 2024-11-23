import { Pressable, View, Text } from "react-native";
import { Vendor } from "types/api-responses";
import { Image } from "expo-image";

import { styles } from "./tile-styles";

interface VendorTileProps {
  item: Vendor;
  onPress: () => void;
}


const VendorTile = ({
  item,
  onPress,
}: VendorTileProps) => {
  return (
    <Pressable
      style={styles.tileContainer}
      onPress={onPress}
      >
      <Image
        style={styles.vendorImage}
        source={{ uri: item.image.url }}
      />
      <View style={styles.textContainer}>
        <Text style={{
          fontSize: 18,
          fontWeight: 'bold',
        }}>
          {item.title}
        </Text>
      </View>
    </Pressable>
  );
}

export default VendorTile;
