# Tictactrip — Text Justification API

A lightweight REST API that justifies text to 80 characters per line, with JWT authentication and per-token rate limiting. Built with TypeScript and zero external dependencies.

---

## Features

- **Text Justification** — formats plain text to exactly 80 characters per line
- **JWT Authentication** — HS256 tokens with a 1-hour expiration
- **Rate Limiting** — 80,000 words per token per day (resets at midnight)
- **Health Check** — simple endpoint to confirm the API is running

---

## Prerequisites

- Node.js v20+
- npm

---

## Installation

```bash
git clone <repo-url>
cd tictactrip
npm install
```

---

## Running the Server

### Development (auto-reload on file change)

```bash
npm run dev
```

### Production

```bash
npx tsc
node dist/server.js
```

The server starts on **port 3030**.

```
SERVER LISTENING ON PORT 3030
```

---

## API Reference

Base URL: `http://localhost:3030`

### GET /api/health

Check that the API is running.

**Response**

```
200 OK
API WORKING!
```

---

### POST /api/token

Authenticate and receive a JWT token.

**Request body**

```json
{
  "email": "admin@email.com",
  "password": "admin123"
}
```

**Response**

```
200 OK
<jwt-token>
```

**Error codes**

| Code | Reason |
|------|--------|
| 400  | Missing fields or wrong credentials |
| 500  | Internal error |

---

### POST /api/justify

Justify text to 80-character lines.

**Headers**

```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request body**

```json
{
  "text": "Your text content here..."
}
```

**Response**

```
200 OK
<justified text, each line padded to 80 characters>
```

**Error codes**

| Code | Reason |
|------|--------|
| 402  | Rate limit exceeded (80,000 words/day per token) |
| 403  | Missing or invalid token |
| 500  | Internal error |

---

## Running Tests

Tests use Node.js's native test runner and make real HTTP requests, so **the server must be running** before you run them.

**Terminal 1 — start the server:**

```bash
npm run dev
```

**Terminal 2 — run tests:**

```bash
npm run test
```

**Run tests with coverage:**

```bash
npm run coverage
```

The test suite covers:

- Health endpoint
- Token generation (valid and invalid credentials)
- Text justification (authorized and unauthorized)
- Rate limit enforcement

---

## Project Structure

```
tictactrip/
├── src/
│   ├── server.ts              # HTTP server entry point
│   ├── handler.ts             # Request router
│   ├── routes/api/
│   │   ├── health.ts          # GET /api/health
│   │   ├── auth.ts            # POST /api/token
│   │   └── justify.ts         # POST /api/justify
│   ├── utils/
│   │   ├── auth.ts            # JWT generation and verification
│   │   ├── justify.ts         # 80-char justification algorithm
│   │   ├── rateLimit.ts       # Per-token daily rate limiting
│   │   ├── parse.ts           # JSON field validation
│   │   └── readData.ts        # HTTP body parser
│   └── __test__/
│       ├── index.ts           # Test suite
│       └── testCases/case1/
│           ├── input.txt      # Sample input text
│           └── output.txt     # Expected justified output
├── dist/                      # Compiled output (auto-generated)
├── tsconfig.json
└── package.json
```

---

## Configuration

All configuration is set in source — no environment files are needed.

| Setting | Value |
|---------|-------|
| Port | `3030` |
| JWT secret | `"secret"` |
| Token expiry | `3600s (1 hour)` |
| Line width | `80 characters` |
| Rate limit | `80,000 words / token / day` |
| Rate limit window | resets at midnight |

> Note: credentials and the JWT secret are hardcoded for development purposes. Change them before any production use.

---

## Notes

- Rate limit state is stored in memory and resets on server restart.
- The service has no database or external dependencies — only Node.js built-ins are used.
