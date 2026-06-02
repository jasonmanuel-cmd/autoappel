# AutoAppeal™ Phase 2 — Final Credentials Checklist

**Status:** Production code is ready. Waiting for 3 remaining credentials to go live.

---

## What We Have ✅
- Supabase Project ID: `occojekrmkihlalxodch`
- Twilio Account SID: `AC0...` (configured in .env.local)
- Twilio Auth Token: `4fc...` (configured in .env.local)
- Twilio Phone: `+1866...` (configured in .env.local)
- HubSpot Access Token: `pat-na2-...` (configured in .env.local)

---

## What We Still Need ❌

### 1. SUPABASE API KEYS (CRITICAL — BLOCKING)
**Why:** Database authentication and user login won't work without these

**How to get them:**
1. Go to https://app.supabase.com
2. Click your project: `occojekrmkihlalxodch`
3. Left sidebar → Click **Settings**
4. Click **API** tab
5. Copy these 2 values and send them:

**Value A:** Project URL
- Label: "Project URL" or "NEXT_PUBLIC_SUPABASE_URL"
- Example: `https://occojekrmkihlalxodch.supabase.co`

**Value B:** Anon public key
- Label: "Anon public key" or "NEXT_PUBLIC_SUPABASE_ANON_KEY"
- Format: Long string (100+ characters) starting with `eyJ...`

**Value C:** Service role secret
- Label: "Service role secret" or "SUPABASE_SERVICE_ROLE_KEY"
- Format: Long string (100+ characters) starting with `eyJ...`

⚠️ The short keys sent before were incomplete. These will be MUCH longer (JWT format).

---

### 2. HUBSPOT IDS (MEDIUM PRIORITY)
**Why:** Leads won't be created in HubSpot without these

**How to get them:**
1. Go to https://app.hubspot.com
2. Navigate to **Contacts → Forms** 
   - Find the form you want to use for citations
   - Copy its **Form ID** (long string like `12345-abc-67890`)
   - Send as: `HUBSPOT_FORM_ID`

3. Navigate to **Deals → Deals Board**
   - Look at your pipeline settings
   - Find your **Pipeline ID** (string like `0-1` or pipeline name)
   - Send as: `HUBSPOT_PIPELINE_ID`

4. In the same pipeline settings, find a deal stage
   - Copy the **Stage ID** (string like `negotiation` or numeric ID)
   - Send as: `HUBSPOT_DEAL_STAGE_ID`

**Alternative:** Contact HubSpot support — they can give you these IDs directly.

---

### 3. RESEND API KEY (HIGH PRIORITY)
**Why:** Confirmation emails won't send without this

**How to get it:**
1. Go to https://resend.com (sign up if needed)
2. Log in to your account
3. Go to **API Keys** section (left sidebar)
4. Click **Create API Key**
5. Copy the key and send as: `RESEND_API_KEY`

---

## Email Template for Marc

```
Subject: AutoAppeal™ Phase 2 — 3 Final Credentials Needed to Deploy

Hi Marc,

The AutoAppeal™ production code is ready to go live. We just need 3 final credentials:

**1. SUPABASE API KEYS (CRITICAL)**
Go to https://app.supabase.com → Your Project (occojekrmkihlalxodch) → Settings → API
Send these 3 values:
- Project URL
- Anon public key  
- Service role secret

Note: These will be long strings (~100+ chars) starting with "eyJ", NOT the short keys sent before.

**2. HUBSPOT FORM/PIPELINE/STAGE IDS**
Go to https://app.hubspot.com → Deals/Forms section
Send these 3 values:
- HUBSPOT_FORM_ID (from Forms page)
- HUBSPOT_PIPELINE_ID (from Deals Board)
- HUBSPOT_DEAL_STAGE_ID (from pipeline settings)

Or contact HubSpot support for these IDs.

**3. RESEND API KEY**
Go to https://resend.com → API Keys → Create API Key
Send the key value.

Once you send these, I can deploy live within 15 minutes.

Thanks!
```

---

## Timeline Once Credentials Arrive
1. **Immediately:** Add credentials to environment
2. **5 min:** Initialize Supabase database (run SQL schema)
3. **5 min:** Create admin login user in Supabase
4. **5 min:** Deploy to Vercel
5. **Done:** System is live at https://lagnafnetwork.com (after DNS update)

---

## Current `.env.local` Status
```
✅ Twilio: COMPLETE
✅ Supabase URL: CONFIGURED (waiting for API keys)
✅ HubSpot Token: CONFIGURED (waiting for form/pipeline/stage IDs)
❌ Resend: MISSING (waiting for API key)
❌ HubSpot IDs: MISSING (3 values needed)
❌ Supabase API Keys: INVALID/INCOMPLETE (need real JWT keys)
```

---

## Questions?
- Supabase support: support@supabase.com
- HubSpot support: help.hubspot.com
- Resend support: support@resend.com

Everything else is production-ready.
