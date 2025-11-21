import { createPrefetchedImagesAtom, createResourceAtom } from "atoms/resources";
import { InventoryItem } from "types/api-responses";
import { useMemo } from "react";

const useImagesAtom = (urls: string[] | undefined) => {
  return useMemo(() => createPrefetchedImagesAtom(urls), []);
}

const useInventoryAtom = (href: string) => {
  return useMemo(() => createResourceAtom<InventoryItem[]>(href), [href]);
}

export {
  useImagesAtom,
  useInventoryAtom
};
