# Admin vs Member Dashboard Login Guide

## Overview
theGarage recruiter system now has **two separate dashboards**:
1. **Admin Dashboard** (RecruiterHomepage.tsx) - For organization admins
2. **Member Dashboard** (IndividualMemberDashboard.tsx) - For recruiting team members

## Demo Login Credentials

### Admin Access
- **Email:** `admin@thegarage.com`
- **Password:** (any password works in demo mode)
- **Role:** Select "Recruiter" at role selection
- **Dashboard:** Admin Dashboard with organization management features

### Member Access
- **Email:** `member@thegarage.com`
- **Password:** (any password works in demo mode)
- **Role:** Select "Recruiter" at role selection
- **Dashboard:** Individual Member Dashboard with day-to-day recruiting operations

## How to Access Each Dashboard

### Access Member Dashboard (Individual Recruiter)
**Method 1: Direct Login as Member**
1. Go to landing page
2. Click "Login" or "Get Started"
3. Select **"Recruiter"** role
4. Enter email: `member@thegarage.com`
5. Enter any password
6. Click "Sign In"
7. ✅ You'll **automatically** land on the **Member Dashboard** with full recruiting operations

**Method 2: From Admin Dashboard**
1. Login as admin (`admin@thegarage.com`)
2. Navigate to **"Team Management"** (Institution Profile)
3. Click on any team member card
4. Navigate to that member's **Individual Dashboard**

### Access Admin Dashboard (Organization Manager)
**Direct Login as Admin**
1. Go to landing page
2. Click "Login" or "Get Started"
3. Select **"Recruiter"** role
4. Enter email: `admin@thegarage.com`
5. Enter any password
6. Click "Sign In"
7. ✅ You'll **automatically** land on the **Admin Dashboard** with organization management features

## Dashboard Features

### Admin Dashboard (RecruiterHomepage.tsx)
**For:** Organization owners/admins who manage the recruiting organization

**Features:**
- ✅ Team Management (add/remove recruiters, manage roles/permissions)
- ✅ Organization Settings (company profile, branding)
- ✅ System Analytics (org-wide performance metrics)
- ✅ Access Control (security and permissions)
- ✅ Team Activity Feed (monitor what recruiters are doing)
- ✅ Organization-wide stats (total jobs, candidates, team capacity)

**Removed:**
- ❌ Post Job button
- ❌ Manage Candidates
- ❌ Job Postings management
- ❌ Interview Calendar
- ❌ Direct messaging

### Member Dashboard (IndividualMemberDashboard.tsx)
**For:** Individual recruiters who do day-to-day recruiting work

**Features:**
- ✅ Post Job (create new job postings)
- ✅ Manage Candidates (review applications, screen candidates)
- ✅ Job Postings (manage their assigned jobs)
- ✅ Interview Calendar (schedule and manage interviews)
- ✅ Messages (communicate with candidates) - NOW WORKING
- ✅ My Stats (detailed personal performance metrics with KPIs, coffee chats, activities)
- ✅ Personal recruiting stats (my jobs, my candidates, my interviews, coffee chats)
- ✅ Recent applications and activity

**Removed:**
- ❌ Company button (members don't see org-wide stats)

## Automatic Dashboard Routing

The system **automatically determines** which dashboard to show when a recruiter logs in:

### ViewRenderer.tsx Logic
```typescript
const isAdmin = user?.role === 'admin' || user?.isInstitutionCreator || user?.isInstitutionAdmin;

if (isAdmin) {
  // Route to Admin Dashboard (RecruiterHomepage)
} else {
  // Route to Member Dashboard (IndividualMemberDashboard)
}
```

### User Profiles in App.tsx

```typescript
// Admin user profile
{
  email: 'admin@thegarage.com',
  role: 'admin',
  isInstitutionCreator: true,
  isInstitutionAdmin: true,
  // 🔹 Auto-routes to: Admin Dashboard (RecruiterHomepage)
}

// Member user profile
{
  email: 'member@thegarage.com',
  role: 'recruiter',
  isInstitutionCreator: false,
  isInstitutionAdmin: false,
  // 🔹 Auto-routes to: Member Dashboard (IndividualMemberDashboard)
}
```

## Navigation Flow

```
Landing Page
    ↓
Select "Recruiter" Role
    ↓
Login/SignUp
    ↓
    ├─→ Admin User → Admin Dashboard (RecruiterHomepage)
    │                     ↓
    │                Team Management → Click Member → Member Dashboard
    │
    └─→ Member User → Member Dashboard (IndividualMemberDashboard)
```

## Adding Member Dashboard to Navigation

Currently, the member dashboard is accessible via:
1. **Direct login** as a member user (`member@thegarage.com`)
2. **From admin dashboard** → Team Management → Click on a team member

If you want to add a direct navigation link, you can add it to the homepage routing logic or create a role-based redirect system.

## Testing Both Dashboards

1. **Test Admin Dashboard:**
   ```
   Login → admin@thegarage.com → Select Recruiter
   Result: See Admin Dashboard with Team Management, Organization Settings, etc.
   ```

2. **Test Member Dashboard:**
   ```
   Login → member@thegarage.com → Select Recruiter
   Result: See Member Dashboard with Post Job, Manage Candidates, etc.
   ```

3. **Test Navigation Between:**
   ```
   Admin Dashboard → Team Management → Click "View Dashboard" on member card
   Result: Navigate to that member's Individual Dashboard
   ```

## Notes

- Both dashboards maintain theGarage branding (orange #ff6b35)
- Both use the dark blue/orange gradient theme
- The system is fully role-based and scalable
- All changes were made ONLY to RecruiterHomepage.tsx (Admin)
- IndividualMemberDashboard.tsx (Member) was NOT touched and remains intact
