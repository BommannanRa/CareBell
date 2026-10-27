export type ReminderType = 'FOOD' | 'MEDICINE';
export type RepeatPattern = 'DAILY' | 'WEEKDAYS' | 'SPECIFIC_DATE';
export type ResponseStatus = 'TAKEN' | 'NOT_TAKEN' | 'SNOOZED' | 'PENDING';

export interface Reminder {
  id: string;
  type: ReminderType;
  title: string;
  description?: string;
  doseText?: string;
  instructions?: string;
  time: string;
  repeatPattern: RepeatPattern;
  daysOfWeek: number[];
  date?: string;
  startDate: string;
  endDate?: string;
  isEnabled: boolean;
  snoozeMinutes: number;
  advanceReminderMinutes?: number;
  notificationTitle?: string;
  notificationMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReminderResponse {
  id: string;
  reminderId: string;
  reminderType: ReminderType;
  reminderTitle: string;
  status: ResponseStatus;
  respondedAt: string;
  scheduledAt: string;
  syncState: 'LOCAL' | 'SYNCED';
}

export interface AppSettings {
  theme: 'light' | 'dark';
  defaultSnoozeMinutes: number;
  notificationPrivacyMode: 'generic' | 'detailed';
  notificationEnabled: boolean;
  reminderSound: boolean;
  timezone: string;
  timeFormat: '12h' | '24h';
}
