import { Image, ImageProps } from "expo-image";
import { BREW_FEST_IMAGE_HOST } from "lib/request";
import { memo } from "react";

type S3ImageProps = Omit<ImageProps, 'source'> & {
  uri: string;
}

const S3Image = memo(({ uri, style, ...restProps }: S3ImageProps) => {
  const url = `${BREW_FEST_IMAGE_HOST}${uri}`;

  return (
    <Image
      style={style}
      cachePolicy='memory-disk'
      transition={300}
      source={{ uri: url }}
      {...restProps}
    />
  );
}, (prevProps, nextProps) => {
  return prevProps.uri === nextProps.uri;
});

export default S3Image;

