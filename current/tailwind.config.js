/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/App.tsx"
  ],
  theme: {
    extend: {
      colors: {
        // theGarage brand colors
        'warm-orange': '#ff6b35',
        'warm-orange-light': '#ff8c42', 
        'warm-orange-dark': '#e55a2b',
        'deep-orange': '#d4461f',
        'ocean-blue': '#0f172a',
        'ocean-blue-light': '#1e293b',
        
        // Semantic colors
        background: '#f8fafc',
        foreground: '#0f172a',
        card: '#ffffff',
        'card-foreground': '#1e293b',
        primary: '#0f172a',
        'primary-foreground': '#ffffff',
        secondary: '#e2e8f0',
        'secondary-foreground': '#475569',
        muted: '#f1f5f9',
        'muted-foreground': '#64748b',
        accent: '#ff6b35',
        'accent-foreground': '#ffffff',
        destructive: '#ef4444',
        'destructive-foreground': '#ffffff',
        border: '#e2e8f0',
        input: '#f8fafc',
        ring: '#ff6b35',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};