# 🚀 DEPLOYMENT QUICK START GUIDE

## For Marc: Copy-Paste Deployment Steps

---

## ✅ PRE-DEPLOYMENT CHECKLIST

- [ ] All credentials are in `.env.local`
- [ ] Build compiles clean (`npm run build` successful)
- [ ] You have admin access to Vercel, GitHub, and domain registrar

---

## STEP 1: DEPLOY TO VERCEL (5 minutes)

### Option A: Via Vercel Web Dashboard (EASIEST)

1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Select your GitHub/GitLab repository
4. When prompted for framework, select **Next.js** (auto-detected)
5. Before clicking "Deploy", expand "Environment Variables"
6. Add ALL variables from `.env.local` (do NOT paste credentials here, they are in .env.local):

**Public Variables (from .env.local):**
```
NEXT_PUBLIC_SUPABASE_URL=https://occojekrmkihlalxodch.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[from .env.local]
EMAIL_FROM=info@lagnafnetwork.com
DEMO_PASSWORD=demo-2026
```

**Secret Variables (from .env.local - copy exactly as shown there):**
```
SUPABASE_SERVICE_ROLE_KEY=[from .env.local]
DATABASE_URL=[from .env.local]
RESEND_API_KEY=[from .env.local]
HUBSPOT_ACCESS_TOKEN=[from .env.local]
HUBSPOT_FORM_ID=[from .env.local]
HUBSPOT_PIPELINE_ID=[from .env.local]
HUBSPOT_DEAL_STAGE_ID=[from .env.local]
TWILIO_ACCOUNT_SID=[from .env.local]
TWILIO_AUTH_TOKEN=[from .env.local]
TWILIO_PHONE_NUMBER=[from .env.local]
FOUNDER_ALERT_PHONE=[from .env.local]
```

⚠️ **IMPORTANT:** Never paste credentials in the prompt or documentation. Copy from `.env.local` directly into Vercel.

7. Click "Deploy"
8. Wait ~3-5 minutes for deployment
9. Copy the deployment URL (looks like: `autoappeal.vercel.app`)

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
cd C:\Users\blunt\Desktop\apps\2_IN_PROGRESS_40-60\AutoAppel
vercel --prod
```

---

## STEP 2: CONFIGURE CUSTOM DOMAIN (5 minutes)

1. Go to your Vercel project dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain: `lagnafnetwork.com`
4. Follow Vercel's DNS instructions (usually one of these):

### Option A: Use Vercel Nameservers (Easiest)
- Go to your domain registrar
- Update nameservers to:
  - `ns1.vercel-dns.com`
  - `ns2.vercel-dns.com`
  - `ns3.vercel-dns.com`

### Option B: Add CNAME Records (For existing nameserver)
- Go to your domain registrar
- Update DNS records:
  ```
  A record @ 76.76.19.165 (get current IP from Vercel)
  CNAME www cname.vercel-dns.com
  ```

5. Wait 5-30 minutes for DNS propagation

---

## STEP 3: VERIFY DEPLOYMENT (5 minutes)

1. **Check Vercel Deployment:**
   - Visit your Vercel project dashboard
   - Look for green "Ready" status

2. **Test Application:**
   - Open https://lagnafnetwork.com (or wait if DNS still propagating)
   - You should see the login page

3. **Login Test:**
   ```
   Email:    marc@lagnafnetwork.com
   Password: Coai2026
   ```

4. **Test Citation Submission:**
   - Click "New Citation"
   - Fill in test data
   - Submit
   - Verify it appears in dashboard

5. **Verify HubSpot Integration:**
   - Go to HubSpot dashboard
   - Check "Deals" → "Direct Sales" pipeline
   - Verify new deal was created

6. **Check Email Notification:**
   - Check your email for confirmation

7. **Check SMS Notification:**
   - Verify SMS received at `+1 949-350-8804`

---

## ✅ POST-DEPLOYMENT CHECKLIST

- [ ] Vercel deployment shows "Ready"
- [ ] Custom domain resolves to app
- [ ] Login page loads
- [ ] Can login with credentials
- [ ] Can submit citation
- [ ] Citation appears in HubSpot
- [ ] Email notification received
- [ ] SMS notification received
- [ ] Admin dashboard accessible

---

## 🔍 TROUBLESHOOTING

### Domain not resolving?
- Check that DNS records are added correctly
- Wait 24-48 hours for full propagation (DNS cache)
- Use online tool: https://dnschecker.org

### Login not working?
- Verify credentials in Vercel Environment Variables match `.env.local`
- Check Supabase Auth dashboard for user
- Check Vercel logs for errors

### Citation not appearing in HubSpot?
- Verify HubSpot credentials in Vercel
- Check HubSpot API logs
- Verify pipeline ID is correct: `default`

### Email not sending?
- Check Resend dashboard for errors
- Verify SPF/DKIM records are configured
- Check Vercel logs for Resend API errors

### SMS not sending?
- Verify Twilio credentials in Vercel
- Check Twilio console for errors
- Verify phone number format

---

## 🎯 WHAT YOU DEPLOYED

✅ 30+ web pages
✅ 12 API endpoints
✅ 4 external service integrations
✅ 8 production database tables
✅ User authentication system
✅ Citation management system
✅ CRM integration
✅ Email notifications
✅ SMS notifications

---

## 📞 SUPPORT

- **Vercel Logs:** https://vercel.com → Dashboard → Logs
- **Supabase Dashboard:** https://app.supabase.com (Project: occojekrmkihlalxodch)
- **HubSpot Dashboard:** https://app.hubspot.com
- **Resend Dashboard:** https://resend.com
- **Twilio Console:** https://www.twilio.com/console

---

## ⏱️ ESTIMATED TIMELINE

| Phase | Time | Status |
|-------|------|--------|
| Vercel Setup | 5 min | ⏳ Next |
| Environment Vars | 5 min | ⏳ Next |
| Initial Deploy | 3-5 min | ⏳ Next |
| DNS Config | 5 min | ⏳ After Deploy |
| DNS Propagation | 5-30 min | ⏳ After DNS Config |
| **Total** | **25-50 min** | ⏳ Estimated |

---

**You're ready to go live! 🚀**

Questions? Check `DEPLOYMENT_READY.md` or `PHASE_2_COMPLETION.md` for detailed information.
