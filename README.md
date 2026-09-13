# Linkify — URL Shortener

A full-stack URL shortening web app built with **Next.js** on the frontend and **Spring Boot** on the backend. Users can register, create short links, and track click analytics through a clean dashboard.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [How It Works](#how-it-works)
- [Contributing](#contributing)

---

## Overview

**Linkify** is a minimal, focused URL shortener. Paste a long URL, get a short link, share it, and watch the clicks roll in — all from one clean dashboard. It's designed to be simple and distraction-free with just the features that matter.

---

## Features

- 🔗 **Shorten URLs** — Generate short links instantly from any long URL
- 📊 **Click Analytics** — View per-link click events filtered by date range
- 📈 **Total Clicks Dashboard** — Aggregated click data across all your links
- 🗑️ **Delete Links** — Remove any short link you own
- 🔒 **JWT Authentication** — Secure register/login with stateless JWT tokens
- 🔀 **Instant Redirects** — Short URLs redirect to the original in milliseconds
- 🌗 **Theme Support** — Light and dark mode via `next-themes`

---

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| [Next.js 16](https://nextjs.org/) | React framework with App Router |
| [React 19](https://react.dev/) | UI rendering |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first styling |
| [shadcn/ui](https://ui.shadcn.com/) | Accessible UI component library |
| [Recharts](https://recharts.org/) | Analytics charts |
| [Zustand](https://zustand-demo.pmnd.rs/) | Client-side state management |
| [Axios](https://axios-http.com/) | HTTP client |
| [React Hook Form](https://react-hook-form.com/) | Form state & validation |
| [Lucide React](https://lucide.dev/) | Icon set |
| [next-themes](https://github.com/pacocoursey/next-themes) | Dark/light mode |

### Backend

| Technology | Purpose |
|---|---|
| [Spring Boot 4.1](https://spring.io/projects/spring-boot) | REST API framework |
| [Java 21](https://openjdk.org/) | Runtime language |
| [Spring Security](https://spring.io/projects/spring-security) | Authentication & authorization |
| [Spring Data JPA](https://spring.io/projects/spring-data-jpa) | ORM / database access |
| [MySQL](https://www.mysql.com/) | Relational database |
| [JJWT 0.13](https://github.com/jwtk/jjwt) | JWT token creation & validation |
| [Lombok](https://projectlombok.org/) | Boilerplate reduction |
| [Maven](https://maven.apache.org/) | Build tool |

---

## Project Structure

```
url-shortner/
├── frontend/                   # Next.js application
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/         # Sign-in & Sign-up pages
│   │   │   │   ├── sign-in/
│   │   │   │   └── sign-up/
│   │   │   ├── (dashboard)/    # Protected dashboard pages
│   │   │   │   ├── home/       # Main dashboard with URL shortener
│   │   │   │   └── all-links/  # All links with analytics
│   │   │   ├── layout.tsx      # Root layout
│   │   │   └── page.tsx        # Public landing page
│   │   ├── components/
│   │   │   ├── auth/           # Auth-related UI components
│   │   │   ├── dashboard/      # Dashboard-specific components
│   │   │   ├── providers/      # Context providers (theme, etc.)
│   │   │   └── ui/             # shadcn base components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/                # Utility functions
│   │   ├── store/              # Zustand global state
│   │   └── proxy.ts            # API proxy configuration
│   ├── .env                    # Frontend environment variables
│   ├── next.config.ts
│   └── package.json
│
└── url-shortner-sb/            # Spring Boot application
    └── src/main/java/com/url/shortner/
        ├── controller/
        │   ├── AuthController.java         # Register & login endpoints
        │   ├── UrlMappingController.java   # URL CRUD & analytics endpoints
        │   └── RedirectController.java     # Short URL → redirect
        ├── models/
        │   ├── User.java                   # User entity
        │   ├── UrlMapping.java             # Short link entity
        │   └── ClickEvent.java             # Per-click tracking entity
        ├── dtos/                           # Request/Response data transfer objects
        ├── repository/                     # Spring Data JPA repositories
        ├── services/                       # Business logic layer
        ├── security/
        │   ├── WebSecurityConfig.java      # Security filter chain & CORS
        │   ├── WebConfig.java              # MVC configuration
        │   └── jwt/                        # JWT filter & utilities
        └── UrlShortnerSbApplication.java   # Application entry point
```

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

- **Java 21+**
- **Maven 3.8+**
- **Node.js 18+** and **npm**
- **MySQL 8+**

---

### Backend Setup

1. **Create the database**

   ```sql
   CREATE DATABASE urlshortnerdb;
   ```

2. **Configure environment**

   Open `url-shortner-sb/src/main/resources/application.properties` and update the credentials:

   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/urlshortnerdb
   spring.datasource.username=<your-mysql-username>
   spring.datasource.password=<your-mysql-password>
   jwt.secret=<your-256-bit-hex-secret>
   jwt.expiration=172800000
   frontend.url=http://localhost:3000
   ```

   > **Note:** `jwt.expiration` is in milliseconds. `172800000` = 48 hours.

3. **Run the backend**

   ```bash
   cd url-shortner-sb
   ./mvnw spring-boot:run
   ```

   The API will start at **`http://localhost:8080`**.

   Spring JPA will automatically create and update the database schema on startup (`ddl-auto=update`).

---

### Frontend Setup

1. **Install dependencies**

   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment**

   Create or update `frontend/.env`:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080
   ```

3. **Run the dev server**

   ```bash
   npm run dev
   ```

   The app will be available at **`http://localhost:3000`**.

---

## Environment Variables

### Frontend (`frontend/.env`)

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the Spring Boot backend | `http://localhost:8080` |

### Backend (`application.properties`)

| Property | Description |
|---|---|
| `spring.datasource.url` | MySQL JDBC connection URL |
| `spring.datasource.username` | MySQL username |
| `spring.datasource.password` | MySQL password |
| `spring.jpa.hibernate.ddl-auto` | Schema generation strategy (`update` / `create`) |
| `jwt.secret` | 256-bit hex secret for signing JWT tokens |
| `jwt.expiration` | JWT expiry in milliseconds |
| `frontend.url` | Allowed origin for CORS |

---

## API Reference

All API endpoints are served from `http://localhost:8080`.

### Authentication

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `POST` | `/api/auth/public/register` | ❌ | Register a new user |
| `POST` | `/api/auth/public/login` | ❌ | Login and receive a JWT token |

**Register request body:**
```json
{
  "username": "john",
  "email": "john@example.com",
  "password": "secret123"
}
```

**Login request body:**
```json
{
  "username": "john",
  "password": "secret123"
}
```

**Login response:**
```json
{
  "token": "<jwt-token>"
}
```

---

### URL Management

All endpoints below require the `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/urls/shorten` | Create a new short URL |
| `GET` | `/api/urls/myurls` | Get all short URLs for the logged-in user |
| `DELETE` | `/api/urls/{id}` | Delete a short URL by ID |
| `GET` | `/api/urls/analytics/{shortUrl}` | Get click events for a specific short URL in a date range |
| `GET` | `/api/urls/totalClicks` | Get total clicks aggregated by date for the logged-in user |

**Shorten URL request body:**
```json
{
  "originalUrl": "https://very-long-url.com/path/to/something"
}
```

**Analytics query params:**
- `startDate` — ISO datetime, e.g. `2024-01-01T00:00:00`
- `endDate` — ISO datetime, e.g. `2024-12-31T23:59:59`

**Total clicks query params:**
- `startDate` — ISO date, e.g. `2024-01-01`
- `endDate` — ISO date, e.g. `2024-12-31`

---

### Redirect

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `GET` | `/{shortUrl}` | ❌ | Redirects to the original URL (HTTP 302) |

---

## How It Works

```
User visits /{shortUrl}
        │
        ▼
  RedirectController looks up the short code in the DB
        │
   Found? ──Yes──► HTTP 302 → originalUrl  (click event recorded)
        │
        No
        │
        ▼
   HTTP 404 Not Found
```

**Short URL generation:** When a user submits a long URL, the backend generates a unique short code (stored in the `UrlMapping` table) tied to the user's account. Every time the short URL is visited, a `ClickEvent` record is saved, enabling time-series analytics.

**Authentication flow:**
1. User registers → password is hashed with BCrypt and stored.
2. User logs in → server validates credentials and returns a signed JWT.
3. Every protected request sends the JWT in the `Authorization` header → `JwtAuthenticationFilter` validates it and sets the security context.

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'feat: add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

> Built with ☕ and ⚛️ — Spring Boot + Next.js
