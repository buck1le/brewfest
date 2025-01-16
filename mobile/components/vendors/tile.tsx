import { Pressable, View, Text, Dimensions } from "react-native";
import { Vendor } from "types/api-responses";

import { styles } from "./tile-styles";
import { Ionicons } from "@expo/vector-icons";
import S3Image from "components/common/image";

interface VendorTileProps {
  item: Vendor;
  onPress: () => void;
}

const width = Dimensions.get("window").width;


const VendorTile = ({
  item,
  onPress,
}: VendorTileProps) => {
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
      <S3Image
        style={styles.vendorImage}
        source={{ uri: item.thumbnail }}
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
