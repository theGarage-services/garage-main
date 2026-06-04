// Navigation utilities for theGarage frontend
import { getRouteByPath, isProtectedRoute, hasRouteAccess } from '../routes';

export interface NavigationItem {
  path: string;
  label: string;
  icon?: string;
  roles?: string[];
  children?: NavigationItem[];
}

// Navigation structure for different user roles
export const jobSeekerNavigation: NavigationItem[] = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: 'home'
  },
  {
    path: '/jobs/tracker',
    label: 'Job Tracker',
    icon: 'briefcase'
  },
  {
    path: '/queues',
    label: 'Job Queues',
    icon: 'layers'
  },
  {
    path: '/profile',
    label: 'Profile',
    icon: 'user'
  },
  {
    path: '/settings',
    label: 'Settings',
    icon: 'settings'
  }
];

export const recruiterNavigation: NavigationItem[] = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: 'home'
  },
  {
    path: '/recruiter/dashboard',
    label: 'Recruiter Dashboard',
    icon: 'chart-bar'
  },
  {
    label: 'Jobs',
    icon: 'briefcase',
    children: [
      {
        path: '/recruiter/jobs',
        label: 'Job Management',
        icon: 'briefcase'
      }
    ],
    path: ''
  },
  {
    label: 'Candidates',
    icon: 'users',
    children: [
      {
        path: '/recruiter/candidates',
        label: 'Candidate Management',
        icon: 'users'
      }
    ],
    path: ''
  },
  {
    path: '/calendar',
    label: 'Interview Calendar',
    icon: 'calendar'
  },
  {
    path: '/chat',
    label: 'Messages',
    icon: 'message-circle'
  },
  {
    path: '/stats',
    label: 'Analytics',
    icon: 'bar-chart'
  },
  {
    path: '/queues',
    label: 'Job Queues',
    icon: 'layers'
  }
];

export const enterpriseNavigation: NavigationItem[] = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: 'home'
  },
  {
    label: 'Team Management',
    icon: 'users',
    children: [
      {
        path: '/team',
        label: 'Team Overview',
        icon: 'users'
      },
      {
        path: '/users/create',
        label: 'Create User',
        icon: 'user-plus'
      }
    ],
    path: ''
  },
  {
    path: '/approvals',
    label: 'Approval Queue',
    icon: 'check-circle'
  },
  {
    path: '/documents',
    label: 'Documents',
    icon: 'file-text'
  },
  {
    path: '/setup/company',
    label: 'Company Setup',
    icon: 'settings'
  },
  {
    path: '/stats',
    label: 'Analytics',
    icon: 'bar-chart'
  }
];

export const adminNavigation: NavigationItem[] = [
  {
    path: '/dashboard',
    label: 'Admin Dashboard',
    icon: 'shield'
  },
  ...enterpriseNavigation
];

// Get navigation items based on user role
export const getNavigationByRole = (role: string): NavigationItem[] => {
  switch (role) {
    case 'job-seeker':
      return jobSeekerNavigation;
    case 'recruiter':
    case 'hiring-manager':
      return recruiterNavigation;
    case 'lead':
    case 'manager':
      return [...recruiterNavigation, ...enterpriseNavigation];
    case 'admin':
      return adminNavigation;
    default:
      return jobSeekerNavigation;
  }
};

// Check if user has access to navigation item
export const hasNavigationAccess = (item: NavigationItem, userRole: string): boolean => {
  if (!item.roles) return true;
  return item.roles.includes(userRole);
};

// Filter navigation items by user role
export const filterNavigationByRole = (
  items: NavigationItem[], 
  userRole: string
): NavigationItem[] => {
  return items
    .filter(item => hasNavigationAccess(item, userRole))
    .map(item => ({
      ...item,
      children: item.children 
        ? filterNavigationByRole(item.children, userRole)
        : undefined
    }))
    .filter(item => !item.children || item.children.length > 0);
};

// Get active navigation item based on current path
export const getActiveNavigationItem = (
  items: NavigationItem[], 
  currentPath: string
): NavigationItem | null => {
  for (const item of items) {
    if (item.path === currentPath) {
      return item;
    }
    
    if (item.children) {
      const activeChild = getActiveNavigationItem(item.children, currentPath);
      if (activeChild) {
        return item;
      }
    }
  }
  
  return null;
};

// Breadcrumb generation
export interface BreadcrumbItem {
  label: string;
  path?: string;
}

export const generateBreadcrumbs = (
  navigation: NavigationItem[], 
  currentPath: string
): BreadcrumbItem[] => {
  const breadcrumbs: BreadcrumbItem[] = [];
  
  const findBreadcrumb = (
    items: NavigationItem[], 
    path: string, 
    parentPath: string = ''
  ): boolean => {
    for (const item of items) {
      const itemPath = item.path || parentPath;
      
      if (item.path === path) {
        breadcrumbs.push({ label: item.label, path: item.path });
        return true;
      }
      
      if (item.children) {
        if (findBreadcrumb(item.children, path, itemPath)) {
          breadcrumbs.unshift({ label: item.label, path: item.path });
          return true;
        }
      }
    }
    
    return false;
  };
  
  findBreadcrumb(navigation, currentPath);
  
  // Add home breadcrumb if not already present
  if (breadcrumbs.length === 0 || breadcrumbs[0].path !== '/dashboard') {
    breadcrumbs.unshift({ label: 'Home', path: '/dashboard' });
  }
  
  return breadcrumbs;
};

// Route validation
export const validateRouteAccess = (
  path: string, 
  isAuthenticated: boolean, 
  userRole?: string
): { accessible: boolean; redirectPath?: string } => {
  // If route is not protected, allow access
  if (!isProtectedRoute(path)) {
    return { accessible: true };
  }
  
  // If user is not authenticated, redirect to role selection
  if (!isAuthenticated) {
    return { accessible: false, redirectPath: '/auth/role-select' };
  }
  
  // If user is authenticated but doesn't have role access, redirect to dashboard
  if (userRole && !hasRouteAccess(path, userRole)) {
    return { accessible: false, redirectPath: '/dashboard' };
  }
  
  return { accessible: true };
};

// Route title management
export const getRouteTitle = (path: string): string => {
  const route = getRouteByPath(path);
  return route?.title || 'theGarage';
};

// Update document title based on route
export const updateDocumentTitle = (path: string): void => {
  const title = getRouteTitle(path);
  document.title = title;
};
