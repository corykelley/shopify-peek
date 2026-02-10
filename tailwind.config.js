/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./**/*.{html,js}', '!./node_modules/**'],
  theme: {
    extend: {
      colors: {
        'neon-cyan': 'rgb(var(--color-neon-cyan) / <alpha-value>)',
        'neon-magenta': 'rgb(var(--color-neon-magenta) / <alpha-value>)',
        'neon-blue': 'rgb(var(--color-neon-blue) / <alpha-value>)',
        'neon-yellow': 'rgb(var(--color-neon-yellow) / <alpha-value>)',
        'retro-black': 'rgb(var(--color-retro-black) / <alpha-value>)',
        'retro-dark': 'rgb(var(--color-retro-dark) / <alpha-value>)',
        'retro-gray': 'rgb(var(--color-retro-gray) / <alpha-value>)',
        'retro-white': 'rgb(var(--color-retro-white) / <alpha-value>)',
        'neon-red': 'rgb(var(--color-neon-red) / <alpha-value>)',
      },
      fontFamily: {
        mono: [
          'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco',
          'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace',
        ],
      },
      boxShadow: {
        'neon-cyan': '0 0 8px rgba(0, 240, 208, 0.4), 0 0 20px rgba(0, 240, 208, 0.15)',
        'neon-magenta': '0 0 8px rgba(255, 45, 149, 0.4), 0 0 20px rgba(255, 45, 149, 0.15)',
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite alternate',
        'red-pulse': 'red-pulse 2s ease-in-out infinite alternate',
      },
      keyframes: {
        'glow-pulse': {
          '0%': { opacity: '0.6' },
          '100%': { opacity: '1' },
        },
        'red-pulse': {
          '0%': { opacity: '0.35' },
          '100%': { opacity: '0.9' },
        },
      },
    },
  },
  plugins: [],
};
