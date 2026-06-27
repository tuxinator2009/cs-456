# Travlr Getaways Full Stack Web Application

## Overview

Travlr Getaways is a full stack travel booking application developed using the MEAN stack (MongoDB, Express, Angular, and Node.js). The application provides both a customer-facing website and an administrator single-page application (SPA) for managing travel packages.

The customer-facing website allows users to browse available travel destinations and package information. The administrator SPA allows authorized users to create, edit, and manage trip data stored within a MongoDB database. Authentication and JSON Web Tokens (JWTs) are used to secure administrative functionality.

---

# Architecture

## Frontend Development Approaches

This project utilized two different frontend approaches throughout development.

The customer-facing portion of the application was initially developed using Express, Handlebars templates, HTML, CSS, and JavaScript. This approach relies on server-side rendering, where pages are generated on the server and delivered to the browser.

The administrator interface was developed as an Angular single-page application (SPA). Unlike the Express implementation, Angular performs client-side rendering and communicates with the server through RESTful API requests. This creates a more responsive user experience because data can be updated without requiring full page reloads.

### Comparison

| Express/Handlebars | Angular SPA |
|----------|----------|
| Server-side rendering | Client-side rendering |
| Full page reloads | Dynamic page updates |
| Simpler architecture | Rich interactive functionality |
| Generates HTML on server | Consumes JSON APIs |

## Why MongoDB Was Used

MongoDB was selected because it is a NoSQL document database that integrates naturally with JavaScript applications and the MEAN stack. Travel package data can be stored as flexible JSON-like documents, making it easier to evolve the application's data model as requirements change. MongoDB also works seamlessly with Mongoose, which provides schema definitions and data validation.

---

# Functionality

## JSON and JavaScript

Although JSON (JavaScript Object Notation) is derived from JavaScript syntax, it is not the same thing as JavaScript code. JSON is a lightweight data interchange format used to transfer structured information between systems.

Within this project, JSON served as the communication format between the Angular frontend and the Express backend. The API returns trip information as JSON documents, which Angular consumes and displays through reusable components.

## Refactoring and Reusable Components

Several portions of the application were refactored during development to improve maintainability and functionality.

Examples include:

- Migrating static HTML content to dynamically generated data.
- Converting server-rendered pages to API-driven Angular components.
- Creating reusable Angular components such as Trip Card components.
- Moving data access functionality into Angular services.
- Implementing authentication and authorization functionality using reusable services and middleware.

Benefits of reusable UI components include:

- Reduced code duplication
- Improved maintainability
- Consistent user experience
- Easier future enhancements
- Simplified testing

---

# Testing

Testing was performed throughout development using browser testing, Angular debugging tools, and Postman.

## API Methods and Endpoints

The application utilizes several RESTful HTTP methods:

- GET – Retrieve trip information
- POST – Create new records and user registrations
- PUT – Update existing records
- DELETE – Remove records when necessary

Endpoints expose application functionality while maintaining separation between the frontend and backend systems.

## Security Testing

Security testing included:

- Verifying user registration
- Verifying user login authentication
- Testing JWT token generation
- Testing protected routes
- Confirming unauthorized requests are rejected

Postman was used extensively to verify endpoint behavior and validate request and response data.

---

# Technologies Used

- Angular
- TypeScript
- Node.js
- Express
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- Passport
- Bootstrap
- Postman

---

# Author

Justin M. Davis

Southern New Hampshire University

CS-465 Full Stack Development
