interface ScheduleItemResources {
  images: string[];
}
  

export interface ScheduleItem {
  id: number;
  title: string;
  time: string;
  description: string;
  startDate: string;
  endDate: string;
  resources: ScheduleItemResources;
};
