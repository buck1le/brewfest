import { Ionicons } from "@expo/vector-icons";
import S3Image from "components/common/image";
import { colors } from "global_styles";

import { Dimensions, Pressable, Text, View } from "react-native"
import { InventoryItem } from "types/api-responses";

interface DrinkProps {
  drink: InventoryItem;
  onPress: () => void;
}

const width = Dimensions.get("window").width;
const borderRadius = 8;

const DrinkTile = ({ drink, onPress }: DrinkProps) => {
  return (
    <Pressable
      style={{
        backgroundColor: 'white',
        flexDirection: 'column',

        // Two columns of tiles
        width: width / 2 - 20,
        height: 200,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
      }}
      onPress={onPress}
    >
      <S3Image
        source={{ uri: drink.thumbnail }}
        contentFit="cover"
        style={{
          height: 110,
          width: '100%',
          borderTopLeftRadius: borderRadius,
          borderTopRightRadius: borderRadius,
        }}
      />
      <Text style={{
        fontFamily: 'Poppins_700Bold',
        fontSize: 16,
        padding: 10,

      }}>{drink.name}</Text>
      <View style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}>
        <View style={{
          paddingLeft: 10,
          paddingBlock: 5,
          borderBottomLeftRadius: borderRadius,
          borderBottomRightRadius: borderRadius,
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          backgroundColor: colors.blue
        }}>
          <Text style={{
            fontFamily: 'Poppins_400Regular',
            fontSize: 13,
            letterSpacing: 1,
            color: 'white',
          }}>
            {drink.category}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

export default DrinkTile;
