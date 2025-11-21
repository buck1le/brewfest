import { createResourceAtom } from "atoms/resources";
import { Image } from "types/api-responses"; 
import { useMemo } from "react";

export const useScheduleItemImagesAtom = (href: string) =>
  useMemo(() => createResourceAtom<Image[]>(href), [href]);

