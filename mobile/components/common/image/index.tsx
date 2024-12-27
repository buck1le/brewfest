import { Image, ImageProps } from "expo-image";
import { BREW_FEST_IMAGE_HOST } from "lib/request";

type S3ImageProps = Omit<ImageProps, 'source'> & {
  source: { uri: string },
}


const S3Image = ({ source, style, ...restProps }: S3ImageProps) => {
  const url = `${BREW_FEST_IMAGE_HOST}${source.uri}`;

  return (
    <Image
      style={style}
      source={{ uri: url }}
      {...restProps}
    />
  );
}

export default S3Image;

