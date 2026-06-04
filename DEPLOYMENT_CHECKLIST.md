# AutoAppel Deployment Checklist

## Pre-Deployment Verification

### Environment Variables ✓
- [ ] `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- [ ] `STRIPE_PUBLIC_KEY` - Stripe publishable key
- [ ] `STRIPE_SECRET_KEY` - Stripe secret key
- [ ] `RESEND_API_KEY` - Resend email API key
- [ ] `RESEND_FROM_EMAIL` - Resend sender email address
- [ ] `TWILIO_ACCOUNT_SID` - Twilio account SID
- [ ] `TWILIO_AUTH_TOKEN` - Twilio auth token
- [ ] `TWILIO_PHONE_NUMBER` - Twilio phone number for SMS
- [ ] `NODE_ENV=production` - Set to production

### Code Quality ✓
- [ ] Run `npm run lint` - All files pass linting
- [ ] Run `npm run type-check` - No TypeScript errors
- [ ] Run `npm run test` - All unit tests pass
- [ ] Run `npm run e2e` - All E2E tests pass
- [ ] No hardcoded secrets in code
- [ ] No console.logs left in production code
- [ ] Middleware properly blocks demo mode in production

### Database ✓
- [ ] All Supabase tables created and populated
- [ ] RLS policies enabled on all tables
- [ ] Triggers and functions working correctly
- [ ] Sample data loaded for testing
- [ ] Admin users (Marc, Jason) created and verified

### Authentication ✓
- [ ] Supabase Auth configured
- [ ] Email verification working
- [ ] Password reset flow tested
- [ ] Admin login page accessible
- [ ] Customer login page hides admin link
- [ ] Session timeouts configured

### Features ✓
- [ ] Customer dashboard fetches live citations
- [ ] Citation detail page shows all information
- [ ] Appeal submission works
- [ ] Payment plan request works
- [ ] Dismissal request works
- [ ] Payment processing works
- [ ] Admin dashboard shows all citations
- [ ] Admin can update citation status
- [ ] Admin can update payment status

### Notifications ✓
- [ ] Email service configured with Resend
- [ ] SMS service configured with Twilio
- [ ] Submission emails sent on form completion
- [ ] Payment confirmation emails sent
- [ ] Rate limiting middleware active
- [ ] CSRF tokens validated

### Security ✓
- [ ] CORS headers properly configured
- [ ] Rate limiting enabled (100 requests per 15 min)
- [ ] CSRF tokens validated on all forms
- [ ] SQL injection prevention (Supabase RLS)
- [ ] XSS prevention (React escaping)
- [ ] Password requirements enforced
- [ ] SSL/HTTPS enabled on Vercel

### Performance ✓
- [ ] Images optimized
- [ ] Bundle size within limits
- [ ] No console errors in production build
- [ ] Page load time < 3s
- [ ] Lighthouse score > 80

## Deployment Steps

### Step 1: Final Testing
```bash
# Run all tests
npm run lint
npm run type-check
npm run e2e

# Build production
npm run build

# Test production build locally
npm start
```

### Step 2: Vercel Deployment
```bash
# Deploy to Vercel
vercel --prod

# Monitor deployment
vercel logs --prod
```

### Step 3: Production Verification
1. Test customer signup flow
2. Test customer login
3. Test citation viewing
4. Test submission forms
5. Test payment flow
6. Test admin login
7. Test admin dashboard
8. Verify email notifications
9. Verify SMS notifications
10. Check error logging

### Step 4: Post-Deployment
- [ ] Monitor error logs
- [ ] Check email delivery
- [ ] Verify SMS delivery
- [ ] Monitor performance
- [ ] Test with real users (Marc, Jason)
- [ ] Collect feedback

## Rollback Plan
If deployment fails:
1. Run `vercel rollback`
2. Check Supabase status
3. Verify environment variables
4. Check error logs
5. Redeploy with fixes

## Launch Timeline
- **Target:** 7:00 AM
- **Deployment Window:** 6:00 AM - 7:00 AM
- **Buffer Time:** 30 minutes

## Production Monitoring
- Error rate: < 1%
- Response time: < 500ms
- Email delivery: 99%+ success
- SMS delivery: 99%+ success
- Uptime: 99.9%

## Support Contacts
- **Marc:** marc@lagnafnetwork.com
- **Jason:** jasonm@coaibakersfield.com
- **Tech Lead:** On-call during launch
