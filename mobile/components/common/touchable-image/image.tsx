import { Image, TouchableOpacity } from 'react-native';

interface TouchableImageProps {
  onPress: () => void;
  image: any;
  style: any;
}

const TouchableImage = ({ onPress, image, style }: TouchableImageProps) => {
  console.log(image);
  return (
    <TouchableOpacity onPress={onPress}>
      <Image source={{ uri: image }} style={style} />
    </TouchableOpacity>
  );
}


export default TouchableImage;
