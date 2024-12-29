import { createResourceCacheMapAtom, createSingleCacheEntryAtom } from "atoms/resources";
import { atom } from "jotai";
import { useMemo } from "react";
import { Vendor } from "types/api-responses";

const vendorsCacheAtom = createResourceCacheMapAtom<Vendor[]>();

export const useVendorsAtom = (
  href: string,
) =>
  useMemo(() => createSingleCacheEntryAtom<Vendor[]>(vendorsCacheAtom)(href), [href]);

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


