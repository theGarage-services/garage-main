# Kazi.ai - Dual-Perspective Job Application Tracker

A comprehensive job application tracking platform that serves both job seekers and recruiters with a Kanban-style interface, advanced filtering, premium features, and role-based authentication.

## 🚀 Quick Start

### Prerequisites

- Node.js (v20 or higher)
- npm or yarn package manager
- Modern web browser

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd kazi-ai/frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5000` to view the application.

## 🏗️ Project Architecture

### Technology Stack

- **Framework**: React 19 + TypeScript 5.0
- **Build Tool**: Vite 6.4 with SWC plugin
- **Routing**: React Router DOM 7.5
- **Styling**: Tailwind CSS 3.3 + shadcn/ui components (48 primitives)
- **UI Primitives**: Radix UI (accessible, headless components)
- **Icons**: Lucide React + React Icons
- **Animation**: Framer Motion + motion
- **Drag & Drop**: react-dnd (Kanban board)
- **Charts**: Recharts
- **State Management**: React Hooks (no global state library)
- **Authentication**: JWT tokens (access/refresh) with automatic refresh
- **Forms**: react-hook-form
- **Notifications**: sonner (toast)
- **Real-time**: WebSocket service
- **Deployment**: Static site (GitHub Pages, Vercel, Netlify)

### Core Features

- **Dual-Perspective Platform**: Single codebase serves both job seekers and recruiters with role-conditional rendering
- **Kanban Job Tracking**: Drag-and-drop board (react-dnd) with columns: Application Received → Under Consideration → Interview Stage → Offer
- **Queue System**: Job category-based queues (e.g., "Software Engineers", "Data Scientists") that recruiters browse to find candidates
- **Resume Parsing**: PDF upload with AI-powered parsing to auto-populate profile (skills, experience, education)
- **Premium Tiers**: Basic (3 queues max) vs Premium (unlimited + AI features)
- **Enterprise System**: Institution management with team roles (admin, lead, manager, recruiter, hiring-manager) and approval workflows
- **Real-time Chat**: Recruiter-candidate messaging within job applications
- **Interview Scheduling**: Calendar integration with video/phone/in-person options
- **Analytics Dashboard**: Metrics, leaderboards, and insights for both user types

## 📁 Project Structure

```text
src/
├── App.tsx                    # Main router + auth state (~1200 lines)
├── main.tsx                   # React entry point (BrowserRouter)
├── api/                       # API layer (17 files)
│   ├── client.ts             # ApiClient class with JWT refresh
│   ├── auth.ts               # Authentication endpoints
│   ├── candidateProfile.ts   # Candidate profile operations
│   ├── chat.ts               # Chat/messaging endpoints
│   ├── companies.ts          # Company management
│   ├── dashboard.ts          # Dashboard data
│   ├── dataSync.ts           # Data synchronization
│   ├── interviews.ts         # Interview scheduling
│   ├── jobManagement.ts      # Job CRUD operations
│   ├── jobMlServices.ts      # ML-based job matching
│   ├── jobPosts.ts           # Job posting operations
│   ├── oauth.ts              # Google OAuth flow
│   ├── queueService.ts       # Queue management
│   ├── recruiterCandidates.ts # Recruiter candidate operations
│   ├── recruiterProfile.ts   # Recruiter profile operations
│   ├── resumeParser.ts       # Resume PDF parsing
│   └── testData.ts           # Mock/demo data
├── components/                # 200+ organized components
│   ├── auth/                 # Authentication (13 files)
│   │   ├── signup-steps/    # Multi-step signup wizard (6 files)
│   ├── calendar/             # Interview scheduling (4 files)
│   ├── chat/                 # Real-time messaging (3 files)
│   ├── common/               # Shared components (8 files)
│   ├── company/              # Company setup (2 files)
│   ├── dashboard/            # Analytics dashboards (9 files)
│   ├── figma/                # Figma integration (1 file)
│   ├── institution/          # Institution management (14 files)
│   │   ├── setup/           # Institution setup wizard
│   │   └── tabs/            # Institution management tabs
│   ├── jobs/                 # Job tracking & posting
│   │   ├── details/         # Job detail views
│   │   └── posting/         # Job posting workflow
│   ├── landing/              # Landing pages
│   ├── layout/               # Navigation, Footer
│   ├── notifications/        # Notification system
│   ├── profile/              # User profile management
│   ├── queue/                # Queue management
│   ├── recruiter/            # Recruiter-specific features
│   │   └── views/           # Recruiter view components
│   ├── team/                 # Team management
│   ├── test/                 # Testing components
│   └── ui/                   # 48 shadcn/ui primitives
├── hooks/                     # Custom React hooks (7 files)
│   ├── auth/                 # Authentication hooks (2 files)
│   ├── useChat.ts            # Chat state management
│   ├── useDashboardData.ts   # Dashboard analytics
│   ├── useJobPDFParser.ts    # Resume PDF parsing
│   ├── usePermissions.ts     # Role-based permissions
│   └── useTestPermissions.tsx
├── services/                  # External services
│   └── websocket.ts          # WebSocket client
├── routes/                    # Route definitions
│   └── index.ts              # Route configuration
├── theme/                     # Theme system (6 files)
│   ├── ThemeProvider.tsx     # Theme context provider
│   ├── colors.ts             # Color palette
│   ├── shadows.ts            # Shadow utilities
│   ├── spacing.ts            # Spacing scale
│   ├── typography.ts         # Typography system
│   └── index.ts              # Theme exports
├── types/                     # TypeScript definitions (4 files)
│   ├── auth/                 # Auth types (1 file)
│   ├── index.ts              # Core type definitions
│   ├── job.ts                # Job-related types
│   └── team.ts               # Team management types
└── utils/                     # Helper functions (6 files)
    ├── auth/                 # Auth utilities (1 file)
    ├── locationData.ts       # Location data
    ├── navigation.ts         # Navigation helpers
    ├── platform.ts           # Platform detection
    ├── responsive.ts         # Responsive utilities
    └── testMockData.ts       # Test data generators
```

### Key Files

| File | Purpose |
| :--- | :--- |
| `App.tsx` | Main router, authentication logic, role-based routing, demo profiles |
| `api/client.ts` | HTTP client with automatic JWT token refresh |
| `services/websocket.ts` | WebSocket client for real-time communication |
| `routes/index.ts` | Route configuration and navigation structure |
| `theme/ThemeProvider.tsx` | Theme context provider with dark mode support |
| `components/landing/Homepage.tsx` | Job seeker dashboard |
| `components/landing/RecruiterHomepage.tsx` | Recruiter dashboard |
| `components/jobs/JobTracker.tsx` | Kanban board with drag-and-drop |
| `components/queue/QueueDetailPage.tsx` | Queue analytics and leaderboards |
| `components/chat/RecruiterChatSystem.tsx` | Recruiter-candidate messaging |
| `components/calendar/InterviewCalendar.tsx` | Interview scheduling interface |
| `hooks/auth/useSignUp.ts` | Multi-step signup state management |
| `hooks/useChat.ts` | Chat state management and WebSocket integration |
| `index.css` | Brand colours, Tailwind config, custom styles (216KB) |

---

## 🔌 Backend Integration

### Django REST API

The frontend communicates with a Django backend:

| Endpoint | Purpose |
| :--- | :--- |
| `/api/auth/login/` | JWT token pair (access + refresh) |
| `/api/auth/token/refresh/` | Refresh access token |
| `/api/accounts/register/` | User registration |
| `/api/accounts/profile/` | Profile CRUD operations |
| `/api/jobs/` | Job postings |
| `/api/candidates/` | Candidate profiles, resume parsing |
| `/api/queues/` | Queue management |
| `/api/institutions/` | Institution/team management |
| `/api/chat/` | Real-time messaging |
| `/api/interviews/` | Interview scheduling |
| `/api/companies/` | Company management |
| `/api/job-ml/` | ML-based job matching |

### Environment Configuration

Create `.env` in frontend root:

```bash
VITE_API_BASE_URL=http://localhost:8000/api
VITE_FRONTEND_PORT=5000
```

The `vite.config.ts` loads these via `loadEnv()` and configures the dev server port dynamically.

### Data Flow Example

```
Frontend (React)          Backend (Django)
     │                           │
     ├─ POST /api/accounts/──> ├─ Create UserProfile
     │   register/               │  Create CandidateProfile
     │                           │  Return JWT tokens
     │<──────────────────────────┤
     │
     ├─ GET /api/jobs/ ──────> ├─ Query Job model
     │   (with JWT)            │  Return serialised jobs
     │<──────────────────────────┤
```

## 👥 Demo Accounts

The application includes pre-configured demo accounts for testing all user roles:

### Job Seekers

| Account | Email | Features |
| :--- | :--- | :--- |
| **Premium User** | `premium@thegarage.com` | Unlimited queues, AI recommendations, profile boost, priority support |
| **Basic User** | `basic@thegarage.com` | 3 queues max, basic tracking, standard support |

### Recruiters (Enterprise Hierarchy)

| Role | Email | Permissions |
| :--- | :--- | :--- |
| **Institution Admin** | `admin@thegarage.com` | Full institution management, team creation, all permissions |
| **Lead Recruiter** | `lead@thegarage.com` | Team oversight, advanced candidate management |
| **Recruiting Manager** | `manager@thegarage.com` | Department-level management, approval workflows |
| **Standard Recruiter** | `recruiter@thegarage.com` | Job posting (requires approval), candidate review |
| **Trusted Recruiter** | `recruiter-trusted@thegarage.com` | Can post jobs without approval |
| **Hiring Manager** | `hiring@thegarage.com` | View candidates, participate in interviews |
| **Independent Recruiter** | `member@thegarage.com` | Solo recruiter, no institution affiliation |

All demo accounts use the password shown in the login screen (typically a simple password like `password123`).

---

## 🔐 Authentication Architecture

### JWT Token Flow

```
┌─────────────┐    Login/Signup     ┌─────────────┐
│   Frontend  │ ──────────────────> │   Backend   │
│  (React)    │                     │   (Django)  │
└─────────────┘                     └─────────────┘
       │                                   │
       │<──────────────────────────────────│
       │         {access, refresh}         │
       │                                   │
       ▼                                   │
  sessionStorage                           │
  ├─ access_token                          │
  └─ refresh_token                         │
```

### ApiClient (`api/client.ts`)

The `ApiClient` class handles all HTTP communication:

```typescript
class ApiClient {
  baseURL = import.meta.env.VITE_API_BASE_URL  // e.g., http://localhost:8000/api
  
  // Automatic JWT refresh on 401 responses
  async request(endpoint, options) {
    const response = await fetch(url, config);
    if (response.status === 401 && this.refreshToken) {
      await this.refreshAccessToken();
      return fetch(url, retryConfig);  // Retry with new token
    }
    return response;
  }
}
```

### Protected Routes

```typescript
// App.tsx
<ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole} requiredRole="recruiter">
  <RecruiterDashboard />
</ProtectedRoute>
```

- `ProtectedRoute`: Checks authentication
- `RoleBasedRoute`: Checks both authentication AND role permissions

---

## 📝 Signup Flow Architecture

### Multi-Step Wizard (`components/auth/signup-steps/`)

The signup process uses a 4-step wizard for job seekers, a 3-step wizard for recruiters:

```
┌─────────────────────────────────────────────────────────────┐
│ Step 1: Account                                             │
│ ├── First Name, Last Name                                   │
│ ├── Email                                                   │
│ └── Password + Confirm                                      │
├─────────────────────────────────────────────────────────────┤
│ Step 2: Profile                                             │
│ ├── Job Title                                               │
│ ├── Experience Level (L1-L5)                                │
│ ├── Location → maps to backend `address`                      │
│ ├── Phone Number                                            │
│ ├── Bio                                                     │
│ ├── Industry (25 choices)                                   │
│ └── Skills (comma-separated)                                │
├─────────────────────────────────────────────────────────────┤
│ Step 3: Preferences (Job Seekers only)                      │
│ ├── Preferred Locations                                     │
│ ├── Salary Ranges                                           │
│ ├── Job Types                                               │
│ └── Work Arrangements                                       │
├─────────────────────────────────────────────────────────────┤
│ Step 4: Resume (Job Seekers only)                           │
│ ├── PDF Upload                                              │
│ └── Skip Option                                             │
└─────────────────────────────────────────────────────────────┘
```

### State Management

Managed by `hooks/auth/useSignUp.ts`:

```typescript
const [step, setStep] = useState<SignupStep>('account');
const [formData, setFormData] = useState<SignupFormData>({...});
const [errors, setErrors] = useState<FormErrors>({});
```

### Backend Mapping

Frontend `location` → Backend `address` (CandidateProfile model)

## 🏛️ Component Architecture

### shadcn/ui Foundation (`components/ui/`)

48 primitive components built on Radix UI:

| Category | Components |
|----------|------------|
| **Layout** | Card, Sheet, Dialogue, Popover, Drawer, Collapsible |
| **Forms** | Input, Textarea, Select, Checkbox, Radio, Switch, Label |
| **Navigation** | Tabs, Breadcrumb, Pagination, NavigationMenu, Sidebar |
| **Feedback** | Alert, Sonner (toast), Progress, Skeleton |
| **Data** | Table, Chart, Calendar, Carousel |
| **Overlay** | Modal, Tooltip, HoverCard, ContextMenu |

All use `class-variance-authority` for consistent variants:

```typescript
const buttonVariants = cva(
  "inline-flex items-center justify-center",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        destructive: "bg-destructive text-white",
        outline: "border border-input bg-background",
        // ...
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-10 px-8",
      },
    },
  }
);
```

### Domain Organisation

Components are grouped by **business domain**, not by technical type:

- `auth/` - Authentication flows (13 components)
- `calendar/` - Interview scheduling (4 components)
- `chat/` - Real-time messaging (3 components)
- `common/` - Shared components (8 components)
- `company/` - Company setup (2 components)
- `dashboard/` - Analytics dashboards (9 components)
- `figma/` - Figma integration (1 component)
- `institution/` - Institution management (14 components)
- `jobs/` - Job tracking & posting
- `landing/` - Landing pages
- `layout/` - Navigation, Footer
- `notifications/` - Notification system
- `profile/` - User profile management
- `queue/` - Queue management
- `recruiter/` - Recruiter-specific features
- `team/` - Team management
- `test/` - Testing components
- `ui/` - 48 shadcn/ui primitives

## 🎨 Styling System

### Theme System

The project uses a centralised theme system in `src/theme/`:

- `ThemeProvider.tsx` - React context provider for theme state
- `colors.ts` - Colour palette and CSS variables
- `typography.ts` - Font sizes, weights, and line heights
- `spacing.ts` - Spacing scale for consistent layouts
- `shadows.ts` - Shadow utilities for depth
- `index.ts` - Theme exports

### Brand Colours

Kazi.ai uses a warm orange colour scheme defined in CSS variables:

```css
:root {
  --color-warm-orange: #ff6b35;        /* Primary brand color */
  --color-warm-orange-light: #ff8c42;  /* Light variant */
  --color-warm-orange-dark: #e55a2b;   /* Dark variant */
  --color-deep-orange: #d4461f;        /* Accent color */
}
```

### Typography

- **Font**: Inter (Google Fonts)
- **System**: Responsive typography with defined heading hierarchy
- **Important**: Avoid Tailwind font classes (text-xl, font-bold) unless specifically needed

### Component Library

The project uses shadcn/ui components located in `components/ui/`. These provide:

- Consistent design system
- Accessibility features
- Customizable styling
- TypeScript support

## 🔧 Development Guide

### Adding New Features

1. **Create Component Structure**

   ```typescript
   // components/NewFeature.tsx
   interface NewFeatureProps {
     onNavigate: (view: string) => void;
     user?: any;
   }

   export function NewFeature({ onNavigate, user }: NewFeatureProps) {
     // Component logic
   }
   ```

2. **Add to App.tsx Navigation**

   ```typescript
   // In App.tsx renderJobSeekerView() or renderRecruiterView()
   case 'new-feature':
     return <NewFeature 
       onNavigate={handleNavigate}
       user={user}
     />;
   ```

3. **Update Navigation Calls**

   ```typescript
   // In other components
   <Button onClick={() => onNavigate('new-feature')}>
     Go to New Feature
   </Button>
   ```

### State Management Patterns

#### Global State (App.tsx)

- **Authentication**: `user`, `isAuthenticated`, `userRole`
- **Navigation**: `currentView`, `navigationHistory`
- **Application Data**: `trackedJobs`, `userQueues`, `selectedJob`

#### Local State (Components)

- Use `useState` for component-specific state
- Use `useEffect` for side effects and data fetching
- Pass data down via props, functions up via callbacks

#### Example State Pattern

```typescript
export function MyComponent({ onNavigate, user }: Props) {
  const [localData, setLocalData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleAction = (data: any) => {
    // Update local state
    setLocalData(prev => [...prev, data]);
    // Notify parent if needed
    onNavigate('next-view');
  };
}
```

### Authentication Flow

1. **Landing Page** → Role Selection
2. **Role Selection** → Login/Signup
3. **Authentication** → Main Application
4. **Role-Based Routing** → Appropriate Dashboard

### Premium Feature Implementation

```typescript
// Check user premium status
const isPremium = user?.isPremium || false;

// Conditional rendering
{isPremium ? (
  <PremiumFeature />
) : (
  <UpgradePrompt onUpgrade={() => handleUpgrade()} />
)}

// Feature gating
const handlePremiumAction = () => {
  if (!isPremium) {
    showUpgradeModal();
    return;
  }
  // Execute premium action
};
```

### Queue System Architecture

Queues represent job categories that users can join:

- **Data Structure**: Array of queue IDs in user profile
- **Limitations**: Basic users are limited to 3 queues
- **Features**: Leaderboards, analytics, smart recommendations

### Navigation System

The app uses a history-based navigation system:

```typescript
// Navigate forward
const handleNavigate = (view: string) => {
  setCurrentView(view);
  setNavigationHistory(prev => [...prev, view]);
};

// Navigate back
const handleBack = () => {
  const newHistory = [...navigationHistory];
  newHistory.pop();
  const previousView = newHistory[newHistory.length - 1] || 'homepage';
  setCurrentView(previousView);
};
```

## 🛠️ Customization Guide

### Adding New User Roles

1. **Update Type Definitions**

   ```typescript
   type UserRole = 'job-seeker' | 'recruiter' | 'admin' | 'new-role';
   ```

2. **Create Role-Specific Components**

   ```typescript
   export function NewRoleHomepage({ user, onNavigate }: Props) {
     // Role-specific interface
   }
   ```

3. **Add to App.tsx Router**

   ```typescript
   if (userRole === 'new-role') {
     return renderNewRoleView();
   }
   ```

### Adding Premium Features

1. **Define Feature Flags**

   ```typescript
   interface PremiumFeatures {
     existingFeature: boolean;
     newPremiumFeature: boolean;
   }
   ```

2. **Implement Feature Gates**

   ```typescript
   const canAccessFeature = user?.premiumFeatures?.newPremiumFeature || false;
   ```

3. **Add Upgrade Prompts**

   ```typescript
   {!canAccessFeature && (
     <UpgradePrompt 
       feature="New Premium Feature"
       description="Access exclusive functionality"
       onUpgrade={() => handleUpgrade()}
     />
   )}
   ```

### Extending Institution Management

1. **Add New Permission Types**

   ```typescript
   type Permission = 'recruit' | 'interview' | 'post_jobs' | 'new_permission';
   ```

2. **Update Access Controls**

   ```typescript
   const hasPermission = user?.permissions?.includes('new_permission');
   ```

### Adding New Queue Types

1. **Define Queue Structure**

   ```typescript
   const newQueue = {
     id: 'new-queue-type',
     title: 'New Queue Type',
     description: 'Description of new queue',
     icon: IconComponent,
     color: 'bg-gradient-to-r from-color-1 to-color-2'
   };
   ```

2. **Add to Available Queues**
   Update queue lists in relevant components (QueueSelector.tsx, etc.)

## 🧪 Testing

### Manual Testing

- Test all demo accounts
- Verify role-based access control
- Test premium vs basic feature restrictions
- Verify navigation flow
- Test responsive design

### Component Testing

Each component should be tested for:

- Proper prop handling
- State management
- Event handling
- Error boundaries
- Accessibility

## 🚀 Deployment

### Build for Production

```bash
npm run build
# or
yarn build
```

### Preview Production Build

```bash
npm run preview
# or
yarn preview
```

### Static Site Deployment

The application builds to static files and can be deployed to:

- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages
- Any static hosting service

## 📚 Key Dependencies

### Core Dependencies

- `react` + `react-dom`: UI framework
- `typescript`: Type safety
- `vite`: Build tool and dev server
- `tailwindcss`: Utility-first CSS framework

### UI Dependencies

- `lucide-react`: Icon library
- `@radix-ui/*`: Accessible UI primitives (via shadcn/ui)
- `class-variance-authority`: Component variant management
- `clsx` + `tailwind-merge`: Conditional class names

### Utility Dependencies

- `sonner`: Toast notifications
- `recharts`: Charts and analytics
- `motion/react`: Animations
- `framer-motion`: Advanced animations
- `react-hook-form`: Form handling
- `react-dnd`: Drag and drop functionality
- `react-day-picker`: Date picker
- `react-image-crop`: Image cropping
- `react-resizable-panels`: Resizable panels
- `react-responsive-masonry`: Masonry layout
- `react-slick`: Carousel slider
- `embla-carousel-react`: Carousel components
- `vaul`: Drawer component
- `cmdk`: Command palette
- `input-otp`: OTP input

## 🐛 Troubleshooting

### Common Issues

1. **Build Errors**
   - Clear node_modules and reinstall dependencies
   - Check TypeScript errors in the terminal
   - Verify all imports are correct

2. **Styling Issues**
   - Check Tailwind CSS classes are valid
   - Verify custom CSS variables are defined
   - Use browser developer tools to inspect styles

3. **Navigation Issues**
   - Check view names match case-sensitive strings
   - Verify navigation functions are passed correctly
   - Check browser console for JavaScript errors

4. **Authentication Issues**
   - Use the provided demo accounts
   - Check user object structure matches expected format
   - Verify role-based routing logic

### Development Environment

- Use browser developer tools for debugging
- Check console for errors and warnings
- Use React Developer Tools browser extension
- Monitor network tab for API calls (when implemented)

## 📖 Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Vite Documentation](https://vitejs.dev/)

## 🤝 Contributing

1. Follow the existing code patterns and naming conventions
2. Use TypeScript for all new components
3. Follow the component structure established in existing files
4. Test changes with both job seeker and recruiter demo accounts
5. Ensure responsive design works on mobile and desktop
6. Update documentation when adding new features

## 📄 License

This project is part of the Kazi.ai platform. All rights reserved.
