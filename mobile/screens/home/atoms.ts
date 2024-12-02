import { useMemo } from "react";

import { createResourceAtom } from "atoms/resources";
import { Event } from "types/api-responses";


export const useEventsAtom = (href: string) =>
  useMemo(() => createResourceAtom<Event[]>(href), [href]);
