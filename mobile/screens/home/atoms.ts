import { useMemo } from "react";

import { createResourceAtom } from "common/atoms/resources";
import { EventsResponse } from "types/api-responses";


export const useEventsAtom = (href: string) =>
  useMemo(() => createResourceAtom<EventsResponse>(href), [href]);
