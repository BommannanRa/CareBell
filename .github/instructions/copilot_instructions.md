# Project: CareBell — Cross-Platform Food & Medicine Reminder App

## 1. Your role

Act as a senior full-stack engineer, React and TypeScript architect, mobile application developer, UI/UX designer, accessibility specialist, QA engineer, and release engineer.

Build a complete, production-oriented cross-platform mobile application named **CareBell** that runs on Android and iOS.

The app helps users remember their food schedules and medicines, receive friendly reminders at configured times, record whether they completed each reminder, and receive a follow-up alert on their phone when they submit their response.

Do not stop at a prototype, mockup, or a static user interface. Implement working features, application logic, data persistence, notification handling, automated tests, and all required mobile build and packaging configuration.

## 2. Required technology stack

Use simple, maintainable, mainstream web technologies wherever possible.

### Frontend
- React with TypeScript.
- Vite as the development server and web build tool.
- HTML5 semantic elements.
- Tailwind CSS for styling.
- React Router for navigation if multiple routes are appropriate.
- Lucide React icons, supplemented by appropriate emojis.
- React Hook Form and Zod for form handling and validation where useful.

### Mobile application
- Capacitor as the native mobile runtime.
- Capacitor Android and iOS platforms.
- Capacitor Local Notifications for scheduled reminders.
- Capacitor App and other official Capacitor plugins when necessary.
- Native notification permissions, lifecycle handling, and platform-specific configuration.

### Backend
- Node.js with TypeScript.
- Express for the REST API.
- PostgreSQL for persistent data.
- Prisma ORM or an equivalent type-safe database access layer.
- Environment variables for configuration.
- Secure authentication if account synchronization is implemented.

### Testing and quality
- Vitest and React Testing Library for frontend tests.
- Supertest for backend API tests.
- ESLint and Prettier.
- Strict TypeScript checks.
- Production builds for frontend, backend, Android, and iOS.
- GitHub Actions for continuous integration.

Use compatible, stable versions of dependencies. Check the official documentation before implementing platform-specific APIs. Keep dependency versions compatible rather than independently installing incompatible latest versions.

## 3. Critical functional requirements

### A. Food reminders

Allow users to create, view, edit, pause, resume, and delete food reminders.

Each food reminder must support:
- Reminder name, such as Breakfast, Morning Snack, Lunch, Evening Snack, and Dinner.
- Optional description or note.
- Reminder time.
- Multiple reminders at different times throughout the day.
- Repeat pattern: every day, selected weekdays, or a specific date.
- Start date and optional end date.
- Enable/disable toggle.
- Optional advance reminder.
- Optional snooze interval.
- Friendly notification title and message.

Examples:
- 8:00 AM — 🍳 Time for breakfast!
- 11:00 AM — 🍎 Take a little break and have your snack.
- 1:00 PM — 🍛 Lunch time! Have a nourishing meal.
- 7:30 PM — 🥗 Dinner time. Take a moment to enjoy your food.

Allow multiple food reminders to be scheduled independently.

### B. Medicine reminders

Allow users to create medicine reminders with the following fields:
- Medicine name.
- Optional medicine description.
- Prescribed dose text, such as "1 tablet" or "5 ml", entered by the user.
- Optional instructions, such as "After food".
- Reminder time or multiple times per day.
- Repeat pattern: daily, selected weekdays, or a specific date.
- Start date and optional end date.
- Optional prescription note.
- Enable/disable toggle.
- Optional snooze interval.
- Optional advance reminder.

Examples:
- 8:00 AM — 💊 Time for your morning medicine.
- 2:00 PM — 💊 It is time for your scheduled medicine.
- 9:00 PM — 🌙 Your evening medicine reminder is here.

Support multiple medicines, different schedules, and separate reminders for each medicine.

Do not prescribe medicines, recommend doses, infer dosage from a medicine name, or suggest that users change prescribed treatment. Display user-entered instructions without changing their meaning.

### C. Friendly notification experience

Use native local notifications to deliver scheduled reminders, including when the app is in the background or not currently open, subject to operating system permissions and scheduling behavior.

Each notification should:
- Use friendly, simple wording.
- Include an appropriate emoji.
- Clearly identify the food or medicine reminder.
- Include the scheduled time when useful.
- Open the appropriate reminder response screen when tapped.
- Avoid unnecessarily exposing sensitive medicine information on a lock screen. Provide a privacy setting to use generic notification text.

Examples:

Food:
Title: 🍽️ Meal time!
Body: It's time for your scheduled meal. Have you eaten?

Medicine:
Title: 💊 Medicine reminder
Body: It's time for your scheduled medicine. Have you taken it?

Request notification permissions contextually and explain why notifications are needed. Provide an in-app settings screen showing whether notifications are enabled, with instructions for opening device settings if permission has been denied.

Handle Android notification permissions, notification channels, iOS authorization, notification identifiers, and scheduling errors correctly.

Do not use browser alert(), setTimeout(), setInterval(), or an always-running JavaScript process as the primary reminder mechanism.

Use the native operating system scheduler through Capacitor Local Notifications. Reschedule notifications after reminder creation, edits, pause/resume, deletion, timezone changes, and relevant app lifecycle events.

Implement a platform-aware scheduling service that handles recurring reminders and one-time reminders correctly. Respect platform limits on pending notifications, and maintain a reliable schedule queue when necessary.

Do not promise exact-time delivery where the operating system does not guarantee it. Document any limitations associated with battery optimization, Focus modes, notification permissions, or exact-alarm settings.

### D. Required taken/not-taken interaction

When a reminder notification is opened, display a simple, prominent response screen.

For food:
- ✅ Yes, I've eaten.
- ❌ No, not yet.
- ⏰ Remind me later.

For medicine:
- ✅ Yes, I've taken it.
- ❌ No, not yet.
- ⏰ Remind me later.

These actions must be easy to understand and accessible to children and older adults.

After a user responds:
1. Save the response with the reminder ID, scheduled occurrence, response status, and response timestamp.
2. Prevent duplicate records if the user taps repeatedly.
3. Update the dashboard immediately.
4. Cancel or update the corresponding pending notification as appropriate.
5. Display a friendly confirmation.
6. Trigger the configured follow-up alert to the user's phone.
7. Record the event for history and reporting.

Example confirmation:
"Great job! 🎉 Your response has been saved."

For "Not yet":
"No worries 💛 Would you like a reminder in 10 minutes?"

Allow users to configure snooze durations, such as 5, 10, 15, or 30 minutes.

A snoozed occurrence must be tracked independently, without accidentally generating duplicate reminders or marking the item as completed.

For medicines, do not automatically mark an item as taken after a snooze or after the user dismisses a notification.

### E. Follow-up alert after the user's response

This is a mandatory feature and must be implemented explicitly.

After a user selects Taken, Not taken, or Remind me later, send a second notification to the same phone.

Examples:
- Taken: "✅ Response saved. Well done!"
- Not taken: "💛 Your response was recorded. You can update it whenever you're ready."
- Snoozed: "⏰ Okay! We'll remind you again in 10 minutes."

Use a native local notification for this follow-up when the response is processed locally. It must not depend on a backend request succeeding before the local confirmation can be scheduled.

For responses that also need to be synchronized across devices, send the response to the backend and record the synchronization status.

Important distinction: a notification displayed by the same phone is not a message sent from another device. Implement the requested on-phone follow-up notification as the default behavior.

If the user explicitly enables a remote notification or caregiver-alert feature, support it through a secure backend and an appropriate push-notification provider. Never claim that a remote push notification was sent unless the provider confirms success.

Do not implement SMS or WhatsApp sending by silently opening another application. Such features require a separately configured service and, where applicable, explicit user consent.

### F. Reminder response history

Create a history screen showing:
- Date and time.
- Food or medicine name.
- Scheduled time.
- Actual response time.
- Status: Taken, Not taken, Pending, or Snoozed.
- Whether the response was recorded locally or synchronized.
- Ability to correct a previous response, subject to duplicate prevention and audit requirements.

Provide filters by date, reminder category, and response status.

Display today's completion summary, for example:
"4 of 6 reminders completed 🌟"

A pending reminder must not automatically become a confirmed missed dose. Distinguish between unanswered, not taken, and taken.

## 4. User interface and accessibility

The app must be friendly, simple, calming, and usable by children, adults, and senior citizens.

### Visual direction
Use a clean, modern design inspired by simple wellness apps.

Use mild backgrounds:
- Warm cream: #FFF9F1
- Soft mint: #EAF7F0
- Pale lavender: #F0ECFF
- Light sky blue: #EAF4FF
- Gentle peach: #FFF0E6
- Dark, readable text with sufficient contrast.

Avoid excessive gradients, flashing elements, clutter, harsh colors, and tiny controls.

Use rounded cards, generous spacing, subtle shadows, clear headings, familiar icons, and short sentences.

Emojis should reinforce meaning, not replace essential labels or accessibility text.

### Accessibility
- Use WCAG 2.2 AA as the accessibility target.
- Use large, readable default text with adjustable text size.
- Support large touch targets, preferably at least 44 × 44 CSS pixels.
- Use high-contrast text and visible focus indicators.
- Support screen readers, semantic headings, accessible names, and keyboard navigation where applicable.
- Do not communicate status through color alone.
- Use plain language and clear confirmation messages.
- Avoid time-critical interactions that require fast tapping.
- Ensure layouts remain usable with device accessibility text scaling.
- Test on small screens and larger font settings.

Provide light and dark themes, but default to the light, calming theme.

### Main navigation
Use a simple bottom navigation bar with:
1. 🏠 Home
2. ⏰ Reminders
3. 📅 History
4. ⚙️ Settings

### Home dashboard
Display:
- Friendly greeting.
- Current date.
- Next upcoming reminder.
- Today's food reminders.
- Today's medicine reminders.
- Completion progress.
- Quick actions to add a food reminder or medicine reminder.
- Recent response history.
- A helpful empty state for first-time users.

Example:
"Good morning! 🌞 Let's take care of you today."

### Reminders screen
Provide:
- Food and medicine tabs or clearly separated sections.
- Reminder cards with name, time, repeat pattern, and active status.
- Add, edit, pause/resume, and delete actions.
- Confirmation before deleting.
- Clear indication of notification scheduling problems.

### Add/edit reminder screen
Use a large, simple form with:
- Reminder category selector.
- Name.
- Time picker.
- Repeat schedule.
- Date range.
- Optional notes.
- Optional snooze configuration.
- Save and Cancel buttons.

Validate all required fields and show errors next to the corresponding inputs.

After saving, confirm that the reminder was created and explain whether its notification was successfully scheduled.

### History screen
Show daily completion statistics, filter controls, and an accessible list of recorded responses.

### Settings screen
Include:
- Theme preference.
- Notification permissions and status.
- Default snooze duration.
- Notification privacy.
- Optional reminder sound preference.
- Timezone and time display.
- Data synchronization status.
- Account and data management.
- Export data.
- Privacy policy and app information.

Persist settings across app restarts.

## 5. Architecture and project structure

Use a feature-based, maintainable project structure. Keep frontend and backend clearly separated.

Suggested layout:

carebell/
  src/
    app/
      App.tsx
      router.tsx
    components/
      common/
      layout/
      notifications/
      forms/
    features/
      dashboard/
      reminders/
      responses/
      history/
      settings/
    hooks/
    services/
      api/
      notifications/
      storage/
      scheduling/
    types/
    utils/
    styles/
    main.tsx
  server/
    src/
      config/
      middleware/
      routes/
      controllers/
      services/
      repositories/
      schemas/
      types/
      app.ts
      server.ts
    prisma/
      schema.prisma
      migrations/
    tests/
    package.json
    tsconfig.json
  android/
  ios/
  public/
  tests/
  .github/
    workflows/
  .env.example
  .gitignore
  capacitor.config.ts
  package.json
  package-lock.json
  vite.config.ts
  tsconfig.json
  eslint.config.js
  prettier.config.js
  tailwind.config.ts
  postcss.config.js
  README.md

Adapt the layout to the actual framework and dependency versions. Do not create unnecessary wrappers or duplicate files.

Keep UI components free of direct database access. Use typed feature services, repository boundaries, and reusable hooks.

Separate:
- Reminder definition.
- Scheduled reminder occurrence.
- Response history.
- Native notification scheduling.
- Backend synchronization.
- User settings.

Use stable IDs for reminders and notification occurrences. Make schedule updates idempotent.

## 6. Data model

Implement a suitable relational data model with migrations.

### User
- id
- displayName
- email, when authentication is enabled
- timezone
- preferredTimeFormat
- theme
- defaultSnoozeMinutes
- notificationPrivacyMode
- createdAt
- updatedAt

### Reminder
- id
- userId
- type: FOOD or MEDICINE
- title
- description
- doseText, optional
- instructions, optional
- startDate
- endDate, optional
- recurrenceType
- recurrenceDays
- times
- advanceReminderMinutes, optional
- snoozeMinutes
- isEnabled
- createdAt
- updatedAt

### ReminderOccurrence
- id
- reminderId
- scheduledAt
- timezone
- notificationId
- deliveryState
- createdAt
- updatedAt

### ReminderResponse
- id
- occurrenceId
- reminderId
- status: TAKEN, NOT_TAKEN, SNOOZED
- respondedAt
- snoozedUntil, optional
- syncState
- createdAt
- updatedAt

Use appropriate foreign keys, indexes, uniqueness constraints, and validation.

Prevent duplicate responses for the same occurrence unless an intentional correction workflow is implemented.

Store timestamps consistently in UTC on the backend while preserving the timezone used to interpret scheduled wall-clock times.

Handle daylight saving transitions and timezone changes carefully.

Do not store authentication tokens, passwords, or secrets in source code or logs.

## 7. Persistence and offline behavior

The initial app must work for locally scheduled reminders without requiring the backend to be reachable at reminder time.

Persist local reminder definitions, settings, scheduled occurrence metadata, and response history so the app can recover after a restart.

Use an appropriate local persistence strategy for a mobile application, with a clear repository interface and versioned schema migrations if needed.

Use secure storage for credentials when authentication is enabled.

If a backend is configured:
- Synchronize reminders and responses.
- Use authenticated API requests.
- Retry transient synchronization failures safely.
- Avoid duplicate writes.
- Show synchronization status.
- Preserve locally captured responses when the network is unavailable.

Do not rely on browser localStorage as the sole durable database for native reminder scheduling.

If a reminder is created while notifications are unavailable, save it, show the problem clearly, and allow the user to retry scheduling.

## 8. Backend API

Implement a typed REST API using Node.js, Express, and TypeScript.

Provide endpoints as appropriate for:
- Health check.
- User profile and settings.
- Create/list/get/update/delete reminders.
- Pause/resume reminders.
- Record a response.
- Retrieve response history.
- Correct an existing response.
- Export user data.
- Delete the account and associated data.

Use Zod or an equivalent schema validation layer.

Implement:
- Centralized error handling.
- Consistent response structures.
- Authentication and authorization when accounts are enabled.
- Request validation.
- Rate limiting.
- Secure CORS configuration.
- Safe database transactions.
- Structured logging without sensitive medicine or journal-like personal content.
- API versioning where appropriate.

Never trust a userId supplied by a client to authorize access to another user's data.

Use database migrations and document how to initialize a fresh database.

The mobile app must not require a running backend merely to display already-saved reminders or record an immediate local response.

## 9. Notification service implementation

Build a dedicated notification service and scheduling abstraction.

Required capabilities:
- Check current notification permission.
- Request permission when appropriate.
- Schedule one-time notifications.
- Schedule recurring notifications.
- Cancel notifications.
- Update notifications after reminder edits.
- Reschedule after pause/resume.
- Schedule snoozed notifications.
- Handle notification taps.
- Handle action responses where supported.
- Handle foreground notification presentation.
- Reconcile pending notifications with persisted reminder definitions.
- Reschedule after device reboot or relevant platform lifecycle events where supported.
- Detect and report permission or scheduling failures.

Use Capacitor Local Notifications as the default implementation.

Verify the supported API and platform limitations for the selected Capacitor version before writing code.

For recurring reminders, ensure the chosen scheduling mechanism correctly handles weekdays, dates, and local wall-clock time. Do not approximate recurring schedules with an endless JavaScript timer.

Use a stable mapping between reminder IDs, occurrence IDs, and native notification IDs.

When the app launches or resumes:
1. Load persisted reminders.
2. Check notification permissions.
3. Inspect the relevant pending notification schedule when supported.
4. Reconcile expected reminders with actual scheduled notifications.
5. Restore missing eligible notifications without creating duplicates.
6. Report reminders that could not be scheduled.

For Android, configure notification channels and the appropriate runtime permission. Investigate exact-alarm permission requirements for the chosen plugin and Android versions. Request special access only where justified and permitted by platform policy.

For iOS, configure notification authorization and the necessary native project settings. Explain how users can re-enable notifications in Settings.

Do not implement a background polling loop merely to check whether a reminder is due.

## 10. Mobile build and packaging — mandatory

Deliver the complete Android and iOS project setup, not just the React web build.

### Capacitor configuration
- Configure the application name as CareBell.
- Use a stable, reverse-domain application ID such as com.example.carebell, clearly marked for replacement before production.
- Configure Vite's production output directory correctly.
- Create capacitor.config.ts.
- Install compatible Capacitor core, CLI, Android, iOS, and Local Notifications dependencies.
- Configure the app display name, icons, splash screen, and status bar where appropriate.
- Keep the native platform directories in the project repository.
- Document the correct workflow for syncing changes into native projects.

### Android
Include a complete Android Studio-compatible project.

Configure:
- Android application ID.
- App display name.
- Minimum and target SDK versions appropriate to the chosen Capacitor release and current Play requirements.
- Notification permission handling.
- Notification channels.
- Launcher icons and adaptive icons.
- Splash screen.
- Required Android manifest entries.
- App version and version code.
- Release signing configuration using environment variables or secure local configuration.
- Debug build.
- Signed release APK.
- Android App Bundle (.aab) for Google Play.
- Build instructions and troubleshooting.

Do not commit keystores, signing passwords, or other signing secrets.

### iOS
Include a complete Xcode-compatible project.

Configure:
- Bundle identifier.
- Display name.
- Deployment target supported by the chosen Capacitor version.
- Notification authorization.
- App icons and launch screen.
- Version and build number.
- Signing and provisioning instructions.
- Simulator build and run instructions.
- Physical-device testing instructions.
- Archive and export workflow for a distributable IPA, subject to Apple's signing requirements.
- App Store Connect submission preparation.

Document that iOS packaging and signing require macOS with a compatible Xcode installation. A Mac is required for the normal native iOS build and release workflow.

Do not claim that an unsigned or simulator-only build is a distributable production IPA.

### Required package scripts
Provide working scripts appropriate to the final repository layout, including equivalents of:

- npm run dev
- npm run build
- npm run preview
- npm run lint
- npm run format
- npm run format:check
- npm run typecheck
- npm run test
- npm run test:coverage
- npm run build:mobile
- npm run cap:sync
- npm run android:open
- npm run android:debug
- npm run android:release
- npm run android:bundle
- npm run ios:open
- npm run ios:build

If frontend and backend use separate package files, document the exact working directory for each command or provide root-level orchestration scripts.

Ensure scripts do not reference nonexistent tools or files. Release scripts must fail clearly if signing configuration is missing.

Use actual Gradle/Xcode build commands as appropriate. Clearly distinguish scripts that build artifacts from commands that open an IDE or require manual signing.

### CI/CD
Create GitHub Actions workflows to:
- Install dependencies with a reproducible lockfile.
- Run linting.
- Run TypeScript checks.
- Run unit tests.
- Run the production web build.
- Run backend tests.
- Build Android where the runner and SDK setup support it.
- Validate the iOS project on macOS where practical.
- Keep signing credentials in GitHub Actions secrets.
- Avoid printing secrets.

Do not assume that iOS release signing can run without valid Apple credentials and provisioning.

### Packaging deliverables
Document the expected output locations for:
- Web production build.
- Android debug APK.
- Android signed release APK.
- Android App Bundle.
- iOS simulator build.
- Signed iOS archive/IPA.

Add appropriate generated artifacts to .gitignore without ignoring the native project configuration required to build the app.

## 11. Testing requirements

Write meaningful automated tests.

### Frontend
Test:
- Reminder form validation.
- Creating and editing food reminders.
- Creating and editing medicine reminders.
- Multiple reminders at different times.
- Repeat-day selection.
- Taken/not-taken responses.
- Snooze behavior.
- Follow-up notification requests.
- History filtering.
- Theme and settings persistence.
- Loading, error, and empty states.
- Accessibility labels for key actions.

### Notification scheduling
Use a mock notification adapter for deterministic unit tests.

Test:
- Permission denied.
- Successful scheduling.
- Scheduling failure.
- Reminder update and cancellation.
- Duplicate notification prevention.
- Duplicate response prevention.
- Snooze rescheduling.
- Recurrence calculations.
- Timezone changes.
- Reconciliation after simulated application restart.

Do not rely exclusively on mocked tests. Provide a manual device-testing checklist for actual Android and iOS notification behavior.

### Backend
Test:
- Input validation.
- Authentication and authorization.
- Cross-user access denial.
- CRUD operations.
- Response persistence.
- Duplicate prevention.
- Error handling.
- Database migrations.

## 12. Security, privacy, and reliability

- Collect only the information required for reminder functionality.
- Never log medicine names, doses, credentials, or sensitive user content unnecessarily.
- Avoid exposing medicine names on the lock screen by default when privacy mode is enabled.
- Require confirmation before deleting reminders or user data.
- Use secure authentication if accounts are enabled.
- Validate every backend request.
- Restrict data access by authenticated user.
- Use HTTPS in deployed environments.
- Protect secrets using environment variables and deployment secret stores.
- Explain data backup, export, and deletion.
- Make clear that reminder delivery depends on device settings and operating system behavior.
- Never imply that a notification proves that food was eaten or medicine was taken.
- Never provide medical diagnosis or treatment advice.

## 13. Development workflow

Work in deliberate phases.

Phase 1: Inspect the existing repository, identify existing conventions, and document the implementation plan.

Phase 2: Set up React, TypeScript, Vite, Tailwind CSS, and Capacitor with compatible dependencies.

Phase 3: Implement the accessible UI, navigation, reminder forms, dashboard, and history.

Phase 4: Implement local persistence, reminder scheduling, permissions, notification interactions, response recording, and follow-up alerts.

Phase 5: Implement the Node.js API, PostgreSQL schema, migrations, validation, and synchronization if the backend is configured.

Phase 6: Implement automated tests and fix failures.

Phase 7: Complete Android and iOS native configuration, icons, splash screens, signing guidance, and build scripts.

Phase 8: Run available lint, type-check, test, and production-build commands. Build native artifacts when the environment supports them.

Phase 9: Document installation, configuration, local development, device testing, packaging, release, and troubleshooting.

Do not stop after producing the plan. Continue implementation until the available work is complete.

Do not silently skip a feature. If an environment limitation prevents a build or release step, document the exact limitation and provide the next executable command.

## 14. Required documentation

Create a comprehensive README.md containing:
- Project overview and feature list.
- Architecture and folder structure.
- Prerequisites.
- Supported Node.js version.
- Dependency installation.
- Environment configuration.
- Database setup and migrations.
- Development startup commands.
- Frontend and backend testing.
- Notification permission behavior.
- Running on an Android emulator or physical device.
- Running on an iOS simulator or physical device.
- Android APK and AAB generation.
- iOS archive and IPA generation.
- Release signing requirements.
- CI/CD setup.
- Troubleshooting.
- Known platform limitations.
- Privacy and security considerations.

Create .env.example with placeholder values only.

Add an appropriate license file only if requested or if the repository already has an established license.

## 15. Acceptance criteria

The implementation is complete only when the following conditions are met:

1. The app has a friendly, accessible, responsive mobile interface.
2. Users can create multiple food reminders with different times.
3. Users can create multiple medicine reminders with different times and prescribed dose text.
4. Users can configure dates and recurring schedules.
5. Native notifications can be scheduled without keeping the React app running.
6. Users can record Taken, Not taken, or Remind me later.
7. Responses persist and update the dashboard and history.
8. A follow-up on-phone notification is scheduled after the user's response.
9. Snoozed reminders are rescheduled without duplicating occurrences.
10. Permissions and scheduling failures are handled gracefully.
11. Existing reminders and response history survive application restarts.
12. Backend synchronization, if configured, handles retries and duplicate submissions safely.
13. Android and iOS projects contain the configuration needed for their respective build workflows.
14. Required build, test, type-check, lint, and packaging commands are documented and functional.
15. Tests pass and the production web build succeeds.
16. Native builds are validated where the available operating system, SDKs, and signing credentials permit.
17. No API keys, passwords, signing secrets, or private user data are committed.
18. README.md explains how to install, run, test, build, sign, and distribute the application.

## Final instructions

Inspect the existing repository before making changes. Preserve useful existing files and avoid unnecessary rewrites.

Use straightforward, maintainable code and sensible defaults. Implement complete user flows rather than placeholder buttons.

Use strict TypeScript and avoid `any`, unsafe type assertions, disabled lint rules, or suppressed compiler errors as shortcuts.

Do not claim a build, test, notification, API request, or package succeeded unless it was actually executed and verified.

At the end, provide:
1. A summary of implemented features.
2. The final project structure.
3. Dependencies added.
4. Commands to run the app locally.
5. Commands to build and package Android and iOS.
6. Tests and build checks executed, including their actual results.
7. Any remaining manual setup, signing, credentials, or platform limitations.

Begin by inspecting the repository and then implement the application end to end.