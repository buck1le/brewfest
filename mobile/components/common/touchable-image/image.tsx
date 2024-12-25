import { TouchableOpacity } from 'react-native';
import { BREW_FEST_IMAGE_HOST } from 'lib/request';
import { Image } from 'expo-image';

interface TouchableImageProps {
  onPress: () => void;
  image: any;
  style: any;
}

const TouchableImage = ({ onPress, image, style }: TouchableImageProps) => {
  const image_url = `${BREW_FEST_IMAGE_HOST}${image}`;

  return (
    <TouchableOpacity onPress={onPress}>
      <Image
        source={{ uri: image_url }}
        style={style} 
        contentFit='contain'
        />
    </TouchableOpacity>
  );
}


export default TouchableImage;
