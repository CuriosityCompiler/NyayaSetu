<<<<<<< HEAD
# ⚖️ NyayaSetu — Legal Aid & Rights Awareness Portal

> A secure, multilingual platform helping Indian citizens understand their rights and access free legal aid.
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg)](https://typescriptlang.org)

## 🌟 Features

- **Know Your Rights** — Simplified, source-backed legal explanations
- **Find Legal Aid** — Verified directory of free legal aid services across India
- **AI Assistant (NyayaMitra)** — Guided chatbot with source citations
- **Multilingual** — English, Kannada, Tamil, Telugu, Hindi, Marathi
- **Open access** — Browse legal guides, legal aid, and the assistant without creating an account
- **Secure by Default** — Argon2id hashing, JWT auth, RBAC, in-process endpoint-specific rate limiting, CSP headers
- **Accessible** — WCAG 2.2 AA target, keyboard navigation, screen reader support

## 🏗️ Architecture

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js 14 + React + TypeScript | SSR/SEO, typed components |
| UI | Tailwind CSS + Framer Motion | Responsive neutral-and-blue design system |
| Backend | NestJS + TypeScript | Modular REST API, RBAC |
| Database | PostgreSQL + Prisma | Structured data, migrations |
| Cache | Redis (optional) | Optional caching infrastructure |
| Deployment | Docker Compose | Reproducible builds |

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose (for PostgreSQL + Redis)
- A Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey) for chatbot responses

### 1. Clone & Configure
```bash
cp .env.example .env
# Edit .env with your values (especially JWT_SECRET and GEMINI_API_KEY)
```

### 2. Start Infrastructure
```bash
docker compose up -d postgres redis
```

### 3. Backend
```bash
cd backend
npm ci
npx prisma db push
npx prisma db seed
npm run start:dev
```

When running Prisma from your computer, `DATABASE_URL` must use `localhost:5432` and the same credentials configured for the Compose `postgres` service. The hostname `postgres` is only reachable from other containers on the Compose network. Use a concrete database name such as `legalaid` in `DATABASE_URL`; Compose's `${POSTGRES_DB:-legalaid}` syntax is not expanded inside a `.env` value. When running the backend on your computer, set `REDIS_URL` to `localhost:6379` with the same password configured for the Compose `redis` service; the hostname `redis` is only reachable from other containers.

The chatbot uses Google's hosted `gemini-3.6-flash` model on the Gemini API free tier; no model is downloaded or run locally. Set `GEMINI_API_KEY` in the project-root `.env` or `backend/.env`. The key is read only by the backend and must never be exposed in a `NEXT_PUBLIC_` variable. Use a free-tier project with billing disabled: the application calls only this model and has no paid-model or paid-provider fallback, but Google controls project billing and free-tier availability. If the free quota or rate limit is reached, the chatbot falls back to the approved source-language text where possible and does not switch to a paid model.

Questions and approved legal source text are sent to Google for model inference. On Google's unpaid tier, submitted prompts and responses may be used to improve Google products and may be reviewed by people. The chat interface shows this notice and requires the user to acknowledge it before sending a question. Users should not submit names, case identifiers, contact details, or other personal, confidential, or sensitive information. See [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing) and [Gemini API terms](https://ai.google.dev/gemini-api/terms) for current quotas and data handling.

If Gemini is unavailable or translation changes protected legal numbers, URLs, or symbols, the API reports `translation_unavailable`, shows a localized notice, and includes the approved source-language text rather than silently claiming a translation succeeded.

When adding an official translation through the protected content API, set `officialSourceUrl` only to the government page that actually publishes that translation. It is labelled `official_translation` only after editorial approval and validation against trusted HTTPS government domains; otherwise an approved translation is labelled `human_reviewed`.

Chat requests are limited to 5 per minute per client IP, using the shared Redis limiter when configured and process-local counters otherwise. Rate limiting does not make a locally hosted website available when its computer is powered off; the website, database, and backend still need an always-on host for 24/7 availability. This repository does not set up public HTTPS because that requires a continuously reachable server and public hostname/domain. The Compose website, API, database, and Redis ports are bound to `127.0.0.1`, so they are not exposed to other computers by this setup. Use a properly configured HTTPS reverse proxy before any public deployment.

The backend loads configuration from `backend/.env` or the project-root `.env`, so the root configuration created above is available when starting from this directory.

Redis is optional for local development. When `REDIS_URL` is configured, the API shares rate-limit counters through Redis across instances; otherwise limits are stored in process memory. Registration and sign-in are limited to 5 requests per minute per client IP, and password reset is limited to 3 requests per minute for reset requests and 5 for confirmations.

Public legal-guide and legal-aid GET responses support short-lived HTTP caching (`max-age=60`, with `stale-while-revalidate=300`) so a CDN or reverse proxy can reduce repeated database reads. The backend health probe checks PostgreSQL readiness, and the frontend container waits for a healthy backend before starting.

### Capacity and scaling

There is no fixed maximum-user count in the application code. Actual capacity depends on the CPU and memory assigned to the frontend and API, database connection limits and query latency, network/CDN behavior, and the mix of page loads versus chatbot/API requests. The checked-in Compose setup is a single-instance development/small deployment baseline, not a tested high-availability configuration; no user-count or requests-per-second guarantee can be made without load testing on the intended hosting plan.

For higher traffic, serve the Next.js static assets and cacheable public GET responses through a CDN, run multiple stateless frontend/API instances behind a load balancer, set `REDIS_URL` to a shared Redis service for rate-limit coordination, and use a managed PostgreSQL service with connection pooling sized for the total API replica count. Load-test the deployed setup with realistic legal search and chat traffic, then set replica, database-pool, and rate-limit values from measured latency/error-rate targets. The Docker Compose setup remains a single-instance deployment; multi-instance hosting and capacity require infrastructure outside this repository.

Public pages and their legal-information APIs require no account, paid identity service, or external API key. Administrative APIs and account-specific profile operations remain protected. `JWT_SECRET` is a server-side signing secret, not a third-party API key, and must never be placed in frontend code.

### 4. Frontend
```bash
cd frontend
npm install
npm run dev
```

Visit **http://localhost:3000**

The portal is publicly accessible. Its home, rights, legal-aid, how-to, sources, search, and assistant views are available as separate pages from the navigation. Sign-in and account-creation pages have been removed; administrative APIs and account-specific profile operations remain protected.

The language selector localizes the shared navigation, homepage, key rights/legal-aid controls, search interface, and chatbot interface, persists the selection, and updates the document language. For chatbot answers, approved reviewer translations are used when available; otherwise the local model drafts from approved database content and translates the result. Machine translations are labelled, and if generation/translation fails the API shows a localized warning plus the approved source-language text. The API never accepts model-generated citations; it attaches only source links that pass the official-domain allowlist.

## 🔒 Security

This portal implements comprehensive security following OWASP ASVS:

- ✅ Endpoint-specific rate limiting (shared Redis storage when configured; in-process otherwise)
- ✅ Strict CORS allowlist
- ✅ CSP, HSTS, X-Frame-Options headers (Helmet)
- ✅ Input validation & XSS sanitization
- ✅ RBAC (citizen, editor, reviewer, admin)
- ✅ Parameterized database queries (Prisma)
- ✅ Audit logging for admin actions
- ✅ Environment-based secret management

## 📞 Important

**National Legal Aid Helpline: 15100**

This portal provides legal information, not legal advice. Always consult a qualified lawyer for your specific situation.

## 📝 Official Sources

- [NALSA](https://nalsa.gov.in) — National Legal Services Authority
- [India Code](https://indiacode.nic.in) — Central Acts and Rules
- [Karnataka SLSA](https://karnataka.nalsa.gov.in) — State Legal Services

