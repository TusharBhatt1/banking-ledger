# Bank Ledger

A backend for user auth, accounts, and ledger-based transactions. Built with **Node.js**, **Express**, and **MongoDB**.

<img width="458" height="476" alt="image" src="https://github.com/user-attachments/assets/c9aa6657-230f-42f7-80fc-a17e4910c650" />


## Overview

- Register/login with JWT auth
- Create an account
- Send transactions between accounts, recorded in a central ledger

Balances aren't stored — they're **derived from the ledger** via an aggregation pipeline, so the ledger is the single source of truth.

## Features

- Auth: register, login, logout (JWT + bcrypt + cookie-parser + token blacklist)
- Email notifications on register/transaction (Nodemailer)
- Idempotent transaction creation
- Transaction lifecycle: `PENDING` → `COMPLETED` / `REVERSED`
- Double-entry ledger (debit + credit per transaction)

## Tech Stack

Node.js · Express · MongoDB Atlas (Mongoose) · JWT · bcrypt · Nodemailer · dotenv

## Data Model

| Model | Key Fields |
|---|---|
| **User** | name, email, password (hashed) |
| **Account** | userId, status, currency *(no balance field)* |
| **Transaction** | idempotencyKey, fromAccountId, toAccountId, amount, status |
| **Ledger** | transactionId, accountId, type (`DEBIT`/`CREDIT`), amount |
| **Blacklist** | token *(for logout/JWT invalidation)* |

## Transaction Flow

1. Dedupe via `idempotencyKey`
2. Validate account status + sender balance (aggregated from ledger)
3. Create `Transaction` as `PENDING`
4. Write `DEBIT` + `CREDIT` ledger entries
5. On success → `COMPLETED` (+ email). On failure → `REVERSED`, no partial entries left behind

## API Endpoints

**Auth**
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`

**Accounts**
- `POST /api/accounts`
- `GET /api/accounts/:id/status`
- `GET /api/accounts/:id/balance`

**Transactions**
- `POST /api/transactions`
- `GET /api/transactions/:id`

## Setup

```bash
git clone <your-repo-url>
cd bank-ledger
npm install
```

`.env`:
```env
PORT=3001
MONGO_URI=
JWT_SECRET=
GOOGLE_APP_PASSWORD=
GOOGLE_CLIENT
```

```bash
npm run dev
```

Runs at `http://localhost:3001`. Test via Postman.

## Deployment

Deploy to Render/Railway (or similar) with MongoDB Atlas as the DB. Set env vars in the host dashboard.

## License

MIT
