import { createResourceWithCategoryAtom } from "atoms/resources";
import { atom } from "jotai";
import { useMemo } from "react";
import { IndexVendors } from "types/api-responses";

export const useVendorsAtom = (
  href: string,
  category: string | undefined
) =>
  useMemo(() => createResourceWithCategoryAtom<IndexVendors>(href, category), [href, category]);

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


