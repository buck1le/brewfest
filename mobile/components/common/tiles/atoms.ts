import { createPrefetchedImagesAtom } from "atoms/resources";
import { useMemo } from "react";
import { Image as ImageResource } from "types/api-responses";

const useImagesAtom = (images: ImageResource[]) => 
useMemo(() => createPrefetchedImagesAtom(images), [images]);

export {
  useImagesAtom,
};
