# Admin Panel Access Guide

## Quick Access (While Waiting for Supabase Setup)

### Local Development
1. Go to: **http://localhost:3000/login**
2. Click the **"View Admin Panel (Demo)"** button
3. You'll be taken to the control panel with demo data

### Production (Vercel)
1. Go to: **https://autoappel1.vercel.app/login**
2. Click the **"View Admin Panel (Demo)"** button
3. You'll be taken to the control panel with demo data

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

## After Supabase Setup

Once Marc sets up Supabase:
1. Go to: **http://localhost:3000/login** (or production URL)
2. Click **"Admin Login"**
3. Use credentials: `marc@lagnafnetwork.com` / `Coai2026`
4. You'll be authenticated with real Supabase data

The demo button will still work anytime.

---

## Features Available in Demo Mode
✅ View system deployment status  
✅ Toggle ambassador system on/off  
✅ Toggle citation intake on/off  
✅ View all submissions (demo data)  
✅ Update citation status  
✅ View risk dashboard  
✅ Emergency shutdown capability  
✅ Audit log access

---

## Links
- **Local**: http://localhost:3000/login → "View Admin Panel (Demo)"
- **Production**: https://autoappel1.vercel.app/login → "View Admin Panel (Demo)"
- **Direct (after auth)**: http://localhost:3000/control-panel
