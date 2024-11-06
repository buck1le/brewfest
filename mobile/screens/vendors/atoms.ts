import { createResourceAtom } from "atoms/resources";
import { useMemo } from "react";
import { VendorsResponse } from "types/api-responses";

export const useVendorsAtom = (href: string) =>
  useMemo(() => createResourceAtom<VendorsResponse>(href), [href]);
