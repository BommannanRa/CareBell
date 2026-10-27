import { useEffect, useMemo, useState } from 'react';
import { Check, Pencil, Plus, Trash2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { reminderStorage } from '../../services/storage/reminderStorage';
import { createReminder, deleteReminder, updateReminder } from '../../services/scheduling/reminderScheduler';
import { playReminderTone } from '../../services/notifications/alertSound';
import { requestBrowserReminderPermission, triggerBrowserReminderPopup } from '../../services/notifications/browserReminderService';
import { type Reminder } from '../../types';

const emptyReminder = {
  type: 'FOOD' as const,
  title: '',
  description: '',
  time: '08:00',
  repeatPattern: 'DAILY' as const,
  daysOfWeek: [1, 2, 3, 4, 5],
  startDate: new Date().toISOString().slice(0, 10),
  endDate: '',
  isEnabled: true,
  snoozeMinutes: 10,
  notificationTitle: '',
  notificationMessage: '',
  doseText: '',
  instructions: '',
};

export function RemindersPage() {
  const [searchParams] = useSearchParams();
  const defaultType = (searchParams.get('type') as 'FOOD' | 'MEDICINE') ?? 'FOOD';
  const [reminders, setReminders] = useState<Reminder[]>(() => reminderStorage.getReminders());
  const [selectedType, setSelectedType] = useState<'FOOD' | 'MEDICINE'>(defaultType);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyReminder, type: defaultType, notificationTitle: defaultType === 'FOOD' ? '🍽️ Meal time!' : '💊 Medicine reminder' });

  const filteredReminders = useMemo(
    () => reminders.filter((item) => item.type === selectedType),
    [reminders, selectedType],
  );

  useEffect(() => {
    setSelectedType(defaultType);
    setForm((current) => ({ ...current, type: defaultType, notificationTitle: defaultType === 'FOOD' ? '🍽️ Meal time!' : '💊 Medicine reminder' }));
  }, [defaultType]);

  const submit = async () => {
    const prepared = {
      ...form,
      type: selectedType,
      title: form.title.trim() || (selectedType === 'FOOD' ? 'Meal reminder' : 'Medicine reminder'),
      description: form.description || undefined,
      notificationTitle: form.notificationTitle || (selectedType === 'FOOD' ? '🍽️ Meal time!' : '💊 Medicine reminder'),
      notificationMessage: form.notificationMessage || (selectedType === 'FOOD' ? 'It\'s time for your scheduled meal. Have you eaten?' : 'It\'s time for your scheduled medicine. Have you taken it?'),
      doseText: form.doseText || undefined,
      instructions: form.instructions || undefined,
      endDate: form.endDate || undefined,
    };

    const saved = createReminder(prepared);
    await requestBrowserReminderPermission();
    triggerBrowserReminderPopup(saved);
    playReminderTone();
    setReminders([...reminderStorage.getReminders()]);
    setStatusMessage(`Reminder created: ${saved.title} • ${saved.type === 'FOOD' ? '🍽️' : '💊'} browser alert enabled`);
    setForm({ ...emptyReminder, type: selectedType, notificationTitle: selectedType === 'FOOD' ? '🍽️ Meal time!' : '💊 Medicine reminder' });
  };

  const toggleReminder = (id: string) => {
    const item = reminders.find((entry) => entry.id === id);
    if (!item) return;
    updateReminder(id, { isEnabled: !item.isEnabled });
    setReminders(reminderStorage.getReminders());
  };

  const removeReminder = (id: string) => {
    deleteReminder(id);
    setReminders(reminderStorage.getReminders());
  };

  return (
    <div className="space-y-5">
      {statusMessage ? (
        <div className="card border-emerald-200 bg-emerald-50 text-emerald-700" role="status" aria-live="polite">
          {statusMessage}
        </div>
      ) : null}

      <div className="card">
        <div className="mb-4 flex gap-2 rounded-full bg-slate-100 p-1">
          {(['FOOD', 'MEDICINE'] as const).map((type) => (
            <button
              key={type}
              type="button"
              className={`tab-button flex-1 ${selectedType === type ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600'}`}
              onClick={() => {
                setSelectedType(type);
                setForm((current) => ({
                  ...current,
                  type,
                  notificationTitle: type === 'FOOD' ? '🍽️ Meal time!' : '💊 Medicine reminder',
                }));
              }}
            >
              {type === 'FOOD' ? '🍽️ Food' : '💊 Medicine'}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Name</span>
            <input
              aria-label="Reminder name"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              placeholder={selectedType === 'FOOD' ? 'Breakfast' : 'Vitamin D'}
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium">Time</span>
            <input
              aria-label="Reminder time"
              type="time"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
              value={form.time}
              onChange={(event) => setForm({ ...form, time: event.target.value })}
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium">Notification title</span>
            <input
              aria-label="Notification title"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
              value={form.notificationTitle}
              onChange={(event) => setForm({ ...form, notificationTitle: event.target.value })}
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium">Notification message</span>
            <textarea
              aria-label="Notification message"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
              value={form.notificationMessage}
              onChange={(event) => setForm({ ...form, notificationMessage: event.target.value })}
              rows={3}
            />
          </label>

          {selectedType === 'MEDICINE' ? (
            <>
              <label className="block">
                <span className="mb-1 block text-sm font-medium">Dose text</span>
                <input
                  aria-label="Dose text"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
                  value={form.doseText}
                  onChange={(event) => setForm({ ...form, doseText: event.target.value })}
                  placeholder="1 tablet"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium">Instructions</span>
                <input
                  aria-label="Medicine instructions"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
                  value={form.instructions}
                  onChange={(event) => setForm({ ...form, instructions: event.target.value })}
                  placeholder="After food"
                />
              </label>
            </>
          ) : null}

          <div className="flex gap-3">
            <button type="button" className="flex-1 rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white" onClick={submit}>
              <span className="inline-flex items-center gap-2">
                <Plus size={16} /> Save reminder
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {filteredReminders.length ? (
          filteredReminders.map((reminder) => (
            <div key={reminder.id} className="card">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold">{reminder.title}</p>
                  <p className="text-sm text-slate-600">{reminder.time}</p>
                </div>
                <span className={`rounded-full px-2 py-1 text-xs font-medium ${reminder.isEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}`}>
                  {reminder.isEnabled ? 'Active' : 'Paused'}
                </span>
              </div>

              <div className="mt-3 flex gap-2">
                <button type="button" className="flex-1 rounded-xl bg-emerald-100 px-3 py-2 text-sm font-medium text-emerald-700" onClick={() => toggleReminder(reminder.id)}>
                  <span className="inline-flex items-center gap-2">
                    <Check size={14} /> {reminder.isEnabled ? 'Pause' : 'Resume'}
                  </span>
                </button>
                <button type="button" className="flex-1 rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium" aria-label={`Edit ${reminder.title}`}>
                  <span className="inline-flex items-center gap-2">
                    <Pencil size={14} /> Edit
                  </span>
                </button>
                <button type="button" className="flex-1 rounded-xl bg-rose-100 px-3 py-2 text-sm font-medium text-rose-700" onClick={() => removeReminder(reminder.id)}>
                  <span className="inline-flex items-center gap-2">
                    <Trash2 size={14} /> Delete
                  </span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="card text-sm text-slate-500">No {selectedType.toLowerCase()} reminders yet.</div>
        )}
      </div>
    </div>
  );
}
