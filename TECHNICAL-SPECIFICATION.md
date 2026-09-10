# Technical Specification

## Scope

Productive Time Tracker is a client-side web application for viewing and managing time entries for a selected day. It supports:

- listing entries for a day;
- creating a new entry;
- editing an existing entry;
- deleting an entry;
- capturing duration, date, and multiline description.

The Productive API also requires `service_id` when creating or updating a time entry. The application therefore loads available services and exposes a service selector in both create and edit forms.

Because `service_id` is required by the API, the application assumes every valid time entry has an associated service. An entry whose service relationship is missing is treated as an invalid API response rather than a supported user state.

## Architecture

The application uses Vue 3, TypeScript, Vue Router, Pinia, Axios, and Tailwind CSS. There is no server-side application; the browser communicates directly with Productive's API.

- `src/views/`: route-level screens.
- `src/components/`: reusable UI components.
- `src/api/`: typed API functions and Axios client.
- `src/stores/`: persisted authentication state.
- `src/router/`: routes and authentication guards.

## User flow

1. The user signs in with an API token and organization ID.
2. The application resolves the authenticated person's ID from the organization membership.
3. The index screen loads entries for the selected date.
4. The date picker changes the selected date and updates the URL query string.
5. Creating or editing an entry returns to the list and keeps the submitted date in the query string.
6. Cancel uses browser history so the previous date and query parameters are retained.

## API communication

The API client adds `X-Auth-Token` and `X-Organization-Id` request headers. The application uses:

- `GET /time_entries`
- `GET /time_entries/:id?include=service`
- `POST /time_entries`
- `PATCH /time_entries/:id`
- `DELETE /time_entries/:id`
- `GET /services`

Create and update requests send:

```text
Accept: application/vnd.api+json
Content-Type: application/vnd.api+json
```

The time-entry payload includes `date`, `time`, `note`, `person_id`, and `service_id`. API responses are normalized into the application's camelCase model, including `serviceId`.

## Validation and errors

The form validates:

- duration is a whole number from 1 through 1,440 minutes;
- description is not empty;
- date is present and not in the future;
- a service is selected.

API failures are converted into user-facing messages by the shared API error helper. Loading failures are displayed in the relevant view, and submit failures remain visible above the form.

## Implementation decisions

- The selected date is stored as `?date=YYYY-MM-DD`, making the list view shareable and preserving context during create/edit navigation.
- Browser history is used for date changes and form cancellation.
- Services are loaded on create and edit because the API requires a service ID even though the assignment's minimum entry fields do not explicitly mention services.
- The application does not implement service management because services are reference data owned by Productive.
- Time entries are filtered with `person_id` and `date` rather than the assignment's suggested `after` and `before` filters. The list is grouped by the entry's logged calendar date (`attributes.date`), while `after` and `before` filter timestamp fields such as creation or activity time. Using the timestamp filters can therefore return an entry logged for a previous date when it was created or updated today. This should be revisited if Productive clarifies different filter semantics for the endpoint.

## Out of scope and trade-offs

The following items were intentionally not implemented to keep the solution within the assignment's scope and time constraints:

- **Token security:** The API token is persisted in `localStorage` so the client can restore the session after a refresh. This is vulnerable to theft if the application has an XSS vulnerability. A production architecture would use a server-side integration and an `HttpOnly`, `Secure`, appropriately scoped cookie, but the assignment does not include a server component.
- **Pagination:** Productive returns paginated collections for services and time entries. The application currently consumes the returned page only. A production implementation should follow pagination metadata and load additional pages when needed.
- **Caching:** Services and time entries are fetched on demand. The application does not implement a cache or request deduplication layer. A production implementation could cache services for the session and cache or invalidate time-entry queries after mutations.
- **Automated tests:** Automated unit, component, and end-to-end tests were intentionally omitted because the app has limited standalone business logic and the assignment prioritizes the complete API-backed user flow. Adding and configuring a test runner would add setup overhead without materially improving confidence for this small application. Manual QA, type-checking, linting, and production builds are the intended validation approach.
- **Dedicated 404 route:** A separate application-level 404 screen was not added. Resource-not-found responses from the API are already converted into a visible error on the edit screen, which is sufficient for the assignment's supported flows.
