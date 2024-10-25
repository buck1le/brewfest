import { ScheduleItem } from "components/schedule/types";
import { ScheduleImages } from "modals/schedule/types";

export interface ScheduleItemResponse {
  scheduleItem: ScheduleItem;
  scheduleImages: ScheduleImages[];
}

export interface Event {
  id: number;
  name: string;
  image: string;
  description: string;
  start_date: string;
  end_date: string;
}

export type EventsResponse = Event[];
