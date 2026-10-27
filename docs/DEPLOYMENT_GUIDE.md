# CareBell deployment and packaging guide

This guide explains how to package the app for Android and iOS, deploy the API to Vercel, and set up the database needed for a production-ready CareBell backend.

## 1. Project architecture

CareBell is structured as:

- Frontend: React + Vite
- Mobile wrapper: Capacitor
- API: Express + TypeScript
- Database: PostgreSQL (recommended)
- ORM: Prisma (recommended)

Recommended production flow:

- Frontend runs as a static web app or a Capacitor app container
- API runs on Vercel as a serverless Express-compatible service
- PostgreSQL runs on Neon, Supabase, Railway, or a managed PostgreSQL instance

---

## 2. Required tools

### Android

- Android Studio
- JDK 17 or 21
- Android SDK
- Gradle
- A Google Play developer account for release publishing

### iOS

- macOS with Xcode installed
- Apple Developer account
- Certificates and provisioning profiles
- App Store Connect access

### Web and API

- Node.js 20+ or 22+
- npm
- Vercel CLI (`npm i -g vercel`)
- PostgreSQL client (`psql`) or Prisma CLI

---

## 3. Android packaging

### 3.1 Install dependencies

```bash
npm install
```

### 3.2 Build the web app

```bash
npm run build
```

### 3.3 Sync native projects

```bash
npx cap add android
npm run cap:sync
```

This creates the Android project under the `android/` folder and syncs the web build into the native app.

### 3.4 Open Android Studio

```bash
npm run android:open
```

### 3.5 Build debug APK

```bash
npm run android:debug
```

This generates a debug APK under:

```bash
android/app/build/outputs/apk/debug/
```

### 3.6 Build release APK/AAB

```bash
npm run android:release
```

or

```bash
npm run android:bundle
```

The bundle output is typically used for Play Store submission:

```bash
android/app/build/outputs/bundle/release/
```

### 3.7 Google Play release checklist

Before publishing:

1. Create a production keystore
2. Add signing config in Android Studio or Gradle
3. Set bundle ID, e.g. `com.carebell.app`
4. Fill app name, privacy policy, and store listing details
5. Upload AAB to Play Console
6. Submit for review

### 3.8 Android package configuration

Capacitor uses a package ID configured in `capacitor.config.ts`. Update it if needed:

```ts
export default {
  appId: 'com.carebell.app',
  appName: 'CareBell',
  webDir: 'dist',
};
```

---

## 4. iOS packaging

### 4.1 Install dependencies

```bash
npm install
```

### 4.2 Add the iOS project

```bash
npx cap add ios
npm run cap:sync
```

### 4.3 Open the project in Xcode

```bash
npm run ios:open
```

### 4.4 Configure signing

Inside Xcode:

1. Select the app target
2. Set the bundle identifier, such as `com.carebell.app`
3. Choose your Apple Developer team
4. Create or select a provisioning profile
5. Ensure the app has a valid signing certificate

### 4.5 Build for simulator

```bash
npm run ios:build
```

### 4.6 Create App Store build

From Xcode:

1. Select a physical device or generic iOS device
2. Product > Archive
3. Validate the app
4. Upload to App Store Connect
5. Submit for review

### 4.7 App Store release checklist

- Bundle ID matches the provisioning profile
- Signing is valid for distribution
- Privacy policy exists
- App screenshots and metadata are ready
- TestFlight or App Store review is configured

---

## 5. Deploy the API to Vercel

### 5.1 Option A: Deploy the Express API as a Vercel serverless app

Vercel supports Node APIs. The easiest approach is to create a small `api/index.ts` wrapper that exports the Express app.

Example:

```ts
// api/index.ts
import app from '../server/src/app';

export default app;
```

Then add a `vercel.json` file:

```json
{
  "version": 2,
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api" }
  ]
}
```

If your API is under a different route structure, adjust the rewrite rules accordingly.

### 5.2 Example environment variables

Set these in Vercel Project Settings > Environment Variables:

```env
DATABASE_URL=postgresql://user:password@host:5432/carebell
JWT_SECRET=your_secret_here
NODE_ENV=production
```

### 5.3 Deploy from the CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

### 5.4 Deploy from GitHub

1. Push the repo to GitHub
2. Import the repo in Vercel
3. Select the root project folder
4. Set the framework as Vite/Node project
5. Add the environment variables
6. Deploy

### 5.5 Important Vercel caveat

A plain Express server is possible, but the cleanest production setup is:

- Vercel hosts the API entrypoint
- the frontend can be deployed separately or as part of the same project
- the database lives in PostgreSQL elsewhere (Neon/Supabase/Railway)

### 5.6 Recommended API endpoint structure

Example endpoints:

```http
GET /api/health
GET /api/reminders
POST /api/reminders
PATCH /api/reminders/:id
DELETE /api/reminders/:id
```

The current app already exposes a basic health check in `server/src/app.ts`:

```ts
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', app: 'carebell-api' });
});
```

For Vercel, make sure the route prefix is included in the deployment route configuration and that the API is reachable as a Vercel serverless function.

---

## 6. Database requirement

CareBell needs a relational database for storing:

- users
- reminders
- reminder responses
- app settings
- sync status

### Recommended database

Use PostgreSQL.

Good managed options:

- Neon
- Supabase
- Railway
- DigitalOcean Managed PostgreSQL
- Azure Database for PostgreSQL

### 6.1 Create the database

Example PostgreSQL command:

```sql
CREATE DATABASE carebell;
```

### 6.2 Connect your app

Set the `DATABASE_URL` environment variable:

```env
DATABASE_URL=postgresql://postgres:yourpassword@db.your-host.com:5432/carebell
```

---

## 7. SQL table creation

If you are not using Prisma migrations yet, create the tables manually in PostgreSQL.

### 7.1 Users table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name VARCHAR(150),
  email VARCHAR(255) UNIQUE,
  timezone VARCHAR(80) DEFAULT 'UTC',
  preferred_time_format VARCHAR(10) DEFAULT '24h',
  theme VARCHAR(20) DEFAULT 'light',
  default_snooze_minutes INTEGER DEFAULT 10,
  notification_privacy_mode VARCHAR(20) DEFAULT 'generic',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 7.2 Reminders table

```sql
CREATE TABLE reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('FOOD', 'MEDICINE')),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  dose_text VARCHAR(255),
  instructions TEXT,
  time VARCHAR(10) NOT NULL,
  repeat_pattern VARCHAR(30) NOT NULL DEFAULT 'DAILY',
  days_of_week INTEGER[] DEFAULT '{}',
  start_date DATE NOT NULL,
  end_date DATE,
  is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  snooze_minutes INTEGER NOT NULL DEFAULT 10,
  notification_title VARCHAR(255),
  notification_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 7.3 Reminder responses table

```sql
CREATE TABLE reminder_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reminder_id UUID NOT NULL REFERENCES reminders(id) ON DELETE CASCADE,
  reminder_type VARCHAR(20) NOT NULL,
  reminder_title VARCHAR(255) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('TAKEN', 'NOT_TAKEN', 'SNOOZED', 'PENDING')),
  responded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  scheduled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  sync_state VARCHAR(20) NOT NULL DEFAULT 'LOCAL'
);
```

### 7.4 Settings table

```sql
CREATE TABLE app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  theme VARCHAR(20) DEFAULT 'light',
  default_snooze_minutes INTEGER DEFAULT 10,
  notification_privacy_mode VARCHAR(20) DEFAULT 'generic',
  notification_enabled BOOLEAN DEFAULT TRUE,
  reminder_sound BOOLEAN DEFAULT TRUE,
  timezone VARCHAR(80) DEFAULT 'UTC',
  time_format VARCHAR(10) DEFAULT '24h',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id)
);
```

### 7.5 Useful indexes

```sql
CREATE INDEX idx_reminders_user_id ON reminders(user_id);
CREATE INDEX idx_reminders_time ON reminders(time);
CREATE INDEX idx_reminders_user_type ON reminders(user_id, type);
CREATE INDEX idx_reminder_responses_reminder_id ON reminder_responses(reminder_id);
CREATE INDEX idx_app_settings_user_id ON app_settings(user_id);
```

---

## 8. Prisma setup (recommended)

Since the project already includes Prisma packages, use Prisma for schema and migration management.

### 8.1 Initialize Prisma

```bash
npx prisma init --datasource-provider postgresql
```

### 8.2 Update `.env`

```env
DATABASE_URL="postgresql://postgres:yourpassword@host:5432/carebell?schema=public"
```

### 8.3 Prisma schema example

```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id                      String   @id @default(uuid())
  displayName             String?
  email                   String?  @unique
  timezone                String   @default("UTC")
  preferredTimeFormat     String   @default("24h")
  theme                   String   @default("light")
  defaultSnoozeMinutes    Int      @default(10)
  notificationPrivacyMode String   @default("generic")
  createdAt               DateTime @default(now())
  updatedAt               DateTime @updatedAt
  reminders               Reminder[]
  settings                AppSettings?
}

model Reminder {
  id                 String   @id @default(uuid())
  userId             String
  user               User     @relation(fields: [userId], references: [id])
  type               String
  title              String
  description        String?
  doseText           String?
  instructions       String?
  time               String
  repeatPattern      String   @default("DAILY")
  daysOfWeek         Int[]
  startDate          DateTime
  endDate            DateTime?
  isEnabled          Boolean  @default(true)
  snoozeMinutes      Int      @default(10)
  notificationTitle  String?
  notificationMessage String?
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
  responses          ReminderResponse[]
}

model ReminderResponse {
  id            String   @id @default(uuid())
  reminderId    String
  reminder      Reminder @relation(fields: [reminderId], references: [id])
  reminderType  String
  reminderTitle String
  status        String
  respondedAt   DateTime @default(now())
  scheduledAt   DateTime @default(now())
  syncState    String   @default("LOCAL")
}

model AppSettings {
  id                     String   @id @default(uuid())
  userId                 String   @unique
  user                   User     @relation(fields: [userId], references: [id])
  theme                  String   @default("light")
  defaultSnoozeMinutes   Int      @default(10)
  notificationPrivacyMode String   @default("generic")
  notificationEnabled    Boolean  @default(true)
  reminderSound          Boolean  @default(true)
  timezone               String   @default("UTC")
  timeFormat             String   @default("24h")
  updatedAt              DateTime @updatedAt
}
```

### 8.4 Run the migration

```bash
npx prisma migrate dev --name init
```

This creates tables in PostgreSQL and generates the Prisma client.

---

## 9. Production deployment checklist

Before going live:

- Set `DATABASE_URL` in Vercel
- Set `NODE_ENV=production`
- Ensure Prisma client is generated in build
- Set app name and package ID for mobile
- Build web app and sync Capacitor
- Create release keystore for Android
- Sign and archive for iOS
- Add privacy policy and app store metadata
- Test push and local notification permissions in production builds

---

## 10. Recommended production setup for CareBell

A good production setup is:

- Vercel for API deployment
- Neon or Supabase for PostgreSQL
- Capacitor for Android and iOS packaging
- local storage + sync layer for offline-first reminders
- Prisma for database access and migrations

This gives you:

- mobile app packaging for both platforms
- centralized backend API
- easy production scaling
- a clean data model for reminders and responses

---

## 11. Quick commands summary

### Build web app

```bash
npm run build
```

### Android

```bash
npx cap add android
npm run cap:sync
npm run android:debug
npm run android:bundle
```

### iOS

```bash
npx cap add ios
npm run cap:sync
npm run ios:open
```

### Vercel deploy

```bash
vercel login
vercel --prod
```

### Database creation

```sql
CREATE DATABASE carebell;
```

### Prisma migration

```bash
npx prisma migrate dev --name init
```

---

This guide is intentionally production-focused and assumes a standard PostgreSQL-backed setup. If you want, the next step can be to generate the actual Prisma schema file and Vercel config files for this repo so you can deploy immediately.
