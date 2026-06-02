# 🚀 Vercel Deployment Instructions (Marc)

## Step 1: Create Vercel Project
1. Go to https://vercel.com/dashboard
2. Click **"Add New"** → **"Project"**
3. Select your GitHub repo: `jasonmanuel-cmd/autoappel`
4. Click **"Import"**

## Step 2: Add Environment Variables
When Vercel asks for environment variables, add these 12 values:

| Variable Name | Value | Type |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | From `.env.local` | Public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | From `.env.local` | Public |
| `SUPABASE_SERVICE_ROLE_KEY` | From `.env.local` | Secret |
| `DATABASE_URL` | From `.env.local` | Secret |
| `RESEND_API_KEY` | From `.env.local` | Secret |
| `EMAIL_FROM` | `info@lagnafnetwork.com` | Public |
| `HUBSPOT_ACCESS_TOKEN` | From `.env.local` | Secret |
| `HUBSPOT_FORM_ID` | From `.env.local` | Public |
| `HUBSPOT_PIPELINE_ID` | From `.env.local` | Public |
| `HUBSPOT_DEAL_STAGE_ID` | From `.env.local` | Public |
| `TWILIO_ACCOUNT_SID` | From `.env.local` | Secret |
| `TWILIO_AUTH_TOKEN` | From `.env.local` | Secret |
| `TWILIO_PHONE_NUMBER` | From `.env.local` | Public |
| `FOUNDER_ALERT_PHONE` | From `.env.local` | Public |
| `DEMO_PASSWORD` | `demo-2026` | Public |

## Step 3: Deploy
1. Click **"Deploy"**
2. Wait 3-5 minutes for Vercel to build and deploy
3. You'll see a deployment URL like: `autoappeal-xyz.vercel.app`

## Step 4: Update DNS
1. Go to your domain registrar (GoDaddy, Namecheap, etc.)
2. Add a CNAME record:
   - **Name:** `lagnafnetwork.com` (or `@`)
   - **Points to:** `cname.vercel.sh`
   - OR use Vercel's nameservers (shown in Vercel dashboard)
3. Wait 5-30 minutes for DNS to propagate

## Step 5: Test Production
1. Visit `https://lagnafnetwork.com`
2. Log in with admin credentials (from Supabase)
3. Submit a citation
4. Verify:
   - Email confirmation sent (Resend)
   - SMS alert received (Twilio) 
   - Deal created in HubSpot

## ✅ That's it!
Your app is now live in production.

## 📞 Support
- Vercel support: vercel.com/support
- All credentials are in your local `.env.local` file
