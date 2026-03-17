# 💸 Bullet Loan Manager

A full-stack web app for managing **bullet loans** —
because sometimes you just want to pay interest now and worry about the big stuff later 😌

---

## ✨ Features

- ➕ Create new bullet loans
- 📊 View repayment schedules
- 🔍 Search, sort, and paginate loans
- ⚡ Fast GraphQL API
- 🩺 Liveness & readiness health checks (yes, we care about uptime 💪)

---

## 🧰 Tech Stack

| Layer    | Technology                                 |
| -------- | ------------------------------------------ |
| Frontend | React, TypeScript, Styled Components, Vite |
| API      | GraphQL (Apollo Server & Apollo Client)    |
| Backend  | Node.js, Express, TypeORM                  |
| Database | SQLite (via sql.js — zero setup 🎉)        |
| Testing  | Jest                                       |
| Tooling  | GraphQL Code Generator                     |
| Deploy   | Docker & Docker Compose                    |

---

## 🚀 Quick Start

### 🐳 With Docker (recommended)

> The easiest way to get everything running — no setup headaches 🙌

> ⚠️ Make sure Docker Desktop is installed and **running** before proceeding!

```bash
git clone https://github.com/ElishAronstam/bullet-loan-manager
cd bullet-loan-manager
docker compose up
```

Open in your browser:

- 🌐 Frontend → http://localhost:4000
- 🔗 GraphQL → http://localhost:8000/graphql

Health checks:

- ❤️ Liveness → http://localhost:8000/health/live
- 🧠 Readiness → http://localhost:8000/health/ready

To stop:

```bash
docker compose down
```

---

### 💻 Local Development (no Docker)

#### Prerequisites

- Node.js 20+
- npm

#### Backend

```bash
cd backend
npm install
npm run dev
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🏗️ Architecture

The app is split into two services:

- **Frontend** — React app built with Vite.
  Handles UI, user interaction, and GraphQL queries.

- **Backend** — Express + Apollo GraphQL server.
  Handles business logic, loan calculations, and persistence.

This separation keeps things clean, scalable, and easy to maintain.

---

## ⚙️ Environment Variables

### Backend

- `PORT` — server port (default: `8000`)
- `FRED_API_KEY` — your FRED API key ([get one here](https://fred.stlouisfed.org/docs/api/api_key.html))
- `FRED_PRIME_RATE_URL` — FRED API endpoint
- `PRIME_RATE_CACHE_TTL_DAYS` — how long to cache rates (default: `30`)

### Frontend

- `PORT` — frontend port (default: `4000`)
- `VITE_SERVER_URL` — GraphQL endpoint
- `VITE_TIMEOUT_MS` — request timeout

---

## 🗄️ Database

Uses SQLite via `sql.js`.

- No installation needed
- Automatically created on first run
- Perfect for lightweight setups and demos

---

## 📦 Prime Rate Caching

Interest rates are fetched from the [FRED API](https://fred.stlouisfed.org/) (Federal Reserve Economic Data).
To avoid hitting the API on every request, the backend uses an **in-memory cache** with a configurable TTL:

- Rates are cached after the first fetch and reused for subsequent loan calculations
- The cache automatically expands when a wider date range is requested
- TTL is configurable via `PRIME_RATE_CACHE_TTL_DAYS` (default: 30 days)

This keeps things fast without stale data 🏎️

---

## 🧠 Design Decisions

- **GraphQL** → flexible and strongly typed API
- **Codegen** → type-safe frontend queries
- **SQLite (sql.js)** → no external DB dependency
- **Docker Compose** → reproducible environment in one command
- **Health checks** → reflect production-ready service design

---

## 🧪 Testing

Run backend tests:

```bash
cd backend
npm test
```

---

## 🔮 Future Improvements

- 🚀 Delete, edit & filter loans
- 🔐 Authentication & authorization
- 🧪 Integration / E2E tests
- 🐘 Switch to PostgreSQL for production

---

## 💖 Final Note

Built with care (and a lot of coffee ☕)

If you made it this far — thanks for checking it out!
