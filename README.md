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
