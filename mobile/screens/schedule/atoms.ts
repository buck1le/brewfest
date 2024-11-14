import { createResourceAtom } from "atoms/resources";
import { useMemo } from "react";
import { IndexSchedule } from "types/api-responses";

export const useScheduleAtom = (
  href: string,
) =>
  useMemo(() => createResourceAtom<IndexSchedule>(href), [href]);
