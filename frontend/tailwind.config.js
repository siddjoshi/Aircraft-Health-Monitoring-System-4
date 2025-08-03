/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'aviation-blue': '#1e3a8a',
        'aviation-red': '#dc2626',
        'aviation-green': '#16a34a',
        'aviation-yellow': '#ca8a04',
        'aviation-gray': '#374151',
        'dashboard-bg': '#0f172a',
        'card-bg': '#1e293b',
        'border-color': '#334155'
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