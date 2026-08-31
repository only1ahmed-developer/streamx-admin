/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: '#0B0C10',
        surface: '#14161C',
        surface2: '#1B1E27',
        border: '#262A35',
        accent: '#E5322D',
        cyan: '#2DD4E8',
        muted: '#8B90A0',
        success: '#34D399',
        warning: '#FBBF24',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      keyframes: {
        pulseBar: {
          '0%, 100%': { opacity: 0.6 },
          '50%': { opacity: 1 },
        },
      },
      animation: {
        pulseBar: 'pulseBar 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
