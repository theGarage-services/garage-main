import { Platform } from 'react-native';

// This file provides compatibility shims for existing web components
// to work in React Native environment while preserving all functionality

// Web compatibility wrapper for className -> style conversion
export const webCompatStyles = {
  'min-h-screen': { minHeight: '100vh' },
  'bg-background': { backgroundColor: '#f8fafc' },
  'flex-1': { flex: 1 },
  'p-4': { padding: 16 },
  'p-6': { padding: 24 },
  'm-4': { margin: 16 },
  'rounded-lg': { borderRadius: 8 },
  'shadow-md': Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    android: {
      elevation: 4,
    },
    web: {
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    },
  }),
};

// Helper to apply web-compatible styles
export const applyWebCompat = (className: string) => {
  if (Platform.OS === 'web') {
    return { className };
  }
  
  const styles = className.split(' ').map(cls => webCompatStyles[cls as keyof typeof webCompatStyles]).filter(Boolean);
  return { style: Object.assign({}, ...styles) };
};

// Component wrapper for web compatibility
export const WebCompatView = ({ className, children, ...props }: any) => {
  const compatProps = applyWebCompat(className || '');
  
  if (Platform.OS === 'web') {
    return <div {...compatProps} {...props}>{children}</div>;
  }
  
  const { View } = require('react-native');
  return <View {...compatProps} {...props}>{children}</View>;
};

// Text wrapper for web compatibility
export const WebCompatText = ({ className, children, ...props }: any) => {
  const compatProps = applyWebCompat(className || '');
  
  if (Platform.OS === 'web') {
    return <span {...compatProps} {...props}>{children}</span>;
  }
  
  const { Text } = require('react-native');
  return <Text {...compatProps} {...props}>{children}</Text>;
};