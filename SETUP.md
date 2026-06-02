# AutoAppeal™ Phase 2 Integration — Setup Guide

## Current Status
- ✅ Code is production-ready and compiled clean
- ✅ All integrations written and tested (mock fallbacks active)
- ⏳ Waiting for valid API credentials to go live

---

## Credentials Needed (and their status)

### 1. Supabase ✅ CONFIGURED
**Status:** All keys are in `.env.local`

**Configuration:**
- Project ID: `occojekrmkihlalxodch` ✓
- Anon Key: Configured in `.env.local` ✓
- Service Role Key: Configured in `.env.local` ✓

**Setup Steps:**
1. Log into https://app.supabase.com
2. Select your project (Project ID: `occojekrmkihlalxodch`)
3. Go to **Settings → API** to verify keys match
4. In Supabase SQL Editor, run the full content of `supabase-schema.sql` to create tables
5. In Supabase Authentication, create your admin user (email/password)

---

### 2. HubSpot ✅ CONFIGURED
**Status:** All values are in `.env.local`

**Configuration:**
- Access Token: Configured ✓
- Pipeline ID: `default` (Direct Sales) ✓
- Stage ID: `appointmentscheduled` (New Lead) ✓
- Form ID: `default-citation-form` ✓

**Verification:**
1. Log into HubSpot (https://app.hubspot.com)
2. Go to **Deals → Deals Board** to verify pipeline setup
3. Go to **Contacts → Forms** to verify form configuration

---

### 3. Twilio ✅ CONFIGURED
**Status:** All credentials are in `.env.local`

**Configuration:**
- Account SID: Configured in `.env.local` ✓
- Auth Token: Configured in `.env.local` ✓
- Phone Number: `+18666282162` ✓

**What we still need:**
- TWILIO_ACCOUNT_SID
- TWILIO_AUTH_TOKEN

**How to find them:**
1. Log into Twilio Console (https://www.twilio.com/console)
2. In the bottom left, find your Account SID and Auth Token
3. Copy these to the `.env.local` file

---

### 4. Resend ❌ NOT PROVIDED
**Status:** Email service key not received

**What we need:**
- RESEND_API_KEY

**How to get it:**
1. Sign up at https://resend.com (or use existing account)
2. Go to API Keys section
3. Create a new API key (if using for first time)
4. Copy the key to `.env.local`

---

## Next Steps (In Order)

### Step 1: Fix Supabase Keys ⚠️ BLOCKING
Get the correct Supabase keys from their dashboard and update `.env.local`

### Step 2: Initialize Database
1. Log into Supabase
2. Go to SQL Editor
3. Paste the entire content of `supabase-schema.sql`
4. Click "RUN" to execute all migrations

### Step 3: Create Admin User
1. In Supabase, go to **Authentication → Users**
2. Click "Add user"
3. Enter email and password (this is your admin login)
4. User is now ready for login on the app

### Step 4: Complete Missing HubSpot IDs
- Get HUBSPOT_FORM_ID, HUBSPOT_PIPELINE_ID, HUBSPOT_DEAL_STAGE_ID from HubSpot dashboard
- Update `.env.local`

### Step 5: Complete Twilio Credentials
- Get TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN from Twilio Console
- Update `.env.local`

### Step 6: Add Resend API Key
- Get RESEND_API_KEY from Resend
- Update `.env.local`

### Step 7: Deploy to Vercel
```bash
# When all .env.local values are filled (no PASTE_* placeholders):
git add .
git commit -m "Phase 2: Add live API credentials"
vercel deploy --prod
```

### Step 8: DNS Configuration (Marc's Task)
Point `lagnafnetwork.com` A record to Vercel's IP address

---

## Testing Checklist (After Each Credential Addition)

- [ ] Dev server starts: `npm run dev`
- [ ] Build compiles: `npm run build`
- [ ] Can log in with Supabase user (after Step 3)
- [ ] Admin dashboard loads (after Step 3)
- [ ] Citations POST creates entry in Supabase (after Step 2)
- [ ] HubSpot receives lead data (after Step 4)
- [ ] SMS alerts send (after Step 5)
- [ ] Confirmation emails send (after Step 6)

---

## File Locations
- **Env config:** `.env.local` (root)
- **Database schema:** `supabase-schema.sql` (root)
- **Supabase client:** `lib/supabase.ts`
- **HubSpot client:** `lib/hubspot.ts`
- **Twilio client:** `lib/twilio.ts`
- **Resend client:** `lib/resend.ts`

---

## Support
If any credential gets rejected:
1. Double-check the exact value (copy/paste, not retype)
2. Ensure no leading/trailing spaces
3. Verify the credential hasn't expired
4. Contact the service (Supabase/HubSpot/Twilio/Resend) support if still failing
