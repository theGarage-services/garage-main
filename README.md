# theGarage - Dual-Perspective Job Application Tracker

A comprehensive job application tracking platform that serves both job seekers and recruiters with a Kanban-style interface, advanced filtering, premium features, and role-based authentication.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd thegarage
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
   Navigate to `http://localhost:5173` to view the application.

## 🏗️ Project Architecture

### Technology Stack
- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **Icons**: Lucide React
- **State Management**: React Hooks (useState, useEffect)
- **Authentication**: Mock authentication with demo profiles
- **Deployment**: Static site compatible

### Core Features
- **Dual Perspective**: Separate interfaces for job seekers and recruiters
- **Kanban Board**: Drag-and-drop job application tracking
- **Premium Tiers**: Basic vs Premium user features with restrictions
- **Role-Based Access**: Different permissions for different user types
- **Institution Management**: Team and organization management for recruiters
- **Queue System**: Job category-based application tracking
- **Real-time Notifications**: Activity tracking and updates
- **Profile Management**: Comprehensive user profiles with resume editing
- **Analytics Dashboard**: Metrics and insights for both user types

## 📁 Project Structure

```
theGarage/
├── App.tsx                    # Main application entry point
├── components/                # React components
│   ├── ui/                   # shadcn/ui base components
│   ├── figma/                # Figma import utilities
│   ├── [Feature]Page.tsx     # Main page components
│   └── [Feature].tsx         # Feature-specific components
├── styles/
│   └── globals.css           # Tailwind CSS configuration
├── imports/                  # Figma imports and SVG assets
├── types/                    # TypeScript type definitions
└── guidelines/               # Development guidelines
```

### Key Files
- **`App.tsx`**: Main application router and state management
- **`components/Homepage.tsx`**: Job seeker dashboard
- **`components/RecruiterHomepage.tsx`**: Recruiter dashboard
- **`components/JobTracker.tsx`**: Kanban board for job applications
- **`components/QueueDetailPage.tsx`**: Queue analytics and leaderboards
- **`styles/globals.css`**: Brand colors and typography system

## 👥 Demo Accounts

The application includes several pre-configured demo accounts for testing:

### Job Seekers
- **Premium User**: `premium@thegarage.com` / `password`
  - Full access to all premium features
  - Unlimited queues and advanced analytics
  - Priority support and profile boosts

- **Basic User**: `basic@thegarage.com` / `password`
  - Limited to 3 queues
  - Basic job tracking features
  - Restricted chat and premium features

### Recruiters
- **Institution Admin**: `admin@thegarage.com` / `password`
  - Full institution management
  - Team management capabilities
  - All recruiter features unlocked

- **Team Member**: `member@thegarage.com` / `password`
  - Standard recruiter permissions
  - Job posting and candidate management
  - Limited administrative access

## 🎨 Styling System

### Brand Colors
theGarage uses a warm orange color scheme defined in CSS variables:

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
- **Limitations**: Basic users limited to 3 queues
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
- `react-hook-form`: Form handling

## 🐛 Troubleshooting

### Common Issues

1. **Build Errors**
   - Clear node_modules and reinstall dependencies
   - Check TypeScript errors in terminal
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
   - Use provided demo accounts
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

This project is part of theGarage platform. All rights reserved.