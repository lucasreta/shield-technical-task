# 🛡️ Shield API

A battle-tested, full-stack TypeScript backend for secure user and wallet management.

Built with love and:
- **Express.js + TypeScript**
- **PostgreSQL + Prisma**
- **Zod for validation**
- **Jest + Supertest for tests**
- **JWT-based authentication**
- **Swagger-powered API docs**

---

## 📦 Setup

```bash
git clone https://github.com/your-org/shield-api.git
cd shield-api
cp .env.example .env
docker-compose up -d
npx prisma migrate dev
npm install
npm run dev
```

---

## 🚀 Scripts

| Script              | Description                            |
|---------------------|----------------------------------------|
| `npm run dev`       | Start server in dev mode (hot-reload)  |
| `npm run start`     | Run compiled app from `dist/`          |
| `npm run build`     | Compile TypeScript to `dist/`          |
| `npm run test`      | Run all unit and integration tests     |
| `npm run test:cov`  | Run tests with coverage report         |
| `npm run lint`      | Run ESLint                             |
| `npm run lint:fix`  | Auto-fix lint errors                   |
| `npm run check`     | Lint + type check + test in one go     |
| `npm run migrate`   | Run DB migrations via Prisma           |
| `npm run studio`    | Launch Prisma Studio                   |

---

## 🧪 Test Coverage

![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)

```text
Statements   : 100%
Branches     : 100%
Functions    : 100%
Lines        : 100%
```

- ✅ All services, controllers, middleware, validators and routes covered
- ✅ Includes error handling, token revocation, and ACL edge cases

---

## 🔐 Auth Flow

- `POST /signin` → returns JWT token
- All wallet routes require `Authorization: Bearer <token>`
- `authenticate` middleware:
  - Validates JWT and expiry
  - Checks token blacklist (sign-out enforcement)
  - Attaches `req.user = { userId, email? }`
- All access-controlled queries validate user ownership and throw `404` on mismatch

---

## 📘 API Docs

- Swagger UI: [`http://localhost:3000/api-docs`](http://localhost:3000/api-docs)
- Auto-generated from Zod schemas + OpenAPI annotations

---

## 🧰 Tech Stack

- **Express.js** — Fast minimalist backend framework
- **Prisma** — Type-safe ORM for PostgreSQL
- **Zod** — Schema-first validation
- **JWT** — Auth tokens with expiration + blacklist
- **Jest** — Full unit + integration testing
- **Supertest** — HTTP assertions
- **ts-node-dev** — Dev environment runner
- **ts-jest** — TS-native test harness

---

## 📁 Folder Structure

```
src/
├── controllers/       # Route handlers (express)
├── services/          # Domain logic / core features
├── middleware/        # Auth, error, validation logic
├── validators/        # Zod validation schemas
├── routes/            # Route definitions
├── config/            # Prisma, Swagger, env setup
├── utils/             # Custom errors and helpers
├── types/             # Global TS type definitions
```

---

## 🧱 Principles

- ✅ **SOLID architecture**
- ✅ **Clean separation of concerns**
- ✅ **Strict type safety**
- ✅ **Test-first development**
- ✅ **Security-first design**

---

## 🧃 Made with rage, caffeine, and TypeScript.
