import { describe, expect, it } from 'vitest';
import type { Reminder } from '../../types';
import { findDueReminders } from './browserReminderService';

const buildReminder = (overrides: Partial<Reminder> = {}): Reminder => ({
  id: 'reminder-1',
  type: 'FOOD',
  title: 'Breakfast',
  description: 'Morning meal',
  time: '08:00',
  repeatPattern: 'DAILY',
  daysOfWeek: [1, 2, 3, 4, 5],
  startDate: '2026-10-27',
  endDate: '2026-12-31',
  isEnabled: true,
  snoozeMinutes: 10,
  notificationTitle: 'Meal time!',
  notificationMessage: 'Time to eat.',
  createdAt: '2026-10-27T00:00:00.000Z',
  updatedAt: '2026-10-27T00:00:00.000Z',
  ...overrides,
});

describe('findDueReminders', () => {
  it('returns reminders that are due at the current time', () => {
    const due = findDueReminders([buildReminder()], new Date('2026-10-27T08:00:00'));
    expect(due).toHaveLength(1);
    expect(due[0].title).toBe('Breakfast');
  });

  it('ignores reminders that are disabled or outside the time window', () => {
    const reminders = [
      buildReminder({ isEnabled: false }),
      buildReminder({ time: '09:00' }),
    ];

    const due = findDueReminders(reminders, new Date('2026-10-27T08:00:00'));
    expect(due).toHaveLength(0);
  });
});
