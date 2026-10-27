import { useState } from 'react';
import { reminderStorage } from '../../services/storage/reminderStorage';

export function SettingsPage() {
  const [settings, setSettings] = useState(reminderStorage.getSettings());

  const updateSetting = <K extends keyof typeof settings>(key: K, value: (typeof settings)[K]) => {
    const next = { ...settings, [key]: value };
    setSettings(next);
    reminderStorage.saveSettings(next);
  };

  return (
    <div className="space-y-5">
      <section className="card">
        <h1 className="text-xl font-bold">Settings</h1>
      </section>

      <section className="card space-y-4">
        <label className="flex items-center justify-between gap-3">
          <span>Theme</span>
          <select className="rounded-lg border border-slate-200 bg-white px-2 py-2" value={settings.theme} onChange={(e) => updateSetting('theme', e.target.value as 'light' | 'dark')}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>

        <label className="flex items-center justify-between gap-3">
          <span>Default snooze</span>
          <input
            type="number"
            className="w-24 rounded-lg border border-slate-200 bg-white px-2 py-2"
            value={settings.defaultSnoozeMinutes}
            onChange={(e) => updateSetting('defaultSnoozeMinutes', Number(e.target.value) || 10)}
          />
        </label>

        <label className="flex items-center justify-between gap-3">
          <span>Notification enabled</span>
          <input type="checkbox" checked={settings.notificationEnabled} onChange={(e) => updateSetting('notificationEnabled', e.target.checked)} />
        </label>

        <label className="flex items-center justify-between gap-3">
          <span>Privacy mode</span>
          <select className="rounded-lg border border-slate-200 bg-white px-2 py-2" value={settings.notificationPrivacyMode} onChange={(e) => updateSetting('notificationPrivacyMode', e.target.value as 'generic' | 'detailed')}>
            <option value="generic">Generic</option>
            <option value="detailed">Detailed</option>
          </select>
        </label>
      </section>
    </div>
  );
}
