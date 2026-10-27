import { reminderStorage } from '../storage/reminderStorage';
import type { Reminder, ReminderResponse, ResponseStatus } from '../../types';

export const createReminder = (reminderInput: Omit<Reminder, 'id' | 'createdAt' | 'updatedAt'>): Reminder => {
  const timestamp = new Date().toISOString();
  const reminder: Reminder = {
    id: crypto.randomUUID(),
    createdAt: timestamp,
    updatedAt: timestamp,
    ...reminderInput,
  };

  const reminders = reminderStorage.getReminders();
  reminderStorage.saveReminders([...reminders, reminder]);
  return reminder;
};

export const updateReminder = (id: string, patch: Partial<Reminder>) => {
  const reminders = reminderStorage.getReminders();
  const next = reminders.map((reminder) =>
    reminder.id === id ? { ...reminder, ...patch, updatedAt: new Date().toISOString() } : reminder,
  );
  reminderStorage.saveReminders(next);
  return next.find((item) => item.id === id) ?? null;
};

export const deleteReminder = (id: string) => {
  const reminders = reminderStorage.getReminders().filter((reminder) => reminder.id !== id);
  reminderStorage.saveReminders(reminders);
};

export const recordResponse = (reminder: Reminder, status: Exclude<ResponseStatus, 'PENDING'>) => {
  const responses = reminderStorage.getResponses();
  const payload: ReminderResponse = {
    id: crypto.randomUUID(),
    reminderId: reminder.id,
    reminderType: reminder.type,
    reminderTitle: reminder.title,
    status,
    respondedAt: new Date().toISOString(),
    scheduledAt: new Date().toISOString(),
    syncState: 'LOCAL',
  };

  reminderStorage.saveResponses([payload, ...responses]);
  return payload;
};

export const getTodaySummary = () => {
  const reminders = reminderStorage.getReminders();
  const responses = reminderStorage.getResponses();
  const completed = responses.filter((response) => response.status === 'TAKEN').length;
  return {
    total: reminders.filter((reminder) => reminder.isEnabled).length,
    completed,
    text: `${completed} of ${reminders.filter((reminder) => reminder.isEnabled).length} reminders completed 🌟`,
  };
};

export const scheduleReminderNotification = async (reminder: Reminder) => ({
  id: reminder.id,
  title: reminder.notificationTitle ?? reminder.title,
  body: reminder.notificationMessage ?? 'CareBell reminder',
  reminderId: reminder.id,
});

export const scheduleFollowUpNotification = async (message: string, reminderId: string) => ({
  id: reminderId,
  title: 'CareBell',
  body: message,
  reminderId,
});
