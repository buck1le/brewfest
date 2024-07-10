import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "types/navigation";

export interface ScheduleImages {
  id: number;
  schedule_item_id: number;
  text: string;
  url: string;
}

export type ItemRouteProp = RouteProp<RootStackParamList, 'ScheduleItem'>;
export type ItemNavigationProp = StackNavigationProp<RootStackParamList, 'ScheduleItem'>;

export type MainNavigationProp = StackNavigationProp<RootStackParamList>;
