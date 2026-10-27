import { Clock3, Plus, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { reminderStorage } from '../../services/storage/reminderStorage';
import { getTodaySummary } from '../../services/scheduling/reminderScheduler';

export function DashboardPage() {
  const reminders = reminderStorage.getReminders();
  const responses = reminderStorage.getResponses();
  const summary = getTodaySummary();

  const nextReminder = useMemo(
    () =>
      [...reminders]
        .filter((item) => item.isEnabled)
        .sort((a, b) => a.time.localeCompare(b.time))[0],
    [reminders],
  );

  const foodReminders = reminders.filter((item) => item.type === 'FOOD');
  const medicineReminders = reminders.filter((item) => item.type === 'MEDICINE');

  return (
    <div className="space-y-5">
      <header className="card bg-gradient-to-br from-peach to-mint p-5">
        <p className="text-sm font-medium text-slate-700">Good morning! 🌞</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-800">Let’s take care of you today.</h1>
        <div className="mt-3 flex items-center gap-2 text-sm text-slate-700">
          <Clock3 size={16} />
          <span>{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</span>
        </div>
      </header>

      <section className="card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600">Next reminder</p>
            <p className="mt-1 text-lg font-semibold">{nextReminder ? `${nextReminder.title} · ${nextReminder.time}` : 'No reminders yet'}</p>
          </div>
          <Sparkles className="text-amber-500" />
        </div>
      </section>

      <section className="card">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Today’s progress</h2>
          <span className="text-sm font-medium text-slate-600">{summary.text}</span>
        </div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-emerald-500"
            style={{ width: `${summary.total > 0 ? (summary.completed / summary.total) * 100 : 0}%` }}
          />
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <Link to="/reminders?type=FOOD" className="card flex items-center justify-between bg-sky" aria-label="Add food reminder">
          <span>🍽️ Food</span>
          <Plus size={18} />
        </Link>
        <Link to="/reminders?type=MEDICINE" className="card flex items-center justify-between bg-lavender" aria-label="Add medicine reminder">
          <span>💊 Medicine</span>
          <Plus size={18} />
        </Link>
      </section>

      <section className="card">
        <h2 className="text-lg font-semibold">Today</h2>
        <div className="mt-3 space-y-2">
          <div>
            <p className="text-sm text-slate-500">Food reminders</p>
            {foodReminders.length ? (
              <ul className="mt-2 space-y-2 text-sm">
                {foodReminders.map((item) => (
                  <li key={item.id} className="rounded-xl bg-cream p-2">
                    {item.title} · {item.time}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-slate-500">No food reminders scheduled.</p>
            )}
          </div>
          <div>
            <p className="text-sm text-slate-500">Medicine reminders</p>
            {medicineReminders.length ? (
              <ul className="mt-2 space-y-2 text-sm">
                {medicineReminders.map((item) => (
                  <li key={item.id} className="rounded-xl bg-lavender p-2">
                    {item.title} · {item.time}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-slate-500">No medicine reminders scheduled.</p>
            )}
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="text-lg font-semibold">Recent responses</h2>
        {responses.length ? (
          <ul className="mt-3 space-y-2 text-sm">
            {responses.slice(0, 4).map((response) => (
              <li key={response.id} className="rounded-xl bg-slate-50 p-2">
                {response.reminderTitle}: {response.status}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-slate-500">No responses yet. Your check-ins will appear here.</p>
        )}
      </section>
    </div>
  );
}
