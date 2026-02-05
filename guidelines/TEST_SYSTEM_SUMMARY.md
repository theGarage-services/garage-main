# 🧪 Test System - Master Profile & Team Management

## Overview

A complete parallel implementation of the Master Profile and Team Management system that can be reviewed and tested without affecting the existing recruiter functionality.

## Access

**Entry Point:** Recruiter Profile Dropdown → "🧪 Test System" (marked with NEW badge)

The Test System is a completely separate area that you can access, test, and review. Your existing recruiter system remains 100% untouched.

## What's Built

### ✅ Core Infrastructure

1. **Type Definitions** (`/types/team.ts`)
   - Complete TypeScript types for permissions, roles, departments, organizations
   - 22 granular permission modules (jobs, candidates, interviews, team, analytics, etc.)
   - 4 role templates: Full Recruiter, Hiring Manager, HR Admin, Interviewer
   - Department, Activity Log, and Approval workflow types

2. **Permission System** (`/hooks/useTestPermissions.ts`)
   - Context-based permission management
   - `hasPermission()`, `hasAnyPermission()`, `hasAllPermissions()` hooks
   - Job-level access control with `canAccessJob()`
   - 5 mock users for testing different roles

3. **Mock Data** (`/utils/testMockData.ts`)
   - Complete mock organization (TechCorp Industries)
   - 6 team members (1 master + 5 members with different roles)
   - 3 departments (Engineering, HR, Sales & Marketing)
   - Activity log with 8 sample entries
   - 2 pending approvals
   - 3 mock jobs and candidates

### ✅ Components Built

#### Master Profile Views
- **TestMasterDashboard** - Full-featured admin dashboard
- **TestTeamMemberList** - Complete team management with search/filters
- **TestTeamMemberInvite** - Invite flow with role templates and custom permissions
- **TestPermissionEditor** - Granular permission editor with categories
- **TestActivityLog** - Full activity tracking with filters and CSV export
- **TestDepartmentManagement** - Create and manage departments
- **TestOwnershipTransfer** - (Ready to implement)
- **TestApprovalWorkflow** - (Ready to implement)

#### Team Member Views
- **TestTeamMemberDashboard** - Limited dashboard based on permissions
- **TestAccessDenied** - Permission restriction messages with request access

#### Utility Components
- **PermissionGate** - Wrapper component for permission-based rendering
- **TestSystemMain** - Main router with user role switcher

### ✅ Features Implemented

#### Master Profile Capabilities
✅ View complete organization overview  
✅ See all team members with status (Active/Pending/Suspended)  
✅ Invite new team members with granular permissions  
✅ Assign role templates (Full Recruiter, Hiring Manager, etc.)  
✅ Create custom roles with specific permissions  
✅ Assign members to departments  
✅ Restrict members to specific jobs  
✅ View complete activity log (who did what, when)  
✅ Create and manage departments  
✅ Export activity data to CSV  
✅ See pending approvals  
✅ Full access to all features  

#### Team Member Capabilities
✅ Limited dashboard based on assigned permissions  
✅ See only assigned jobs (if restricted)  
✅ Request additional access from admin  
✅ View own activity history  
✅ Access only permitted features  
✅ Clear permission restriction messages  

#### Permission System
✅ 22 granular permissions across 7 categories  
✅ Job-level access control  
✅ Department-based organization  
✅ Role templates with pre-configured permissions  
✅ Custom role creation  
✅ Permission inheritance  

#### Activity & Audit
✅ Complete activity log for master profile  
✅ Track all actions (jobs, candidates, team, departments)  
✅ Filter by type, date range, and search  
✅ Export to CSV for reporting  
✅ Detailed metadata for each action  

## How to Test

### Testing Different User Roles

At the top of the Test System, you'll see a **"TEST MODE"** banner with a dropdown. This lets you instantly switch between different user personas:

1. **Sarah Johnson (Master)** - Full admin access
   - See everything, do everything
   - View all team members, activity logs, departments
   - Invite members, assign permissions

2. **John Recruiter (Full Access)** - Complete recruiter permissions
   - Full job and candidate management
   - Can create, edit, delete jobs
   - Schedule interviews, manage calendar

3. **Lisa Manager (Limited)** - Hiring manager role
   - View and rank candidates only
   - Limited to specific jobs
   - Can schedule interviews
   - No job creation/deletion

4. **Mike Interviewer (Calendar Only)** - Very limited access
   - Calendar and interview scheduling only
   - View candidates
   - Send messages

5. **Emma HR (HR Admin)** - HR-focused permissions
   - Job posting and analytics
   - No candidate movement
   - View-focused role

### Testing Workflow

1. **Start as Master Profile (Sarah Johnson)**
   - Explore the master dashboard
   - View team members
   - Try inviting a new member
   - Create a department
   - View activity log

2. **Switch to Team Member (e.g., Lisa Manager)**
   - Notice the limited dashboard
   - See restricted features (grayed out or access denied)
   - Try to access a restricted feature → see access denied message
   - Notice only assigned jobs are visible

3. **Test Permission Editor**
   - As Master, go to Team → Click "Edit Permissions" on a member
   - Toggle different permissions
   - See how role templates auto-populate permissions
   - Create a custom role

4. **Test Department Management**
   - Create a new department
   - Assign colors and descriptions
   - See member counts

5. **Test Activity Log**
   - View all team activities
   - Filter by type (jobs, candidates, team, etc.)
   - Search for specific actions
   - Export to CSV

## Features Answered from Your Questions

### ✅ Master Profile Ownership Transfer
**Question:** Should the Master Profile be able to transfer ownership?  
**Answer:** Yes  
**Status:** Type structure ready, UI component ready to implement

### ✅ Activity Logs / Audit Trails
**Question:** Do you want activity logs?  
**Answer:** Under master profile yes  
**Status:** ✅ Complete - Full activity log with filtering and export

### ✅ Team Member Visibility
**Question:** Should team members see each other?  
**Answer:** Master sees all  
**Status:** ✅ Complete - Master sees all, members see limited

### ✅ Department/Group Hierarchy
**Question:** Should there be departments?  
**Answer:** Yes  
**Status:** ✅ Complete - Full department management

### ⏳ Future Features (Answered but Not Yet Implemented)

1. **Billing**: One subscription covers all team members
2. **Approval Workflows**: Team member creates job → master approves
   - Structure ready in types
   - Mock data includes pending approvals
   - UI component ready to implement

## Architecture

### Permission Categories
```
1. Job Management
   - jobs.create, jobs.edit, jobs.delete, jobs.publish

2. Candidate Management
   - candidates.view, candidates.contact, candidates.rank, candidates.move

3. Interview Management
   - interviews.schedule, interviews.manage, calendar.view, calendar.manage

4. Team Management
   - team.invite, team.remove, team.edit

5. Analytics & Reports
   - analytics.view, analytics.export

6. Communication
   - messaging.send

7. Settings & Departments
   - settings.company, settings.billing, departments.create, departments.manage
```

### Role Templates
```
Full Recruiter → 14 permissions (complete job & candidate management)
Hiring Manager → 5 permissions (view, rank, schedule interviews)
HR Admin → 7 permissions (job posting, analytics)
Interviewer → 4 permissions (calendar, basic candidate view)
Custom → Any combination
```

## File Structure

```
/types/team.ts                          - All TypeScript types
/hooks/useTestPermissions.ts            - Permission management hook
/utils/testMockData.ts                  - Mock data for testing

/components/
  ├── TestSystemMain.tsx                - Main router & entry point
  ├── TestMasterDashboard.tsx           - Master admin dashboard
  ├── TestTeamMemberDashboard.tsx       - Limited member dashboard
  ├── TestTeamMemberList.tsx            - Team management list
  ├── TestTeamMemberInvite.tsx          - Invite new members
  ├── TestPermissionEditor.tsx          - Permission editing UI
  ├── TestActivityLog.tsx               - Activity tracking
  ├── TestDepartmentManagement.tsx      - Department management
  ├── TestAccessDenied.tsx              - Access restriction message
  └── PermissionGate.tsx                - Permission wrapper component
```

## Navigation

The Test System has its own navigation that adjusts based on user role:

**Master Profile sees:**
- Dashboard
- Team
- Jobs
- Calendar
- Departments
- Activity Log
- Settings

**Team Member sees (based on permissions):**
- Dashboard
- Jobs (if has permission)
- Calendar (if has permission)
- (Restricted features hidden or grayed out)

## Next Steps - When You're Ready

### Option 1: Keep Test System for Review
- Test System stays as-is
- Original system untouched
- You can switch back and forth
- Get team feedback

### Option 2: Replace Original System
When you're satisfied with the Test System:
1. Remove old recruiter team components
2. Rename Test components (remove "Test" prefix)
3. Update routes to use new system
4. Migrate any real data to new structure

### Option 3: Hybrid Approach
- Keep Test System for new features
- Gradually migrate features from old to new
- Sunset old system over time

## Benefits of This Approach

✅ **Zero Risk** - Original system completely untouched  
✅ **Full Testing** - Test with 5 different user personas  
✅ **Easy Comparison** - Switch between old and new instantly  
✅ **Team Collaboration** - Others can test and provide feedback  
✅ **Incremental Migration** - Move features when ready  
✅ **Rollback Option** - Just remove test files if needed  

## What to Test Next

1. **Permissions Flow**: Try each permission combination
2. **Edge Cases**: What happens when member has no permissions?
3. **Department Assignment**: Assign members to departments
4. **Job Restrictions**: Test limiting members to specific jobs
5. **Activity Tracking**: Verify all actions are logged
6. **Invite Flow**: Complete end-to-end invitation
7. **Access Denied**: Try accessing restricted features as team member

## Technical Notes

- All components use shadcn/ui for consistency
- Fully typed with TypeScript
- Mock data is realistic and comprehensive
- Permission checks happen at component and route level
- Activity log tracks user, action, target, timestamp, metadata
- Export functionality included (CSV)
- Responsive design (mobile-friendly)

---

**Built:** November 9, 2025  
**Status:** ✅ Ready for Testing  
**Protected Files:** Original recruiter system untouched  
