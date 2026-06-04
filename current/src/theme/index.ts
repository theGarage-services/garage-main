import { colors } from './colors';
import { typography } from './typography';
import { spacing, borderRadius } from './spacing';
import { shadows } from './shadows';

export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  
  // Common style helpers
  styles: {
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    
    centerContent: {
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
    },
    
    row: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
    },
    
    spaceBetween: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
    },
    
    gradient: {
      primary: {
        colors: colors.background.gradient.primary,
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
      },
      
      orange: {
        colors: colors.background.gradient.orange,
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
      },
    },
  },
};

export * from './colors';
export * from './typography';
export * from './spacing';
export * from './shadows';