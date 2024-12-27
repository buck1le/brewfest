import { TouchableOpacity } from 'react-native';
import S3Image from '../image';

interface TouchableImageProps {
  onPress: () => void;
  image: any;
  style: any;
}

const TouchableImage = ({ onPress, image, style }: TouchableImageProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <S3Image
        source={{ uri: image }}
        style={style} 
        contentFit='contain'
        />
    </TouchableOpacity>
  );
}


export default TouchableImage;
