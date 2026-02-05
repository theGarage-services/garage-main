// Get window dimensions for web
const getWindowDimensions = () => {
  if (typeof window !== 'undefined') {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }
  return { width: 1024, height: 768 }; // Default fallback
};

const { width, height } = getWindowDimensions();

export const screenWidth = width;
export const screenHeight = height;

// Breakpoints for responsive design
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

export const isSmallScreen = width < breakpoints.sm;
export const isMediumScreen = width >= breakpoints.sm && width < breakpoints.md;
export const isLargeScreen = width >= breakpoints.md && width < breakpoints.lg;
export const isExtraLargeScreen = width >= breakpoints.lg;

export const isTablet = width >= breakpoints.md;
export const isDesktop = width >= breakpoints.lg;

// Platform helpers (web only)
export const isWeb = true;
export const isIOS = false;
export const isAndroid = false;
export const isMobile = false;

// Safe area helpers (not needed for web, but kept for compatibility)
export const getStatusBarHeight = () => {
  return 0; // No status bar on web
};

// Responsive utilities
export const responsive = {
  width: (percentage: number) => (width * percentage) / 100,
  height: (percentage: number) => (height * percentage) / 100,
  
  // Scale font sizes based on screen size
  fontSize: (size: number) => {
    if (isSmallScreen) return size * 0.9;
    if (isLargeScreen) return size * 1.1;
    return size;
  },
  
  // Scale spacing based on screen size
  spacing: (size: number) => {
    if (isSmallScreen) return size * 0.8;
    if (isLargeScreen) return size * 1.2;
    return size;
  },
  
  // Get appropriate padding for different screen sizes
  screenPadding: () => {
    if (isSmallScreen) return 16;
    if (isMediumScreen) return 24;
    if (isLargeScreen) return 32;
    return 40;
  },
  
  // Get appropriate number of columns for grid layouts
  gridColumns: (maxColumns: number = 4) => {
    if (isSmallScreen) return 1;
    if (isMediumScreen) return Math.min(2, maxColumns);
    if (isLargeScreen) return Math.min(3, maxColumns);
    return maxColumns;
  },
};

// CSS-in-JS responsive helpers for web
export const webMediaQueries = {
  sm: `@media (min-width: ${breakpoints.sm}px)`,
  md: `@media (min-width: ${breakpoints.md}px)`,
  lg: `@media (min-width: ${breakpoints.lg}px)`,
  xl: `@media (min-width: ${breakpoints.xl}px)`,
};