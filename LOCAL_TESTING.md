# 🧪 Local Testing Guide - AutoAppeal™

## ✅ Server Status
- **URL:** http://localhost:3000
- **Status:** Running locally with all integrations active
- **Environment:** Development (demo mode active, real APIs enabled)

---

## 📋 Test Checklist

### 1. Authentication
- [ ] Visit http://localhost:3000/login
- [ ] Try "Demo" button (username: `demo`, password: `demo-2026`)
- [ ] Should see demo mode banner at top
- [ ] Try admin login (your Supabase email/password)
- [ ] Should see "Logged in" state

### 2. Citation Form
- [ ] Click "Submit Citation" or go to http://localhost:3000
- [ ] Fill in:
  - Name: `Test User`
  - Email: `test@example.com`
  - Phone: `+18005551234`
  - Citation details: Any test data
- [ ] Click "Submit"
- [ ] **Expected results:**
  - ✅ Page shows success message
  - ✅ Check your email (Resend) - confirmation email sent
  - ✅ Check HubSpot - new deal created
  - ✅ Founder phone (+1 949-350-8804) should get SMS (Twilio)

### 3. Admin Dashboard
- [ ] Log in as admin (Supabase credentials)
- [ ] Go to http://localhost:3000/admin
- [ ] Should see:
  - List of all submissions
  - Filtering options
  - Stats/count

### 4. API Endpoints (Test in Browser or Postman)

#### Test HubSpot Integration
```
GET http://localhost:3000/api/hubspot/deals
Expected: Returns list of deals
```

#### Test Supabase Auth
```
GET http://localhost:3000/api/auth/verify
Expected: Returns current user (if logged in) or null
```

#### Test Resend Email
```
POST http://localhost:3000/api/email/send
Body: {
  "to": "your-email@example.com",
  "subject": "Test",
  "body": "Test email"
}
Expected: Email sent successfully
```

#### Test Twilio SMS
```
POST http://localhost:3000/api/sms/send
Body: {
  "phone": "+18005551234",
  "message": "Test SMS"
}
Expected: SMS sent to phone
```

---

## 🔍 What to Check

### Security ✅
- [ ] Demo banner shows only in dev/local
- [ ] `/admin` routes require login
- [ ] CSP headers present (check DevTools → Network → Response Headers)
- [ ] No console errors about missing environment variables

### Database ✅
- [ ] Submissions are stored in Supabase
- [ ] Can retrieve submissions via admin dashboard
- [ ] Data persists after refresh

### External Services ✅
- [ ] **Resend:** Check spam folder if email doesn't appear
- [ ] **Twilio:** Text message arrives within 30 seconds
- [ ] **HubSpot:** Deal appears in your pipeline within 1 minute
- [ ] **Supabase:** Data appears in dashboard

---

## 🐛 Troubleshooting

### "Environment variable missing" error
- Check `.env.local` has all 12 variables
- Restart server: Press Ctrl+C, then run `npm start` again

### Emails not arriving
- Check Resend dashboard: https://resend.com/emails
- Verify `EMAIL_FROM` matches Resend verified domain

### SMS not arriving
- Verify phone number format: `+1[area][number]`
- Check Twilio logs: https://www.twilio.com/console/sms/logs

### HubSpot deal not created
- Check HubSpot API token in `.env.local`
- Verify pipeline ID and stage ID are correct
- Check HubSpot API logs: https://app.hubspot.com/integrations/logs

### Database connection error
- Verify Supabase URL and keys in `.env.local`
- Check Supabase status: https://app.supabase.com

---

## ✅ When Everything Works

Once all tests pass:
1. Stop local server: Press Ctrl+C
2. Update DNS at domain registrar to point to Vercel
3. Wait 5-30 minutes for DNS propagation
4. Visit https://lagnafnetwork.com (should match Vercel deployment)
5. Run same tests on production domain

---

## 📞 Quick Links
- **Local:** http://localhost:3000
- **Vercel:** Check your deployment URL in Vercel dashboard
- **Production:** https://lagnafnetwork.com (after DNS update)

**Happy testing!** 🎉
