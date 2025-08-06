/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'aviation-blue': '#1e3a8a',
        'aviation-red': '#dc2626',
        'aviation-green': '#16a34a',
        'aviation-yellow': '#ca8a04',
        'aviation-gray': '#374151',
        // Dark theme colors (existing)
        'dashboard-bg': '#0f172a',
        'card-bg': '#1e293b',
        'border-color': '#334155',
        // Light theme colors
        'dashboard-bg-light': '#f8fafc',
        'card-bg-light': '#ffffff',
        'border-color-light': '#e2e8f0',
        'text-primary-light': '#1e293b',
        'text-secondary-light': '#64748b'
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'monospace'],
        'sans': ['Inter', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
} 