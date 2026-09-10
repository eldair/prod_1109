# Productive Time Tracker

A client-side Vue application for managing Productive time entries.

## Features

- View time entries for a selected day.
- Create, edit, and delete time entries.
- Select the associated Productive service when creating or editing an entry.
- Validate duration, description, date, and required service values.
- Display loading, validation, and API errors.
- Preserve the selected date in the URL and browser history.
- Authenticate with a Productive API token and organization ID.

## Requirements

- Node.js 22.18+ or Node.js 24.12+
- pnpm 12+
- A Productive test account, API token, organization ID, and access to time-entry services

## Setup

```bash
pnpm install
pnpm dev
```

Open the local URL printed by Vite and provide your Productive API token and organization ID.

## Validation

```bash
pnpm type-check
pnpm lint
pnpm build
```

## API configuration

The application communicates directly with the Productive API from the browser. Authentication headers are added by the Axios client using credentials stored in Pinia. Write requests use the JSON:API media type required by Productive:

```text
application/vnd.api+json
```

The API requires a `service_id` for time-entry creation and updates, so the form loads available services and submits the selected service ID.

See [TECHNICAL-SPECIFICATION.md](./TECHNICAL-SPECIFICATION.md) for the architecture and implementation decisions.

## Manual QA checklist

- [ ] Sign in with valid credentials and reach the entries list.
- [ ] Confirm invalid credentials show a readable error.
- [ ] View today's entries and navigate to a previous date.
- [ ] Confirm changing dates updates the `?date=YYYY-MM-DD` URL query.
- [ ] Refresh the list and confirm the selected date is preserved.
- [ ] Create an entry with duration, description, date, and service.
- [ ] Confirm successful creation returns to the submitted date and displays the new entry.
- [ ] Edit an existing entry, including changing its date and service.
- [ ] Confirm successful editing returns to the submitted date and displays the updated entry.
- [ ] Cancel create and edit, confirming the previous list date is preserved.
- [ ] Delete an entry and confirm it disappears from the list.
- [ ] Confirm empty descriptions, future dates, durations over 1,440 minutes, and missing services are rejected.
- [ ] Confirm loading and API errors are visible.
- [ ] Log out and confirm protected routes return to the login screen.

## Out of scope

The implementation intentionally leaves several production-hardening concerns out of scope:

- The API token is stored in `localStorage` to support a client-only application. This is not as secure as an `HttpOnly` cookie because an XSS vulnerability could expose it. An `HttpOnly` token would require a server-side integration, which is outside this assignment.
- Productive services and time entries are paginated, but the application currently uses the returned page rather than implementing pagination controls and page loading.
- Requests are not cached or deduplicated. Services and entries are fetched on demand.
- Automated unit, component, and end-to-end tests were intentionally omitted because the app has limited standalone business logic and the assignment prioritizes the core API-backed user flow. The manual QA checklist above, together with `pnpm type-check`, `pnpm lint`, and `pnpm build`, provides the validation baseline for this assignment.
