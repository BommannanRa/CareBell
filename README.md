# CareBell

CareBell is a mobile wellness reminder app for food and medicine schedules. It includes a local-first reminder experience, reminder history, native notification scheduling through Capacitor, and a small typed backend API.

## Features

- Create, edit, pause, resume, and delete food and medicine reminders
- Recurring schedules with daily, weekday, and one-time patterns
- Friendly local notification reminders and follow-up confirmation alerts
- Response tracking for Taken, Not taken, and Snoozed states
- Dashboard with completion progress and recent history
- Settings for theme, privacy, snooze defaults, and notifications
- Express + TypeScript backend with Prisma-ready schema
- Android and iOS project scaffolding via Capacitor

## Prerequisites

- Node.js 22.x recommended
- npm 10+
- PostgreSQL 15+
- Optional: Android Studio and Xcode for native builds

## Install

npm install

## Environment setup

Copy the example environment file and adjust values:

cp .env.example .env

## Development

npm run dev

This runs the backend and the Vite frontend together.

Frontend: http://localhost:5173
Backend: http://localhost:3001

## Production build

npm run build
npm run build:server

## Testing

npm run test
npm run test:coverage
npm run lint
npm run typecheck

## Mobile setup

npx cap add android
npx cap add ios
npm run cap:sync

Then open the native IDEs:

npm run android:open
npm run ios:open

## Android build

npm run android:debug
npm run android:release
npm run android:bundle

## iOS build

npm run ios:build

## Deployment and database guide

For detailed instructions on Android packaging, iOS packaging, Vercel API deployment, and PostgreSQL schema creation, see:

- [docs/DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md)

## Notes

This project keeps the reminder logic local-first. Native notifications are scheduled with Capacitor Local Notifications and do not require the backend at reminder time.

## License

No license file is included because this was scaffolded as an app starter without a project-specific licensing decision.
