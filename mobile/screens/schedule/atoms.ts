import { createResourceAtom } from "atoms/resources";
import { useMemo } from "react";
import { ScheduleItem } from "types/api-responses";

export const useScheduleAtom = (
  href: string,
) =>
  useMemo(() => createResourceAtom<ScheduleItem[]>(href), [href]);
