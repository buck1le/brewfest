import { Image, ImageProps } from "expo-image";
import { BREW_FEST_IMAGE_HOST } from "lib/request";
import { memo } from "react";

type S3ImageProps = Omit<ImageProps, 'source'> & {
  uri: string;
}

const S3Image = memo(({ uri, style, ...restProps }: S3ImageProps) => {
  const url = `${BREW_FEST_IMAGE_HOST}${uri}`;

  console.log("re-rendering image component");

  return (
    <Image
      style={style}
      source={{ uri: url }}
      {...restProps}
    />
  );
});

export default S3Image;

