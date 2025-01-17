import S3Image from "components/common/image";

import { Dimensions, Pressable, Text, View } from "react-native"
import { InventoryItem } from "types/api-responses";

interface DrinkProps {
  drink: InventoryItem;
  onPress: () => void;
}

const width = Dimensions.get("window").width;

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
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
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
        <Text style={{
          fontFamily: 'Poppins_400Regular',
          fontSize: 12,
          paddingLeft: 10,
          marginBottom: 10,
        }}>
          {drink.category}
        </Text>
      </View>
    </Pressable>
  );
}

export default DrinkTile;
