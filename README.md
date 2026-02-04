# ucw Project ✅

A sample Next.js 14 app for order management and partner dashboards. Includes authentication with OTP (via SMS or email), simple in-memory data store for demo purposes, product listings, and admin-style dashboard pages.

A modern Order Management System built with Next.js 14 (App Router) to support real-world manufacturers, distributors, and partners.
This project demonstrates authentication, partner dashboards, order workflows, and admin controls using a clean and scalable architecture.

📌 Project Overview

This application helps companies manage:

Products

Distributor / Partner accounts

Orders & order status

---

## 🚀 Quick start

1. Install dependencies

```bash
npm install
```

2. Create a `.env.local` in the project root (see Environment variables below)

3. Run the development server

```bash
npm run dev
```

Open http://localhost:3000

---

## ⚙️ Features

- Phone/email based authentication with OTP
- SMS sending via Twilio (configurable)
- Email notifications via SMTP
- Orders, products, ledger demo pages
- Simple in-memory DB (replace with real DB for production)

---

## 🔒 Environment variables

Create a `.env.local` with the following values:

```env
# Twilio (for SMS)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+91 9721085784

# SMTP (for emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM="kapoorprajapati9695@gmail.com"

# App settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

> ⚠️ Do not commit secrets to version control. Use `.env.local` and add it to `.gitignore`.

Refer to `SMS_SETUP.md` for detailed Twilio setup instructions.

---

## 🧪 Development notes

- The app uses an in-memory DB (`src/lib/db.ts`) for demo/testing. For production, plug in MongoDB, Postgres, or another persistent store.
- OTPs are logged to the console in development mode. Twilio will only be used when production credentials are provided.
- To change the project brand (example: product names, logos), search the codebase for the old brand strings and update them. Example: we renamed `ucw` in the source.

---

## 🧩 Project structure (important files)

- `src/app/` — Next.js app routes & pages
- `src/components/` — UI components
- `src/lib/send-sms.ts` — Twilio SMS helper
- `src/lib/email.ts` — SMTP email helper
- `src/lib/db.ts` — demo in-memory DB
- `SMS_SETUP.md` — Twilio setup guide

---

## ✅ Scripts

- `npm run dev` — start dev server
- `npm run build` — build for production
- `npm run start` — start production server
- `npm run lint` — run ESLint

---

## Contributing

Contributions are welcome. Please open issues or PRs and follow the code style in the repo.

---

If you want, I can also add a CONTRIBUTING.md, add a short Getting Started section for deployment, or scaffold a `.env.example` file with placeholders. Tell me which you'd like next. ✨
