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
