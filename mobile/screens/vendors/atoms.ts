import { createResourceAtom } from "atoms/resources";
import { useMemo } from "react";

export const useEventsAtom = (href: string) =>
  useMemo(() => createResourceAtom<VendorsResponse>(href), [href]);
