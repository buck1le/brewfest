import { createResourceWithCategoryAtom } from "atoms/resources";
import { atom } from "jotai";
import { useMemo } from "react";
import { IndexVendors } from "types/api-responses";

export const useVendorsAtom = (
  href: string,
  category: string | undefined
) =>
  useMemo(() => createResourceWithCategoryAtom<IndexVendors>(href, category), [href, category]);

export const selectedCategoryAtom = atom<string | undefined>(undefined);

