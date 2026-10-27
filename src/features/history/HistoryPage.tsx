import { useMemo } from 'react';
import { reminderStorage } from '../../services/storage/reminderStorage';

export function HistoryPage() {
  const responses = useMemo(() => reminderStorage.getResponses(), []);

  return (
    <div className="space-y-5">
      <section className="card bg-sky">
        <h1 className="text-xl font-bold">Response history</h1>
        <p className="mt-2 text-sm text-slate-600">{responses.length} logged check-ins</p>
      </section>

      <section className="card">
        {responses.length ? (
          <ul className="space-y-2">
            {responses.map((response) => (
              <li key={response.id} className="rounded-xl bg-slate-50 p-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <strong>{response.reminderTitle}</strong>
                  <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">{response.status}</span>
                </div>
                <div className="mt-1 text-slate-600">{new Date(response.respondedAt).toLocaleString()}</div>
                <div className="mt-1 text-slate-500">Source: {response.syncState}</div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500">No history yet. Responses will appear here after reminders are answered.</p>
        )}
      </section>
    </div>
  );
}
