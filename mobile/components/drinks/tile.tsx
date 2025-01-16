import S3Image from "components/common/image";

import { Dimensions, Pressable } from "react-native"
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
        source={{ uri: drink.thumbnail }}
        contentFit="contain"
        style={{
          height: 130,
          width: 200,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        }}
      />
    </Pressable>
  );
}

export default DrinkTile;
