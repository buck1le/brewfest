import { createResourceCacheMapAtom, createSingleCacheEntryAtom } from "atoms/resources";
import { atom } from "jotai";
import { useMemo } from "react";
import { InventoryItem } from "types/api-responses";

export const categoryAtom = atom<string | undefined>(undefined);

export const writeCategoryAtom = atom(
  null,
  (get, set, update: string | undefined) => {
    const currentValue = get(categoryAtom);
    if (currentValue === update) {
      set(categoryAtom, undefined);
      return;
    }
    set(categoryAtom, update);
  }
);


const brewsCacheAtom = createResourceCacheMapAtom<InventoryItem[]>();

export const useBrewsAtom = (href: string) => useMemo(() => createSingleCacheEntryAtom<InventoryItem[]>(brewsCacheAtom)(href), [href]);

