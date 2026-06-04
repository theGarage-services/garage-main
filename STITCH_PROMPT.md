# Google Stitch Prompt: theGarage Frontend Recreation

## Overview

Recreate a 1-for-1 improved copy of the theGarage job application tracking platform. The application is a dual-perspective platform serving both job seekers and recruiters with a Kanban-style interface, advanced filtering, premium features, role-based authentication, and enterprise institution management.

## CRITICAL CONSTRAINTS

- **KEEP THE EXACT COLOR THEME** - Warm orange palette (see Color System below)
- **PRESERVE ALL USER FLOWS** - Every journey must be functionally identical
- **MODERNIZE & IMPROVE** - Better code structure, accessibility, performance

---

## Technology Stack (Exact Versions)

### Core Framework

- **React 19** + TypeScript 5.0 (strict mode enabled)
- **Build Tool**: Vite 6.4 with @vitejs/plugin-react-swc
- **Routing**: React Router DOM 7.5 (BrowserRouter)
- **State**: React Hooks only (no Redux/Zustand - use Context for global where needed)

### UI & Styling

- **CSS Framework**: Tailwind CSS 3.3
- **Component Library**: shadcn/ui (48 primitives based on Radix UI)
- **Icons**: Lucide React 0.487.0
- **Animation**: Framer Motion + motion/react
- **Drag & Drop**: react-dnd (Kanban board)
- **Charts**: Recharts 2.15.2
- **Forms**: react-hook-form 7.55.0
- **Notifications**: sonner 2.0.3 (toast)

### Fonts (MUST use exactly)

```css
@import url("https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap");
@import url("https://api.fontshare.com/v2/css?f[]=satoshi@700,500,400&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,200..900;1,200..900&display=swap");
```

---

## COLOR SYSTEM (DO NOT CHANGE)

### Brand Colors

```css
--color-warm-orange: #ff6b35        /* Primary brand color */
--color-warm-orange-light: #ff8c42  /* Light variant */
--color-warm-orange-dark: #e55a2b   /* Dark variant */
--color-deep-orange: #d4461f      /* Accent color */
```

### Semantic Colors

```css
--primary: #ff6b35
--primary-hover: #ff8c42
--primary-active: #e55a2b
--background: #ffffff
--foreground: #0a0a0a
--card: #ffffff
--card-foreground: #0a0a0a
--popover: #ffffff
--popover-foreground: #0a0a0a
--secondary: #f5f5f5
--secondary-foreground: #171717
--muted: #f5f5f5
--muted-foreground: #737373
--accent: #f5f5f5
--accent-foreground: #171717
--destructive: #ef4444
--destructive-foreground: #ffffff
--border: #e5e5e5
--input: #e5e5e5
--ring: #ff6b35
--radius: 0.625rem
```

---

## FILE STRUCTURE

```
src/
├── App.tsx                    # Main router + auth state
├── main.tsx                   # React entry point
├── api/
│   ├── client.ts             # ApiClient class with JWT refresh
│   ├── auth.ts               # Auth endpoints
│   ├── oauth.ts              # Google OAuth
│   ├── dataSync.ts           # Data sync utilities
│   └── testData.ts           # Demo/mock data
├── components/
│   ├── auth/                 # 17 auth components
│   │   ├── Login.tsx
│   │   ├── SignUp.tsx
│   │   ├── RoleSelector.tsx
│   │   ├── ForgotPassword.tsx
│   │   ├── ResetPassword.tsx
│   │   ├── OAuthCallback.tsx
│   │   ├── PasswordStrengthIndicator.tsx
│   │   ├── SocialAuthOptions.tsx
│   │   ├── VerifyEmailLink.tsx
│   │   └── signup-steps/
│   │       ├── AccountStep.tsx
│   │       ├── ProfileStep.tsx
│   │       ├── ResumeStep.tsx
│   │       └── InstitutionStepWrapper.tsx
│   ├── landing/              # 16 landing/dashboard components
│   │   ├── Homepage.tsx              # Job seeker main dashboard (51KB)
│   │   ├── RecruiterHomepage.tsx     # Recruiter dashboard
│   │   ├── LandingPage.tsx
│   │   ├── PlatformOverview.tsx
│   │   ├── Pricing.tsx
│   │   ├── About.tsx
│   │   ├── CareerPathStory.tsx
│   │   ├── EcosystemOverview.tsx
│   │   ├── DualPerspectiveDemo.tsx
│   │   ├── LiveProfileUpgrade.tsx
│   │   └── SuccessStories.tsx
│   ├── jobs/                 # 31 job tracking components
│   │   ├── JobTracker.tsx              # Kanban board
│   │   ├── JobDetailsPage.tsx
│   │   ├── JobPostingForm.tsx
│   │   ├── JobPostingWizard.tsx
│   │   ├── JobMarketplace.tsx
│   │   ├── JobSearch.tsx
│   │   ├── JobFilters.tsx
│   │   ├── QuickApplyModal.tsx
│   │   └── InterviewScheduler.tsx
│   ├── profile/              # 15 profile components
│   │   ├── Profile.tsx
│   │   ├── ResumeUploadFlow.tsx
│   │   ├── ProfileEditor.tsx
│   │   ├── AccountSettings.tsx
│   │   ├── PortfolioSection.tsx
│   │   └── SkillsAssessment.tsx
│   ├── queue/                # 11 queue management components
│   │   ├── MyQueues.tsx
│   │   ├── QueueDetailPage.tsx         # Analytics + leaderboard (57KB)
│   │   ├── QueueSelector.tsx
│   │   ├── QueueSourcingPage.tsx
│   │   ├── QueueIntelligence.tsx
│   │   ├── SmartQueueRecommendations.tsx
│   │   ├── QueueLeaderboard.tsx
│   │   └── KanbanColumn.tsx
│   ├── recruiter/            # 2 recruiter-specific
│   │   ├── RecruiterJobManagement.tsx
│   │   └── RecruiterCandidateManagement.tsx
│   ├── dashboard/            # 9 dashboard components
│   │   ├── TeamManagementDashboard.tsx
│   │   ├── RecruiterStatsPage.tsx
│   │   ├── EnterpriseAdminDashboard.tsx
│   │   ├── InstitutionAnalyticsDashboard.tsx
│   │   └── MetricsDashboard.tsx
│   ├── institution/          # 14 institution management
│   │   ├── InstitutionManagement.tsx   # (57KB)
│   │   ├── InstitutionAdminPanel.tsx
│   │   ├── InstitutionProfile.tsx
│   │   ├── InstitutionSetup.tsx
│   │   └── JoinInstitution.tsx
│   ├── team/                 # 4 team management
│   │   ├── TeamManagement.tsx        # (46KB)
│   │   ├── AccessManagement.tsx      # (35KB)
│   │   ├── UserCreationWizard.tsx
│   │   └── MyTeam.tsx
│   ├── chat/                 # 3 chat components
│   │   ├── RecruiterChatSystem.tsx
│   │   ├── JobSeekerChatSystem.tsx
│   │   └── CoffeeChatRequest.tsx
│   ├── calendar/             # 4 calendar components
│   │   ├── InterviewCalendar.tsx
│   │   ├── CalendarView.tsx
│   │   └── ScheduleInterviewSheet.tsx
│   ├── company/              # 2 company components
│   │   ├── CompanyProfile.tsx
│   │   └── CompanySetupWizard.tsx
│   ├── layout/               # 3 layout components
│   │   ├── Navigation.tsx
│   │   └── Footer.tsx
│   ├── common/               # 8 shared components
│   │   ├── ErrorBoundary.tsx
│   │   ├── PermissionGate.tsx
│   │   ├── AccessRestriction.tsx
│   │   └── ViewRenderer.tsx
│   └── ui/                   # 48 shadcn/ui primitives
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── form.tsx
│       ├── input.tsx
│       ├── select.tsx
│       ├── table.tsx
│       ├── tabs.tsx
│       └── (40 more...)
├── hooks/
│   ├── auth/
│   │   ├── useSignUp.ts
│   │   └── usePasswordReset.ts
│   ├── useDashboardData.ts
│   ├── useJobPDFParser.ts
│   ├── usePermissions.ts
│   └── useTestPermissions.tsx
├── types/
│   ├── index.ts              # User, Job, TrackedJob, Institution, etc.
│   ├── auth/signup.ts
│   ├── job.ts
│   └── team.ts
├── utils/
│   ├── auth/validation.ts
│   ├── locationData.ts
│   ├── navigation.ts
│   ├── platform.ts
│   └── testMockData.ts
├── theme/
│   ├── colors.ts
│   ├── typography.ts
│   ├── shadows.ts
│   └── spacing.ts
└── routes/
    └── index.ts
```

---

## USER FLOWS & JOURNEYS (MUST PRESERVE)

### Flow 1: Landing → Role Selection → Auth

1. **LandingPage** - Marketing page with role selection
2. **RoleSelector** - Choose "Job Seeker" or "Recruiter"
3. **Login/SignUp** - Authentication with social options (Google OAuth)
4. **OAuthCallback** - Handle social auth redirect

### Flow 2: Job Seeker Signup (4-Step Wizard)

```
AccountStep → ProfileStep → (PreferencesStep) → ResumeStep
```

**Step 1 - Account**: First/Last name, Email, Password (with strength indicator), Confirm password

**Step 2 - Profile**: Job title, Experience level (L1-L5 dropdown), Location, Phone, Bio, Industry (25 options), Skills (comma-separated)

**Step 3 - Preferences** (job seekers only): Preferred locations (multi-select), Salary ranges, Job types, Work arrangements

**Step 4 - Resume**: PDF upload with skip option. After upload → ResumeUploadFlow component

### Flow 3: Recruiter Signup (3-Step)

```
AccountStep → ProfileStep → InstitutionStep
```

**InstitutionStep Options**:

- Create new institution (Company name, type, industry, size, location)
- Join existing institution (enter code/email)
- Skip for now (Independent Recruiter)

### Flow 4: Job Seeker Dashboard (Homepage)

- Job search with filters (location, salary, type, remote)
- Featured jobs carousel
- Quick apply modal
- Application tracking overview
- Queue recommendations
- Chat notifications from recruiters
- Resume completion status

### Flow 5: Kanban Job Tracker

Columns: **Application Received** → **Under Consideration** → **Interview Stage** → **Offer**

Features:

- Drag and drop between columns (react-dnd)
- Click job card → JobDetailsPage
- Add notes to applications
- Recruiter chat within job card
- Interview scheduling

### Flow 6: Queue Management

**MyQueues**: View joined queues, queue stats, leave queue

**QueueSelector**: Browse available queues, join new queues (Basic: max 3, Premium: unlimited)

**QueueDetailPage**:

- Queue analytics (charts with Recharts)
- Leaderboard (top candidates)
- Smart recommendations
- Sourcing interface for recruiters

### Flow 7: Recruiter Dashboard

**RecruiterHomepage**:

- Active job postings
- Candidate pipeline overview
- Queue sourcing interface
- Team activity feed
- Pending approvals (if applicable)

**RecruiterJobManagement**:

- Post new job (with approval workflow for non-trusted recruiters)
- Edit job postings
- View applicants
- Move candidates through pipeline

### Flow 8: Institution Management

**InstitutionManagement** (57KB component):

- Institution profile editing
- Team member management
- Role assignment (admin, lead, manager, recruiter, hiring-manager)
- Approval settings
- Analytics dashboard

**InstitutionAdminPanel**:

- Pending approvals (jobs, team invites)
- Verification status
- Billing/subscription management
- Advanced settings

### Flow 9: Team Management

**TeamManagement** (46KB):

- Invite team members
- Role-based permissions
- Department assignment
- Activity monitoring

**AccessManagement** (35KB):

- Permission matrix
- Custom role creation
- Approval workflows

**UserCreationWizard**:

- Bulk user creation
- CSV import
- Role templates

### Flow 10: Chat System

**RecruiterChatSystem**:

- Candidate message threads
- Coffee chat requests
- Interview scheduling within chat
- Message templates

**JobSeekerChatSystem**:

- Recruiter conversations
- Job consideration notifications
- Interview confirmations

### Flow 11: Interview Scheduling

**InterviewCalendar**:

- Calendar view (react-day-picker)
- Schedule interview modal (video/phone/in-person)
- Send calendar invites
- Reschedule/cancel

### Flow 12: Profile Management

**Profile**:

- Edit personal info
- Resume upload/replace
- Skills assessment
- Portfolio links
- Privacy settings

**AccountSettings**:

- Email/password change
- Notification preferences
- Premium upgrade
- Data export/delete

---

## CORE TYPES (TypeScript)

```typescript
// User roles
export type UserRole = 'job-seeker' | 'recruiter' | 'admin' | 'hiring-manager';

// Recruiter roles within institution
export type RecruiterRole = 
  | 'admin'           // Institution admin - full control
  | 'lead'            // Lead recruiter - team oversight
  | 'manager'         // Recruiting manager - department management
  | 'recruiter'       // Standard recruiter
  | 'recruiter-trusted' // Can post without approval
  | 'hiring-manager'  // Can view/interview, limited posting
  | 'member';         // Independent recruiter

// Job application status
export type JobStatus = 
  | 'application-received'
  | 'not-considered'
  | 'under-consideration'
  | 'interview-stage'
  | 'rejected'
  | 'offer';

// Experience levels
export type ExperienceLevel = 'L1' | 'L2' | 'L3' | 'L4' | 'L5';

// Industries (25 options)
export const INDUSTRIES = [
  'technology', 'healthcare', 'finance', 'education', 'manufacturing',
  'retail', 'consulting', 'media', 'government', 'nonprofit',
  // ... (see full list in original)
];
```

---

## API ARCHITECTURE

### ApiClient Pattern

```typescript
class ApiClient {
  baseURL: string;
  accessToken: string | null;
  refreshToken: string | null;

  async request(endpoint: string, options: RequestInit): Promise<Response>
  async refreshAccessToken(): Promise<boolean>
  setTokens(accessToken: string | null, refreshToken: string | null): void
  clearTokens(): void
}

// Usage
const apiClient = new ApiClient();
const response = await apiClient.request('/jobs/', { method: 'GET' });
// Auto-refresh on 401 (except auth endpoints)
```

### Auth Endpoints

```typescript
// api/auth.ts
export const login = (email: string, password: string) =>
  apiClient.request('/auth/login/', { method: 'POST', body: { email, password } });

export const register = (data: SignupFormData) =>
  apiClient.request('/accounts/register/', { method: 'POST', body: data });

export const refreshToken = (refresh: string) =>
  apiClient.request('/auth/token/refresh/', { method: 'POST', body: { refresh } });
```

---

## COMPONENT PATTERNS

### shadcn/ui Component Template

```typescript
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-[#ff6b35] text-white hover:bg-[#ff8c42]",
        destructive: "bg-red-500 text-white",
        outline: "border border-input bg-background hover:bg-accent",
        secondary: "bg-secondary text-secondary-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-[#ff6b35] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-10 px-8",
        icon: "h-9 w-9",
      },
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
export { Button, buttonVariants };
```

### Protected Route Pattern

```typescript
// App.tsx
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute isAuthenticated={isAuthenticated}>
      <RoleBasedRoute userRole={userRole} allowedRoles={['recruiter']}>
        <RecruiterDashboard />
      </RoleBasedRoute>
    </ProtectedRoute>
  } 
/>
```

### Form Hook Pattern

```typescript
// hooks/auth/useSignUp.ts
export const useSignUp = () => {
  const [step, setStep] = useState<SignupStep>('account');
  const [formData, setFormData] = useState<SignupFormData>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateStep = (step: SignupStep): boolean => { /* ... */ };
  const nextStep = () => { /* ... */ };
  const prevStep = () => { /* ... */ };
  const submitForm = async () => { /* ... */ };

  return { step, formData, errors, isLoading, setFormData, nextStep, prevStep, submitForm };
};
```

---

## VITE CONFIGURATION

```typescript
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'node:path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const frontendPort = Number.parseInt(env.VITE_FRONTEND_PORT || '5000', 10);

  return {
    plugins: [react()],
    base: '/',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        // shadcn/ui component aliases
        '@/components/ui': path.resolve(__dirname, './src/components/ui'),
        '@/lib/utils': path.resolve(__dirname, './src/lib/utils'),
      },
    },
    server: {
      port: frontendPort,
      strictPort: false,
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
    },
  };
});
```

---

## DEMO ACCOUNTS (for testing)

### Job Seekers

| Email | Password | Type |
|-------|----------|------|
| <premium@thegarage.com> | password123 | Premium User |
| <basic@thegarage.com> | password123 | Basic User (max 3 queues) |

### Recruiters (Enterprise Hierarchy)

| Email | Password | Role |
|-------|----------|------|
| <admin@thegarage.com> | password123 | Institution Admin |
| <lead@thegarage.com> | password123 | Lead Recruiter |
| <manager@thegarage.com> | password123 | Recruiting Manager |
| <recruiter@thegarage.com> | password123 | Standard Recruiter |
| <recruiter-trusted@thegarage.com> | password123 | Trusted Recruiter |
| <hiring@thegarage.com> | password123 | Hiring Manager |
| <member@thegarage.com> | password123 | Independent Recruiter |

---

## IMPROVEMENT REQUIREMENTS

### Code Quality

1. **Extract all inline styles** to Tailwind classes
2. **Reduce cognitive complexity** - break down large components (>300 lines)
3. **Add proper TypeScript** - no `any` types, strict interfaces
4. **Implement proper error boundaries**
5. **Add loading states** for all async operations
6. **Use React.memo** for expensive components
7. **Implement proper accessibility** (ARIA labels, keyboard nav)

### Performance

1. **Code splitting** - lazy load heavy components
2. **Virtualize long lists** (queues, job lists)
3. **Optimize re-renders** - useMemo/useCallback appropriately
4. **Image optimization** - WebP format, lazy loading

### UX Improvements

1. **Skeleton loaders** instead of spinners
2. **Optimistic updates** for better perceived performance
3. **Better form validation** - real-time validation with clear error messages
4. **Toast notifications** for all user actions
5. **Keyboard shortcuts** for power users
6. **Better empty states** with helpful CTAs

---

## CHECKLIST FOR STITCH

### Must Implement

- [ ] All 17 auth components with exact flows
- [ ] All 31 job components including Kanban
- [ ] All 11 queue components
- [ ] All 14 institution components
- [ ] All 4 team management components
- [ ] All 9 dashboard components
- [ ] All 48 shadcn/ui primitives
- [ ] JWT auth with automatic refresh
- [ ] Google OAuth integration
- [ ] Role-based access control
- [ ] Demo account system
- [ ] Warm orange color theme (exact hex codes)
- [ ] Inter + Satoshi + Source Sans 3 fonts

### Must Preserve

- [ ] Every user flow listed above
- [ ] All 9 demo account credentials
- [ ] Premium vs Basic tier restrictions
- [ ] Institution approval workflows
- [ ] Team permission matrix
- [ ] Chat functionality
- [ ] Interview scheduling
- [ ] Resume upload with parsing
- [ ] Queue system (max 3 for Basic)

---

## OUTPUT

Generate a complete, production-ready React + TypeScript application that:

1. Uses the exact tech stack specified
2. Implements all user flows identically
3. Maintains the warm orange color theme
4. Has significantly improved code quality
5. Includes all demo accounts for testing
6. Is fully typed with TypeScript
7. Follows shadcn/ui patterns for components
8. Uses React Router DOM for navigation
9. Implements JWT auth with automatic refresh
