import { createResourceAtom } from "atoms/resources";
import { useMemo } from "react";
import { IndexVendors } from "types/api-responses";

export const useVendorsAtom = (href: string) =>
  useMemo(() => createResourceAtom<IndexVendors>(href), [href]);
