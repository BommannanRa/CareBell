import { Router } from 'express';
import { createReminder, listReminders } from '../controllers/remindersController.js';

const router = Router();

router.get('/', listReminders);
router.post('/', createReminder);

export default router;
