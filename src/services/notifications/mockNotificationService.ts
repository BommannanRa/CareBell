import type { ReminderType } from '../../types';

export type NotificationPermissionStatus = 'granted' | 'denied' | 'prompt';

export interface LocalNotification {
  id: number;
  title: string;
  body: string;
  reminderId?: string;
  remindAt?: string;
  type?: ReminderType;
}

export class MockNotificationService {
  private notifications: LocalNotification[] = [];
  private permission: NotificationPermissionStatus = 'granted';

  async checkPermissions() {
    return this.permission;
  }

  async requestPermissions() {
    this.permission = 'granted';
    return 'granted';
  }

  async scheduleReminder(reminder: { id: string; title: string; body: string; type?: ReminderType; scheduledFor?: string }) {
    const notification: LocalNotification = {
      id: Date.now() + Math.random(),
      title: reminder.title,
      body: reminder.body,
      reminderId: reminder.id,
      remindAt: reminder.scheduledFor,
      type: reminder.type,
    };
    this.notifications = [...this.notifications.filter((item) => item.reminderId !== reminder.id), notification];
    return notification;
  }

  async cancelReminder(reminderId: string) {
    this.notifications = this.notifications.filter((item) => item.reminderId !== reminderId);
  }

  async scheduleFollowUp(message: string, reminderId: string) {
    const notification: LocalNotification = {
      id: Date.now() + Math.random(),
      title: 'CareBell',
      body: message,
      reminderId,
    };
    this.notifications.push(notification);
    return notification;
  }

  getAll() {
    return [...this.notifications];
  }
}
