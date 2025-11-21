import { createResourceAtom } from "atoms/resources";
import { Image } from "types/api-responses"; 
import { useMemo } from "react";

export const useVendorImagesAtom = (href: string) =>
  useMemo(() => createResourceAtom<Image[]>(href), [href]);

