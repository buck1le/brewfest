import { Pressable, View, Text, Dimensions } from "react-native";
import { Vendor } from "types/api-responses";
import { Image } from "expo-image";

import { styles } from "./tile-styles";
import { BREW_FEST_IMAGE_HOST } from "lib/request";
import { Ionicons } from "@expo/vector-icons";

interface VendorTileProps {
  item: Vendor;
  onPress: () => void;
}

const width = Dimensions.get("window").width;


const VendorTile = ({
  item,
  onPress,
}: VendorTileProps) => {
  const image_url = `${BREW_FEST_IMAGE_HOST}${item.thumbnail}`;

  return (
    <Pressable
      style={{
        backgroundColor: 'white',
        flexDirection: 'row',
        width: width - 20,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
      }}
      onPress={onPress}
    >
      <Image
        style={styles.vendorImage}
        source={{ uri: image_url }}
      />
      <View style={styles.textContainer}>
        <Text style={{
          fontFamily: "Poppins_700Bold",
          fontSize: 15,
        }}>
          {item.name}
        </Text>
        <View style={{
          marginTop: 5,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <Ionicons name="location-outline" size={24} color="black" />
          <Text
          style={{
            fontFamily: "Poppins_400Regular",
            fontSize: 12,
            marginLeft: 2,
          }}

          >{item.operatingOutOf}</Text>
        </View>
      </View>
    </Pressable>
  );
}

export default VendorTile;
