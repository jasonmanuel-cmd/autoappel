# AutoAppeal™ — Houston

Professional traffic citation filing platform built for the Apollo Build™ framework under LAGNAF™ network LLC. Multi-city deployable architecture for citation paperwork assistance, deadline tracking, and client management.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + CSS custom properties (3-layer design tokens) |
| State | Client-side store (localStorage) + server-side in-memory store |
| Deployment | Vercel |

## Project Structure

```
app/
├── api/                    # API routes (Phase 1)
│   ├── citations/          # POST (submit), GET (list)
│   ├── citations/[id]/     # GET (single), PATCH (status update)
│   ├── contact/            # POST (contact form)
│   ├── notifications/email/# POST (mock email)
│   └── health/             # GET (health check)
├── ambassadors/            # Ambassador management (admin)
├── confirmation/           # Post-submission confirmation
├── contact/                # Contact form + info
├── control-panel/          # Founder dashboard + submissions tab
├── countdown/              # Deadline tracking + risk levels
├── demo-payment/           # Payment simulator (demo mode)
├── faq/                    # Frequently asked questions
├── intake/                 # Multi-step citation intake form
├── login/                  # Demo mode login
├── page.tsx                # Public landing page
├── privacy/                # Privacy policy (TDPSA compliant)
├── qa/                     # QA scorecard (admin)
├── red-vault/              # Security monitoring (admin)
├── sitemap.ts              # XML sitemap
├── terms/                  # Terms of service
├── test-dashboard/         # Demo testing hub
├── track/                  # Alias → /countdown
├── treasury/               # Treasury profiles (admin)
├── globals.css             # Global styles + component tokens
├── layout.tsx              # Root layout
├── not-found.tsx           # Custom 404 page
└── middleware.ts           # Auth middleware (admin route protection)

components/
├── Nav.tsx                 # Responsive nav with hamburger menu
└── DemoBanner.tsx          # Demo mode indicator banner

lib/
├── store.ts                # Client-side data store (localStorage)
├── server-store.ts         # Server-side in-memory store
├── api.ts                  # Mock API client (demo mode)
└── types.ts                # TypeScript interfaces

assets/css/
└── design-tokens.css       # 3-layer design token system
```

## Routes Overview

| Route | Type | Description |
|-------|------|-------------|
| `/` | Public | Landing page |
| `/intake` | Public | Multi-step citation submission |
| `/track` | Public | Appeal tracking (→ /countdown) |
| `/countdown` | Public | Deadline countdown + risk visualization |
| `/confirmation` | Public | Post-submission confirmation |
| `/faq` | Public | Frequently asked questions |
| `/contact` | Public | Contact form + info |
| `/terms` | Public | Terms of service |
| `/privacy` | Public | Privacy policy |
| `/login` | Public | Demo mode login |
| `/control-panel` | Admin | Founder dashboard + submission management |
| `/ambassadors` | Admin | Ambassador CRUD |
| `/treasury` | Admin | Treasury profile management |
| `/red-vault` | Admin | Security monitoring + audit log |
| `/qa` | Admin | QA scorecard |
| `/test-dashboard` | Admin | Demo testing hub |
| `/demo-payment` | Admin | Payment flow simulator |

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

## Design System

Three-layer CSS custom property architecture:

1. **Primitive tokens** — base colors, spacing, typography, border radius
2. **Semantic tokens** — role-based mappings (bg, text, primary, danger, success, etc.)
3. **Component tokens** — button, card, input, nav, slide styles

Defined in `assets/css/design-tokens.css` and mapped to Tailwind classes via `tailwind.config.ts`.

## Authentication

Phase 1 uses demo mode authentication:
- Password: set via `DEMO_PASSWORD` in `lib/store.ts` (default: `demo-2026`)
- Login at `/login` sets a `aa_demo` cookie
- `middleware.ts` protects admin routes server-side
- Each admin page has a secondary client-side gate as safety net
- **Phase 2**: Replace with proper auth (Supabase Auth, NextAuth, etc.)

## Data Flow

```
User → Intake Form → POST /api/citations → Server Store (memory)
                  → localStorage (client store for demo/offline)

Admin → Control Panel → GET /api/citations → Submissions table
                      → PATCH /api/citations/:id → Status update

Contact → Contact Form → POST /api/contact → Server Store
```

## Phase 2 Integration Points

These require external services and credentials from the founder:

| Service | Purpose | What's Needed |
|---------|---------|---------------|
| Email (Resend/SendGrid) | Confirmation + reminder emails | API key + verified sender |
| HubSpot | CRM lead capture | Private app token or form ID |
| SMS (Twilio) | Deadline reminder texts | Account SID + auth token + phone number |
| Database (Supabase) | Persistent data storage | Connection string / project URL |

## Deployment

Deployed on Vercel. Connected via GitHub repository.

```bash
# Deploy via Vercel CLI
npx vercel --prod
```

## License

AutoAppeal™ — LAGNAF™ network LLC. All rights reserved.
