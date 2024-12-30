import { TouchableOpacity } from 'react-native';
import S3Image from '../image';

interface TouchableImageProps {
  onPress: () => void;
  image: any;
  style: any;
  contentFit?: 'cover' | 'contain' | 'fill';
}

const TouchableImage = ({ onPress, image, style, contentFit}: TouchableImageProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <S3Image
        source={{ uri: image }}
        style={style} 
        contentFit={contentFit || 'contain'}
        />
    </TouchableOpacity>
  );
}


export default TouchableImage;
