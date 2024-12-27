import { createResourceAtom } from "atoms/resources";
import { VendorImageResponse } from "types/api-responses"; 
import { useMemo } from "react";

export const useVendorImagesAtom = (href: string) =>
  useMemo(() => createResourceAtom<VendorImageResponse[]>(href), [href]);

