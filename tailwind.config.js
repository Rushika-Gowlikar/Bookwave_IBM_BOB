/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        dark: {
          bg:      'var(--bg-main)',
          surface: 'var(--bg-surface)',
          card:    'var(--bg-card)',
          border:  'var(--border-main)',
          muted:   'var(--text-muted)',
          input:   'var(--input-bg)',
          hover:   'var(--hover-bg)',
        },
        ink: 'var(--text-main)',
        subtext: 'var(--text-secondary)',
        mutedtext: 'var(--text-muted)',
      },
      fontFamily: {
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        glow: {
          '0%, 100%': { opacity: '0.4' },
          '50%':      { opacity: '0.8' },
        },
        scaleUp: {
          '0%':   { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        }
      },
      animation: {
        'fade-up': 'fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fadeIn 0.25s ease-out both',
        'float':   'float 4s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite linear',
        'glow':    'glow 3s ease-in-out infinite',
        'scale-up': 'scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
      boxShadow: {
        'book': '0 8px 24px -4px rgba(0, 0, 0, 0.18), 0 3px 8px -2px rgba(0, 0, 0, 0.12)',
        'book-hover': '0 20px 30px -8px rgba(124, 58, 237, 0.25), 0 8px 14px -4px rgba(0, 0, 0, 0.16)',
        'card-light': '0 2px 12px -2px rgba(99, 102, 241, 0.08), 0 1px 4px -1px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
};
