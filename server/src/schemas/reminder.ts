import { z } from 'zod';

export const reminderSchema = z.object({
  type: z.enum(['FOOD', 'MEDICINE']),
  title: z.string().min(1),
  description: z.string().optional(),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  repeatPattern: z.enum(['DAILY', 'WEEKDAYS', 'SPECIFIC_DATE']),
  isEnabled: z.boolean().default(true),
  snoozeMinutes: z.number().int().min(0).max(60).default(10),
  startDate: z.string().min(1),
  endDate: z.string().optional(),
});
