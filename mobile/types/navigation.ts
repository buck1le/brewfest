import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { ScheduleItem } from 'components/schedule/types';

export type RootStackParamList = {
  Home: undefined;
  Main: undefined;
  ScheduleItem: { item: ScheduleItem };
};

export type ItemRouteProp = RouteProp<RootStackParamList, 'ScheduleItem'>;
export type ItemNavigationProp = StackNavigationProp<RootStackParamList, 'ScheduleItem'>;

export type MainNavigationProp = StackNavigationProp<RootStackParamList>;

