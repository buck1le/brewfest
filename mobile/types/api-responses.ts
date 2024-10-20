import { ScheduleItem } from "components/schedule/types";
import { ScheduleImages } from "modals/schedule/types";

export interface ScheduleItemResponse {
  scheduleItem: ScheduleItem;
  scheduleImages: ScheduleImages[];
}

export interface EventsResponse {
  id: number;
}[];
