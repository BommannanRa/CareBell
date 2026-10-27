import { reminderStorage } from '../storage/reminderStorage';
import type { Reminder } from '../../types';

const recentAlarmKeys = new Map<string, number>();

function toMinutes(value: string) {
  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
}

function buildAlarmKey(reminder: Reminder, now: Date) {
  return `${reminder.id}:${now.toISOString().slice(0, 16)}:00`;
}

export function findDueReminders(reminders: Reminder[], now: Date) {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const currentDate = now.toISOString().slice(0, 10);

  return reminders.filter((reminder) => {
    if (!reminder.isEnabled) return false;

    const startDate = reminder.startDate ?? currentDate;
    const endDate = reminder.endDate ?? currentDate;

    if (currentDate < startDate || currentDate > endDate) {
      return false;
    }

    const reminderMinutes = toMinutes(reminder.time);
    const diffMinutes = Math.abs(currentMinutes - reminderMinutes);
    return diffMinutes <= 2;
  });
}

export function requestBrowserReminderPermission() {
  if (!('Notification' in globalThis)) {
    return Promise.resolve('unsupported');
  }

  if (globalThis.Notification.permission === 'granted') {
    return Promise.resolve('granted');
  }

  return globalThis.Notification.requestPermission();
}

export function triggerBrowserReminderPopup(reminder: Reminder) {
  if (typeof window === 'undefined') {
    return null;
  }

  const title = reminder.notificationTitle ?? reminder.title;
  const body = reminder.notificationMessage ?? 'CareBell reminder';

  if ('Notification' in globalThis && globalThis.Notification.permission === 'granted') {
    new globalThis.Notification(title, { body, tag: reminder.id });
    return 'notification';
  }

  const banner = document.createElement('div');
  banner.style.position = 'fixed';
  banner.style.right = '16px';
  banner.style.bottom = '90px';
  banner.style.zIndex = '99999';
  banner.style.maxWidth = '320px';
  banner.style.background = '#111827';
  banner.style.color = '#fff';
  banner.style.borderRadius = '12px';
  banner.style.boxShadow = '0 20px 40px rgba(15, 23, 42, 0.25)';
  banner.style.padding = '14px 16px';
  banner.style.fontFamily = 'system-ui, sans-serif';
  banner.innerHTML = `<div style="font-weight:700; margin-bottom:6px;">${title}</div><div style="font-size:13px; line-height:1.4; color:#e5e7eb;">${body}</div>`;

  document.body.appendChild(banner);
  globalThis.setTimeout(() => {
    banner.remove();
  }, 6000);

  return 'banner';
}

export function checkAndTriggerDueReminders(now = new Date()) {
  const reminders = reminderStorage.getReminders();
  const due = findDueReminders(reminders, now);

  for (const reminder of due) {
    const alarmKey = buildAlarmKey(reminder, now);
    const lastFired = recentAlarmKeys.get(alarmKey);

    if (lastFired && now.getTime() - lastFired < 60000) {
      continue;
    }

    recentAlarmKeys.set(alarmKey, now.getTime());
    triggerBrowserReminderPopup(reminder);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new globalThis.CustomEvent('carebell:alarm', { detail: reminder }));
    }
  }

  return due;
}

export function startBrowserReminderMonitor() {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const poll = () => {
    checkAndTriggerDueReminders();
  };

  poll();
  const intervalId = globalThis.setInterval(poll, 30000);
  return () => globalThis.clearInterval(intervalId);
}
