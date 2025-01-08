import { useMemo } from "react";

import { createResourceCacheMapAtom, createSingleCacheEntryAtom } from "atoms/resources";
import { Event } from "types/api-responses";
import { atom } from "jotai";


const eventCacheAtom = createResourceCacheMapAtom<Event[]>();

export const eventsAtom = atom<Event[] | undefined>([]);

export const useEventsAtom = (href: string) =>
  useMemo(() => createSingleCacheEntryAtom<Event[]>(eventCacheAtom)(href), [href]);
