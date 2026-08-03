# Travlr Getaways Enhancement Changelog

## July 19, 2026 — CS 499 Milestone Two: Software Design and Engineering

### Backend Architecture

- Refactored the trip API from a controller-to-database design into a layered architecture:
  - Express routes define endpoint mappings.
  - Controllers manage HTTP requests and responses.
  - A service layer handles validation and application decisions.
  - A repository layer contains direct Mongoose database operations.
- Added `app_api/services/trip.service.js`.
- Added `app_api/repositories/trip.repository.js`.
- Added `app_api/errors/application-error.js`.
- Removed direct Mongoose queries from `app_api/controllers/trips.js`.
- Added consistent handling for expected application errors, Mongoose validation failures, duplicate records, and unexpected server errors.
- Preserved the existing single-trip array response so the current Angular edit component remains compatible.
- Changed successful trip updates from HTTP `201 Created` to `200 OK`.

### Authentication and Security

- Moved JWT validation out of the API route module and into `app_api/middleware/authentication.js`.
- Corrected the authentication flow so `next()` executes only after successful asynchronous JWT verification.
- Added validation for missing, malformed, and invalid Authorization headers.
- Added consistent JSON responses for authentication failures.
- Attached successfully decoded JWT information to `req.auth`.
- Added a client-side Angular `CanActivate` route guard for the add-trip and edit-trip pages.
- Preserved the Express API as the authoritative security boundary while adding client-side defense in depth.
- Added safe JWT decoding that handles malformed, invalid, and expired tokens without throwing uncaught browser errors.
- Automatically removes invalid or expired tokens from browser storage.

### Angular Authentication Flow

- Updated the authentication service to return observables rather than subscribing internally.
- Moved login success, failure, and navigation handling into the login component.
- Removed the fixed three-second authentication timer.
- Added support for returning users to the originally requested protected route after login.
- Added clear error messages for failed authentication.
- Added a submission state to prevent duplicate login requests.
- Improved login form accessibility with matching label and input identifiers.
- Added browser autocomplete attributes and required-field validation.
- Added a fallback route for unmatched Angular URLs.

### Configuration and Error Handling

- Added support for configuring the Angular client origin through the `CLIENT_ORIGIN` environment variable.
- Retained `http://localhost:4200` as the default development origin.
- Added proper handling for CORS preflight requests.
- Added JSON error responses for API requests while retaining the existing Handlebars error page for server-rendered routes.
- Added an `.env.example` template recommendation without exposing the real JWT secret.

### Verification

- Verified that public trip retrieval remains available without authentication.
- Verified that trip creation and update requests reject missing or invalid JWTs.
- Verified that protected Angular routes redirect unauthenticated users to login.
- Verified that successful login returns users to their originally requested route.
- Verified that malformed and expired browser tokens fail safely.
- Verified that the Angular application builds successfully after the enhancement.

## August 2026 — CS 499 Milestone Three: Algorithms and Data Structures

### Trip Discovery Algorithm

- Added a dedicated trip-search algorithm module.
- Added keyword normalization and HTML-free description searching.
- Added weighted relevance scoring for:
  - Exact and partial trip-code matches
  - Exact and partial trip-name matches
  - Resort matches
  - Description matches
  - Individual keyword-token matches
- Used a `Set` to eliminate duplicate keyword tokens during scoring.
- Added parsing functions for the existing string-based price and duration fields.
- Added numeric filtering by:
  - Minimum price
  - Maximum price
  - Number of nights
- Added deterministic sorting by:
  - Relevance
  - Price ascending
  - Price descending
  - Start date
  - Trip name
- Added explicit tie-breaking using start date, name, and original position.
- Added validation for unsupported sort options, invalid numeric input, and reversed price ranges.
- Added configurable result limits with a maximum server-side cap.

### Database and Service Coordination

- Added repository-level candidate filtering for keyword and resort criteria.
- Escaped regular-expression characters in user-supplied search values.
- Reduced unnecessary data transfer by narrowing the candidate set before in-memory scoring.
- Preserved the existing MongoDB schema so data-type migration remains isolated to the later database milestone.
- Updated the trip controller to pass HTTP query parameters into the service layer.

### Angular Search Interface

- Added a typed `TripSearchCriteria` model.
- Added keyword, resort, price-range, duration, and sort controls.
- Added loading, empty-result, result-count, and error states.
- Added clear/reset behavior.
- Updated the Angular data service to build query parameters with `HttpParams`.
- Removed the redundant component-level `TripData` provider.
- Improved trip-card input typing and accessibility.

### Testing

- Added Node tests for price parsing, duration parsing, relevance scoring, numeric filtering, and deterministic sorting.
- Added a root `npm test` command using Node's built-in test runner.
- Verified valid and invalid search requests through API tests.

## August 2026 — CS 499 Milestone Four: Database Enhancement

### Booking and Reservation Data Model

- Added a MongoDB booking collection with Mongoose schema validation.
- Added references between booking, user, and trip documents.
- Added immutable booking-time snapshots for trip code, trip name, travel date, and price.
- Added validation for traveler count, booking status, price, and required references.
- Added a unique public booking-code index.
- Added compound indexes for:
  - User booking history by date
  - Trip and booking status
  - Status and booking date
- Added automatic document timestamps.

### Database Access and Aggregation

- Added a booking repository following the established repository pattern.
- Added customer-specific booking retrieval ordered by booking date.
- Added populated trip information to booking responses.
- Added a MongoDB aggregation pipeline that:
  - Filters confirmed bookings
  - Groups records by trip
  - Counts bookings
  - Totals travelers
  - Calculates estimated revenue
  - Identifies earliest and latest booking dates
  - Joins current trip details
  - Sorts results by revenue and trip name

### Authentication and Authorization

- Added customer and administrator user roles.
- Added the role to JWT payloads.
- Prevented public registration from assigning administrator privileges.
- Added reusable role-based authorization middleware.
- Restricted trip creation and modification to administrators.
- Restricted administrative booking summaries to administrators.
- Added resource-level ownership checks for individual booking access.
- Prevented authenticated customers from accessing bookings owned by other users.
- Preserved administrator access for legitimate support and reporting tasks.

### Angular Booking Interface

- Added a booking form connected to individual trips.
- Added customer booking history.
- Added an administrator-only booking summary page.
- Added typed Angular booking and booking-summary models.
- Added a dedicated booking data service.
- Added authenticated and administrator route guards.
- Added role-aware navigation and trip-card controls.
- Added loading, validation, error, empty-result, and confirmation states.

### Testing and Verification

- Added automated tests for:
  - Booking total calculation
  - Public booking-code format
  - Customer ownership authorization
  - Cross-user access denial
  - Administrator access
- Verified customer booking creation and retrieval.
- Verified administrative aggregation results.
- Verified customers cannot access administrator reporting.
- Verified customers cannot create or modify trip records.
