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
  resources: {
    vendors: string;
    schedule: string;
  };
}

export interface Vendor {
  id: number;
  name: string;
  headerImage: string;
  images: string[];
  description: string;
  resources: {
    // Vendors URL
    vendor: string;
  }
}

export interface BaseVendor {
  id: number;
  name: string;
  headerImage: string;
  description: string;
  resources: {
    // Vendors URL
    vendor: string;
  }
}

export type EventsResponse = Event[];
export type VendorsResponse = BaseVendor[];
