/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Terminal Green on Black palette
        terminal: {
          black: '#0a0a0a',
          dark: '#111111',
          green: '#00ff41',
          'green-dim': '#00cc33',
          'green-bright': '#33ff66',
          amber: '#ffb000',
          red: '#ff3333',
          cyan: '#00ffff',
          white: '#e0e0e0',
        },
        // Neobrutalist accent colors
        brutal: {
          yellow: '#ffff00',
          pink: '#ff00ff',
          blue: '#0066ff',
          orange: '#ff6600',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'SF Mono', 'Consolas', 'monospace'],
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px #00ff41',
        'brutal-sm': '2px 2px 0px 0px #00ff41',
        'brutal-lg': '8px 8px 0px 0px #00ff41',
        'brutal-amber': '4px 4px 0px 0px #ffb000',
        'brutal-red': '4px 4px 0px 0px #ff3333',
        'glow': '0 0 20px rgba(0, 255, 65, 0.3)',
        'glow-strong': '0 0 40px rgba(0, 255, 65, 0.5)',
      },
      borderWidth: {
        '3': '3px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'blink': 'blink 1s step-end infinite',
        'scanline': 'scanline 8s linear infinite',
        'flicker': 'flicker 0.15s infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.98' },
        },
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(rgba(0, 255, 65, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 65, 0.03) 1px, transparent 1px)',
        'scanlines': 'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15) 1px, transparent 1px, transparent 2px)',
      },
      backgroundSize: {
        'grid': '20px 20px',
      },
    },
  },
  plugins: [],
}
