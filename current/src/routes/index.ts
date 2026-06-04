// Route configuration for theGarage frontend
export interface RouteConfig {
  path: string;
  component: React.ComponentType<any>;
  protected?: boolean;
  roles?: string[];
  title?: string;
}

// Public routes
export const publicRoutes: RouteConfig[] = [
  {
    path: '/',
    component: () => null, // Will be handled directly in App.tsx
    title: 'Home - theGarage'
  },
  {
    path: '/about',
    component: () => null, // Will be handled directly in App.tsx
    title: 'About - theGarage'
  }
];

// Authentication routes
export const authRoutes: RouteConfig[] = [
  {
    path: '/auth/role-select',
    component: () => null, // Will be handled directly in App.tsx
    title: 'Select Role - theGarage'
  },
  {
    path: '/auth/admin-login',
    component: () => null, // Will be handled directly in App.tsx
    title: 'Admin Login - theGarage'
  },
  {
    path: '/auth/login',
    component: () => null, // Will be handled directly in App.tsx
    title: 'Login - theGarage'
  },
  {
    path: '/auth/signup',
    component: () => null, // Will be handled directly in App.tsx
    title: 'Sign Up - theGarage'
  },
  {
    path: '/auth/forgot-password',
    component: () => null, // Will be handled directly in App.tsx
    title: 'Forgot Password - theGarage'
  }
];

// Protected routes (require authentication)
export const protectedRoutes: RouteConfig[] = [
  {
    path: '/dashboard',
    component: () => null, // Will be handled directly in App.tsx
    protected: true,
    title: 'Dashboard - theGarage'
  },
  {
    path: '/profile',
    component: () => null, // Will be handled directly in App.tsx
    protected: true,
    title: 'Profile - theGarage'
  },
  {
    path: '/settings',
    component: () => null, // Will be handled directly in App.tsx
    protected: true,
    title: 'Settings - theGarage'
  },
  {
    path: '/notifications',
    component: () => null, // Will be handled directly in App.tsx
    protected: true,
    title: 'Notifications - theGarage'
  },
  {
    path: '/support',
    component: () => null, // Will be handled directly in App.tsx,
    protected: true,
    title: 'Support - theGarage'
  }
];

// Job seeker routes
export const jobSeekerRoutes: RouteConfig[] = [
  {
    path: '/jobs/:id',
    component: () => null, // Will be handled directly in App.tsx
    protected: true,
    title: 'Job Details - theGarage'
  },
  {
    path: '/jobs/tracker',
    component: () => null, // Will be handled directly in App.tsx,
    protected: true,
    title: 'Job Tracker - theGarage'
  }
];

// Recruiter routes
export const recruiterRoutes: RouteConfig[] = [
  {
    path: '/recruiter/dashboard',
    component: () => null, // Will be handled directly in App.tsx,
    protected: true,
    roles: ['recruiter', 'lead', 'manager', 'hiring-manager'],
    title: 'Recruiter Dashboard - theGarage'
  },
  {
    path: '/recruiter/jobs',
    component: () => null, // Will be handled directly in App.tsx,
    protected: true,
    roles: ['recruiter', 'lead', 'manager', 'hiring-manager'],
    title: 'Job Management - theGarage'
  },
  {
    path: '/recruiter/candidates',
    component: () => null, // Will be handled directly in App.tsx,
    protected: true,
    roles: ['recruiter', 'lead', 'manager', 'hiring-manager'],
    title: 'Candidate Management - theGarage'
  },
  {
    path: '/recruiter/candidates/:id',
    component: () => null, // Will be handled directly in App.tsx,
    protected: true,
    roles: ['recruiter', 'lead', 'manager', 'hiring-manager'],
    title: 'Candidate Profile - theGarage'
  },
  {
    path: '/calendar',
    component: () => null, // Will be handled directly in App.tsx,
    protected: true,
    roles: ['recruiter', 'lead', 'manager', 'hiring-manager'],
    title: 'Interview Calendar - theGarage'
  },
  {
    path: '/chat',
    component: () => null, // Will be handled directly in App.tsx,
    protected: true,
    roles: ['recruiter', 'lead', 'manager', 'hiring-manager'],
    title: 'Recruiter Chat - theGarage'
  },
  {
    path: '/stats',
    component: () => null, // Will be handled directly in App.tsx,
    protected: true,
    roles: ['recruiter', 'lead', 'manager', 'hiring-manager'],
    title: 'Recruiter Stats - theGarage'
  },
  {
    path: '/recruiter/profile',
    component: () => null, // Will be handled directly in App.tsx,
    protected: true,
    roles: ['recruiter', 'lead', 'manager', 'hiring-manager'],
    title: 'Recruiter Profile - theGarage'
  }
];

// Queue management routes
export const queueRoutes: RouteConfig[] = [
  {
    path: '/queues',
    component: () => null, // Will be handled directly in App.tsx,
    protected: true,
    title: 'My Queues - theGarage'
  },
  {
    path: '/queues/:id',
    component: () => null, // Will be handled directly in App.tsx,
    protected: true,
    title: 'Queue Details - theGarage'
  },
  {
    path: '/queues/sourcing',
    component: () => null, // Will be handled directly in App.tsx,
    protected: true,
    title: 'Queue Sourcing - theGarage'
  }
];

// Enterprise routes
export const enterpriseRoutes: RouteConfig[] = [
  {
    path: '/team',
    component: () => null, // Will be handled directly in App.tsx,
    protected: true,
    roles: ['admin', 'lead', 'manager'],
    title: 'Team Management - theGarage'
  },
  {
    path: '/approvals',
    component: () => null, // Will be handled directly in App.tsx,
    protected: true,
    roles: ['admin', 'lead', 'manager'],
    title: 'Approval Queue - theGarage'
  },
  {
    path: '/documents',
    component: () => null, // Will be handled directly in App.tsx,
    protected: true,
    roles: ['admin', 'lead', 'manager'],
    title: 'Document Management - theGarage'
  },
  {
    path: '/setup/company',
    component: () => null, // Will be handled directly in App.tsx,
    protected: true,
    roles: ['admin', 'lead', 'manager'],
    title: 'Company Setup - theGarage'
  },
  {
    path: '/users/create',
    component: () => null, // Will be handled directly in App.tsx,
    protected: true,
    roles: ['admin', 'lead', 'manager'],
    title: 'Create User - theGarage'
  }
];

// Special routes
export const specialRoutes: RouteConfig[] = [
  {
    path: '/resume-upload',
    component: () => null, // Will be handled directly in App.tsx,
    protected: true,
    title: 'Resume Upload - theGarage'
  }
];

// All routes combined
export const allRoutes = [
  ...publicRoutes,
  ...authRoutes,
  ...protectedRoutes,
  ...jobSeekerRoutes,
  ...recruiterRoutes,
  ...queueRoutes,
  ...enterpriseRoutes,
  ...specialRoutes
];

// Route helpers
export const getRouteByPath = (path: string): RouteConfig | undefined => {
  return allRoutes.find(route => route.path === path);
};

export const getRoutesByRole = (userRole: string): RouteConfig[] => {
  return allRoutes.filter(route => 
    !route.roles || route.roles.includes(userRole)
  );
};

export const isProtectedRoute = (path: string): boolean => {
  const route = getRouteByPath(path);
  return route?.protected || false;
};

export const hasRouteAccess = (path: string, userRole: string): boolean => {
  const route = getRouteByPath(path);
  if (!route?.roles) return true;
  return route.roles.includes(userRole);
};
