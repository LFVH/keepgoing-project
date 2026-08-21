# Keep Going

Keep Going is a full-stack workout diary built to help users plan routines, log completed sessions, and turn training data into visible progress. It was developed as a portfolio project that brings together subscription access, authenticated user data, and an interactive fitness dashboard in one application.

## What it does

- **Account and access management** — users can sign up and log in with email and password. Protected routes use session-based authentication.
- **Subscription checkout** — Stripe Checkout supports monthly, semiannual, and yearly subscription plans. Webhooks synchronize subscription status with the application database.
- **Workout planning** — create routines, add exercises with sets, reps, load, duration, notes, and order, then edit, duplicate, archive, or reactivate them.
- **Workout diary** — record completed sessions, including body weight, notes, perceived effort, and the exercises actually performed.
- **Training calendar and history** — browse training activity by month, quickly add entries for a chosen day, and review a chronological log of completed workouts.
- **Progress analytics** — compare planned and completed training volume over time, globally or filtered by exercise. Volume is calculated from repetitions × sets × load.
- **Personalized data** — routines, diary entries, exercises, and subscription information are associated with the authenticated user.

## Tech stack

| Area | Technologies |
| --- | --- |
| Front end | Next.js 15, React 18, TypeScript |
| Styling and UI | Tailwind CSS, Radix UI, Headless UI, RSuite, Heroicons, Lucide |
| State and forms | TanStack Query, React Hook Form, Zod |
| Back end | Next.js App Router route handlers |
| Authentication | NextAuth Credentials provider, JWT sessions, bcryptjs |
| Database | PostgreSQL, Prisma ORM |
| Payments | Stripe Checkout and webhooks |
| Data visualization | Chart.js, react-chartjs-2 |
| Utilities | dayjs and date-fns |

## Architecture highlights

The project uses Next.js App Router for both the client experience and server endpoints. Prisma models represent users, routines, exercises, planned executions, completed executions, diary entries, refresh tokens, and subscription fields. Middleware guards the private application and API routes, while Stripe webhook events update subscription records after billing events.

## Local setup

### Prerequisites

- Node.js 18.18 or later
- npm
- A PostgreSQL database
- A Stripe account for checkout and webhook functionality

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root and add your values:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"
ALLOWED_DOMAIN="http://localhost:3000"

NEXT_PUBLIC_STRIPE_PUB_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_SUBSCRIPTION_PRICEMONTH_ID="price_..."
STRIPE_SUBSCRIPTION_PRICESEMES_ID="price_..."
STRIPE_SUBSCRIPTION_PRICEANUAL_ID="price_..."
```

For local Stripe webhook testing, forward events to the application using the Stripe CLI and set the resulting signing secret as `STRIPE_WEBHOOK_SECRET`.

### 3. Start the application

```bash
npm run dev
```

The development script pushes the Prisma schema, generates the Prisma client, and starts Next.js. Open [http://localhost:3000](http://localhost:3000).

## Available scripts

```bash
npm run dev               # Synchronize Prisma schema and run the development server
npm run build             # Create a production build
npm run start             # Run the production server
npm run prisma:generate   # Generate the Prisma client
```

## Project structure

```text
src/
├── app/                 # Pages, API route handlers, and feature flows
│   ├── api/             # Authentication, Stripe, workout, diary, and analytics APIs
│   └── letsgo/          # Private workout dashboard
├── components/          # Reusable UI, calendar, and chart components
├── database/            # Prisma client setup
├── lib/                 # Shared integrations, including Stripe
└── middleware.ts        # Authentication and route protection
prisma/
└── schema.prisma        # PostgreSQL data model
```

## Portfolio notes

Keep Going demonstrates a complete product flow: account creation, paid access, protected user data, routine management, workout logging, and progress reporting. The project emphasizes the integration points that are typical of a production SaaS application—authentication, relational data modeling, external payments, and client-side data synchronization.

## License

This project is private and intended for portfolio demonstration.
