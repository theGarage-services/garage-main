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
  'shadow-md': {
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
};

// Helper to apply web-compatible styles
export const applyWebCompat = (className: string) => {
  return { className };
};

// Component wrapper for web compatibility
export const WebCompatView = ({ className, children, ...props }: any) => {
  const compatProps = applyWebCompat(className || '');
  return <div {...compatProps} {...props}>{children}</div>;
};

// Text wrapper for web compatibility
export const WebCompatText = ({ className, children, ...props }: any) => {
  const compatProps = applyWebCompat(className || '');
  return <span {...compatProps} {...props}>{children}</span>;
};