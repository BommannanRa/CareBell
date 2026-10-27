import type { AppSettings, Reminder, ReminderResponse } from '../../types';

const REMINDER_KEY = 'carebell.reminders';
const SETTINGS_KEY = 'carebell.settings';
const RESPONSES_KEY = 'carebell.responses';

const defaultSettings: AppSettings = {
  theme: 'light',
  defaultSnoozeMinutes: 10,
  notificationPrivacyMode: 'generic',
  notificationEnabled: true,
  reminderSound: true,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
  timeFormat: '12h',
};

export const reminderStorage = {
  getReminders(): Reminder[] {
    return JSON.parse(localStorage.getItem(REMINDER_KEY) ?? '[]') as Reminder[];
  },

  saveReminders(reminders: Reminder[]) {
    localStorage.setItem(REMINDER_KEY, JSON.stringify(reminders));
  },

  getResponses(): ReminderResponse[] {
    return JSON.parse(localStorage.getItem(RESPONSES_KEY) ?? '[]') as ReminderResponse[];
  },

  saveResponses(responses: ReminderResponse[]) {
    localStorage.setItem(RESPONSES_KEY, JSON.stringify(responses));
  },

  getSettings(): AppSettings {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? 'null') as AppSettings | null;
    return { ...defaultSettings, ...(saved ?? {}) };
  },

  saveSettings(settings: AppSettings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  },
};
