import { Activity, BellRing, Clock3, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const items = [
  { to: '/', label: 'Home', icon: Activity },
  { to: '/reminders', label: 'Reminders', icon: BellRing },
  { to: '/history', label: 'History', icon: Clock3 },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 z-20 w-full max-w-md -translate-x-1/2 border-t border-slate-200 bg-white/95 px-2 py-2 backdrop-blur-sm">
      <div className="grid grid-cols-4 gap-2">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-xs font-medium transition ${
                isActive ? 'bg-mint text-slate-800' : 'text-slate-600 hover:bg-slate-100'
              }`
            }
            aria-label={label}
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
