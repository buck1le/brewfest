import { createResourceCacheMapAtom, createSingleCacheEntryAtom } from "atoms/resources";
import { useMemo } from "react";
import { InventoryItem } from "types/api-responses";

const brewsCacheAtom = createResourceCacheMapAtom<InventoryItem[]>();

export const useBrewsAtom = (href: string) => {
  useMemo(() => createSingleCacheEntryAtom<InventoryItem[]>(brewsCacheAtom)(href), [href]);
}
