export type ReminderType = 'FOOD' | 'MEDICINE';
export type RepeatPattern = 'DAILY' | 'WEEKDAYS' | 'SPECIFIC_DATE';

export interface ReminderRecord {
  id: string;
  type: ReminderType;
  title: string;
  time: string;
  repeatPattern: RepeatPattern;
  startDate: string;
  endDate?: string;
  isEnabled: boolean;
  snoozeMinutes: number;
}
