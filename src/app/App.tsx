import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { RemindersPage } from '../features/reminders/RemindersPage';
import { HistoryPage } from '../features/history/HistoryPage';
import { SettingsPage } from '../features/settings/SettingsPage';
import { BottomNav } from '../components/layout/BottomNav';
import { startBrowserReminderMonitor } from '../services/notifications/browserReminderService';
import { playReminderTone } from '../services/notifications/alertSound';
import type { Reminder } from '../types';

function AlarmModal({ reminder, onClose }: { reminder: Reminder; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.35)] ring-1 ring-slate-200">
        <div className="mb-4 flex items-center justify-between">
          <span className="rounded-full bg-rose-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-rose-700">
            Alarm
          </span>
          <button type="button" onClick={onClose} className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600">
            Close
          </button>
        </div>

        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-2xl">
            {reminder.type === 'FOOD' ? '🍽️' : '💊'}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{reminder.type}</p>
            <h2 className="text-2xl font-bold text-slate-900">{reminder.notificationTitle ?? reminder.title}</h2>
          </div>
        </div>

        <p className="rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-700">
          {reminder.notificationMessage ?? 'It’s time for your CareBell reminder.'}
        </p>

        <div className="mt-5 flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white">
            Mark done
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              if (typeof window !== 'undefined') {
                globalThis.setTimeout(() => {
                  window.dispatchEvent(new globalThis.CustomEvent('carebell:alarm', { detail: reminder }));
                }, 600000);
              }
            }}
            className="flex-1 rounded-2xl bg-amber-100 px-4 py-3 font-semibold text-amber-700"
          >
            Snooze 10m
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [activeAlarm, setActiveAlarm] = useState<Reminder | null>(null);

  useEffect(() => {
    const stop = startBrowserReminderMonitor();

    const handleAlarm = (event: globalThis.Event) => {
      const nextReminder = (event as globalThis.CustomEvent<Reminder>).detail;
      if (!nextReminder) return;
      setActiveAlarm(nextReminder);
      playReminderTone();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('carebell:alarm', handleAlarm);
    }

    return () => {
      stop();
      if (typeof window !== 'undefined') {
        window.removeEventListener('carebell:alarm', handleAlarm);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-cream text-slate-800">
      <div className="mx-auto flex min-h-screen max-w-md flex-col bg-[#fffaf5] shadow-soft">
        <div className="flex-1 px-4 pb-24 pt-5">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/reminders" element={<RemindersPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <BottomNav />
      </div>

      {activeAlarm ? <AlarmModal reminder={activeAlarm} onClose={() => setActiveAlarm(null)} /> : null}
    </div>
  );
}
