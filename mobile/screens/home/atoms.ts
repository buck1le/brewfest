import { useMemo } from "react";

import { createResourceCacheMapAtom, createSingleCacheEntryAtom } from "atoms/resources";
import { Event } from "types/api-responses";


const eventCacheAtom = createResourceCacheMapAtom<Event[]>();

export const useEventsAtom = (href: string) =>
  useMemo(() => createSingleCacheEntryAtom<Event[]>(eventCacheAtom)(href), [href]);
