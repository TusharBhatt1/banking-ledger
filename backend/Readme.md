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
[All endpoints here](https://cloudy-meteor-226369.postman.co/workspace/Bank-Ledger~cb26e329-3898-478b-8648-650d7cd73cee/request/31709283-bed2b81d-51ba-45db-a661-68a6d4f15781?action=share&creator=31709283)

## Setup

```bash
git clone <https://github.com/TusharBhatt1/banking-ledger/backend>
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
