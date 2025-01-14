import { createResourceCacheMapAtom, createSingleCacheEntryAtom } from "atoms/resources";
import { atom } from "jotai";
import { useMemo } from "react";
import { InventoryItem } from "types/api-responses";

export const categoryAtom = atom<string | undefined>(undefined);

const brewsCacheAtom = createResourceCacheMapAtom<InventoryItem[]>();

export const useBrewsAtom = (href: string) => useMemo(() => createSingleCacheEntryAtom<InventoryItem[]>(brewsCacheAtom)(href), [href]);

