import type { Request, Response } from 'express';
import { reminderSchema } from '../schemas/reminder.js';

export const listReminders = (_req: Request, res: Response) => {
  res.json({ reminders: [] });
};

export const createReminder = (req: Request, res: Response) => {
  const parsed = reminderSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  return res.status(201).json({ reminder: { ...parsed.data, id: 'demo-reminder-id' } });
};
