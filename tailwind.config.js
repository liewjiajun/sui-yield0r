/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Pop-Art Neo-Brutalism palette
        background: '#FFFDF5', // Cream White
        foreground: '#000000', // Pure Black
        'neo-red': '#FF6B6B',    // Primary (Actions)
        'neo-teal': '#4ECDC4',   // Secondary (Highlights)
        'neo-yellow': '#FFE66D', // Accent (Alerts/Tags)
        'neo-green': '#A3E635',  // Success states
        'neo-blue': '#60A5FA',   // Info states
        'neo-purple': '#A78BFA', // Special highlights
        'neo-orange': '#FB923C', // Warnings
        'neo-pink': '#F472B6',   // Featured items
        neutral: '#E0E0E0',      // Disabled states
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'SF Mono', 'Consolas', 'monospace'],
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'neo': '4px 4px 0px 0px #000000',
        'neo-sm': '2px 2px 0px 0px #000000',
        'neo-lg': '8px 8px 0px 0px #000000',
        'neo-red': '4px 4px 0px 0px #FF6B6B',
        'neo-teal': '4px 4px 0px 0px #4ECDC4',
        'neo-yellow': '4px 4px 0px 0px #FFE66D',
        'neo-green': '4px 4px 0px 0px #A3E635',
      },
      borderWidth: {
        '3': '3px',
      },
      translate: {
        'box': '4px',
      },
      animation: {
        'bounce-subtle': 'bounce-subtle 0.5s ease-in-out',
      },
      keyframes: {
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-2px)' },
        },
      },
    },
  },
  plugins: [],
}
