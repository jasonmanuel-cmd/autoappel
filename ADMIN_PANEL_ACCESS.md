# Admin Panel Access Guide

## Production Admin Login

### Local Development
1. Go to: **http://localhost:3000/login**
2. Select **"Admin Login"** tab
3. Enter credentials:
   - Email: `marc@lagnafnetwork.com`
   - Password: `Coai2026`
4. Click **"Sign In"**
5. You'll be taken to the control panel with full admin access

### Production (Vercel)
1. Go to: **https://AppealMyTickets.com/login**
2. Select **"Admin Login"** tab
3. Enter credentials:
   - Email: `marc@lagnafnetwork.com`
   - Password: `Coai2026`
4. Click **"Sign In"**
5. Full admin access to all production systems

---

## What You'll See in the Admin Panel

### Overview Tab (Default)
- **System Status**: Live deployment status
- **Control Toggles**: 
  - Founder Approval
  - Ambassador System
  - Citation Intake
- **Risk Dashboard**: Citations by risk level (red, orange, yellow, expired)
- **Deployment Controls**: Monitor and manage the system

### Submissions Tab
Shows all citation submissions with:
- Citation ID
- Submission date
- Current status (pending, approved, rejected)
- Ability to update status directly

---

## Features Available in Admin Panel
✅ View system deployment status  
✅ Toggle ambassador system on/off  
✅ Toggle citation intake on/off  
✅ View all submissions (real or demo data)  
✅ Update citation status  
✅ View risk dashboard  
✅ Emergency shutdown capability  
✅ Audit log access  
✅ Full founder control

---

## Demo Mode (Testing)

If you want to test with sample data instead:
1. Go to **Login** page
2. In dev mode, you can toggle to **"Demo Mode"**
3. Use password: `demo-2026`
4. Visit **/test-dashboard** for demo experience

---

## Links
- **Local Admin**: http://localhost:3000/login
- **Production Admin**: https://AppealMyTickets.com/login
- **After Auth - Local**: http://localhost:3000/control-panel
- **After Auth - Production**: https://AppealMyTickets.com/control-panel

