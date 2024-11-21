import { createPrefetchedImagesAtom } from "atoms/resources";
import { useMemo } from "react";

const useImagesAtom = (urls: string[] | undefined) => {
  return useMemo(() => createPrefetchedImagesAtom(urls), []);
}

export {
  useImagesAtom,
};
