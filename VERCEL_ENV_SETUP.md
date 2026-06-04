# Vercel Environment Variables Setup Guide

## Overview
AutoAppel requires 11 environment variables for production deployment on Vercel. Follow this guide to add each one.

---

## Steps to Add Variables to Vercel

1. Go to **[Vercel Dashboard](https://vercel.com/dashboard)**
2. Select your **AutoAppel** project
3. Click **Settings** → **Environment Variables**
4. Add each variable below with its value
5. After adding all, **redeploy** the project

---

## Required Environment Variables

### 1. **Supabase (Database + Authentication)**

| Variable | Value | Notes |
|----------|-------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://[your-supabase-id].supabase.co` | Public; safe to expose |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_[your-anon-key]` | Public; safe to expose |
| `SUPABASE_SERVICE_ROLE_KEY` | `sb_secret_[your-service-key]` | **SECRET** — never expose in client |
| `DATABASE_URL` | `postgresql://postgres:[PASSWORD]@db.[your-supabase-id].supabase.co:5432/postgres` | **SECRET** — Postgres connection string |

**Where to find:**
- Login to [Supabase Dashboard](https://app.supabase.com)
- Select **AutoAppel** project
- Click **Settings** → **API**
- Copy the URLs and keys shown

---

### 2. **Email (Resend)**

| Variable | Value | Notes |
|----------|-------|-------|
| `RESEND_API_KEY` | `re_[your-resend-api-key]` | **SECRET** — from Resend dashboard |
| `EMAIL_FROM` | `info@lagnafnetwork.com` | Sender email address |

**Where to find:**
- Login to [Resend Dashboard](https://resend.com)
- Click **API Keys** (left sidebar)
- Copy your default API key

---

### 3. **SMS (Twilio)**

| Variable | Value | Notes |
|----------|-------|-------|
| `TWILIO_ACCOUNT_SID` | `AC[your-account-sid]` | **SECRET** — Account identifier |
| `TWILIO_AUTH_TOKEN` | `[your-auth-token]` | **SECRET** — Auth token |
| `TWILIO_PHONE_NUMBER` | `+1[your-phone-number]` | Your Twilio phone number |
| `FOUNDER_ALERT_PHONE` | `[marc-phone-number]` | Marc's phone for alerts (no `+1` prefix) |

**Where to find:**
- Login to [Twilio Console](https://console.twilio.com)
- Copy **Account SID** and **Auth Token** from the dashboard
- Find your Twilio phone number under **Phone Numbers** → **Active Numbers**

---

### 4. **Stripe (Optional - Payment Processing)**

If you plan to enable live payments (currently in test mode):

| Variable | Value | Notes |
|----------|-------|-------|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` or `pk_live_...` | Public; can be test or live |
| `STRIPE_SECRET_KEY` | `sk_test_...` or `sk_live_...` | **SECRET** — test or live |

**Where to find:**
- Login to [Stripe Dashboard](https://dashboard.stripe.com)
- Click **Developers** → **API Keys**
- Copy **Publishable Key** and **Secret Key**

---

### 5. **HubSpot (Optional - CRM)**

| Variable | Value | Notes |
|----------|-------|-------|
| `HUBSPOT_ACCESS_TOKEN` | `pat-na2-[your-access-token]` | **SECRET** — personal access token |
| `HUBSPOT_FORM_ID` | `default-citation-form` | Form ID in HubSpot |
| `HUBSPOT_PIPELINE_ID` | `default` | Pipeline ID |
| `HUBSPOT_DEAL_STAGE_ID` | `appointmentscheduled` | Deal stage ID |

**Where to find:**
- Login to [HubSpot](https://app.hubspot.com)
- Click **Settings** → **Integrations** → **Private Apps**
- Copy your access token

---

### 6. **Environment Flag**

| Variable | Value | Notes |
|----------|-------|-------|
| `NODE_ENV` | `production` | Set to `production` for Vercel |

---

## Step-by-Step: Add to Vercel

### Method 1: Web Dashboard (Recommended)

1. Open **[Vercel Dashboard](https://vercel.com/dashboard)**
2. Click your **AutoAppel** project
3. Go to **Settings** tab
4. Click **Environment Variables** (left sidebar)
5. Click **Add New** for each variable:
   - Paste the **Variable Name** (e.g., `NEXT_PUBLIC_SUPABASE_URL`)
   - Paste the **Value** (e.g., `https://occojekrmkihlalxodch.supabase.co`)
   - Select scope: **Production** (unless testing preview deploys)
   - Click **Save**

6. After adding all 11 variables, click **Deployments** and **Redeploy** the latest commit

### Method 2: Vercel CLI (Advanced)

```bash
# Login to Vercel
vercel login

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add DATABASE_URL
vercel env add RESEND_API_KEY
vercel env add EMAIL_FROM
vercel env add TWILIO_ACCOUNT_SID
vercel env add TWILIO_AUTH_TOKEN
vercel env add TWILIO_PHONE_NUMBER
vercel env add FOUNDER_ALERT_PHONE
vercel env add NODE_ENV

# Redeploy
vercel --prod
```

---

## Verification Checklist

After adding all variables to Vercel:

- [ ] All 11 variables are set in **Production** environment
- [ ] No `undefined` or placeholder values remain
- [ ] Latest deployment shows **✅ Ready** (not ⚠️ Warnings)
- [ ] Can access `/login` page without errors
- [ ] Can submit a test login (check Supabase is reachable)
- [ ] Can receive test emails (check Resend is working)
- [ ] Can receive test SMS (check Twilio is working)

---

## Testing After Deployment

### 1. Test Customer Login
```
https://your-vercel-domain.vercel.app/login
Email: test@example.com
Password: Test@1234
```

### 2. Test Admin Login
```
https://your-vercel-domain.vercel.app/admin/login
Email: marc@lagnafnetwork.com
Password: Coai2026
```

### 3. Test Email Notifications
- Submit an appeal → should receive email via Resend
- Check spam/promotions folder if not in inbox

### 4. Test SMS Notifications
- Complete a payment → should receive SMS to Twilio number

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **Deployment fails with "Cannot find Supabase"** | Check `NEXT_PUBLIC_SUPABASE_URL` is correct and set for **Production** |
| **Login page loads but login fails** | Verify `SUPABASE_SERVICE_ROLE_KEY` is set (not just anon key) |
| **Emails not sending** | Check `RESEND_API_KEY` is correct; verify sender domain in Resend dashboard |
| **SMS not sending** | Check `TWILIO_AUTH_TOKEN` and `TWILIO_PHONE_NUMBER` are correct; verify account has SMS credits |
| **Payment page 404** | Verify `STRIPE_SECRET_KEY` is set if payment processing is enabled |

---

## Production Security Notes

✅ **DO:**
- Use environment variables for all secrets (Vercel encrypts them)
- Rotate API keys regularly
- Monitor Vercel logs for errors
- Test all critical flows after deployment

❌ **DON'T:**
- Commit `.env.local` to GitHub
- Share API keys in messages or chat
- Use test keys in production (use `sk_live_` and `pk_live_` for Stripe live payments)
- Expose `SUPABASE_SERVICE_ROLE_KEY` in client code

---

## Next Steps

1. **Add all 11 variables** to Vercel Production environment
2. **Redeploy** the latest code
3. **Test** customer & admin login flows
4. **Verify** email and SMS delivery
5. **Monitor** error logs for 24 hours post-launch
6. **Share** domain URL with Marc and Jason for final testing

---

## Questions or Issues?

- **Vercel Support:** https://vercel.com/support
- **Supabase Support:** https://supabase.com/support
- **Resend Support:** https://resend.com/docs
- **Twilio Support:** https://www.twilio.com/support

---

**Last Updated:** June 2026  
**Status:** Production Ready
