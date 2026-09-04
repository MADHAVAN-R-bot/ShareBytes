/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#d04a14',
          container: '#ff6b35',
          fixed: '#ffdbd0',
          'fixed-dim': '#ffb59d',
          dark: '#ab3500',
        },
        secondary: {
          DEFAULT: '#b26146',
          container: '#fd9e7f',
          fixed: '#6ffbbe',
          'fixed-dim': '#4edea3',
          dark: '#944930',
        },
        tertiary: {
          DEFAULT: '#c8a91f',
          container: '#ffe171',
          dark: '#705d00',
        },
        background: '#fff8f6',
        surface: {
          DEFAULT: '#fff8f6',
          bright: '#fff8f6',
          dim: '#eed5cc',
          variant: '#f7ddd5',
          container: {
            lowest: '#ffffff',
            low: '#fff1ec',
            DEFAULT: '#ffe9e2',
            high: '#fce3da',
            highest: '#f7ddd5',
          },
        },
        'on-surface': {
          DEFAULT: '#261814',
          variant: '#594139',
        },
        muted: '#f0f3ff',
      },
      fontFamily: {
        heading: ['var(--font-poppins-bold)', 'Poppins', 'sans-serif'],
        body: ['var(--font-poppins-medium)', 'Poppins', 'sans-serif'],
      },
      borderRadius: {
        badge: '0.5rem',
        button: '1rem',
        card: '1.25rem',
        'card-lg': '1.5rem',
        pill: '9999px',
      },
      maxWidth: {
        'container-max': '72rem',
      },
      spacing: {
        'container-max': '72rem',
        'space-3xl': '4rem',
        'space-2xl': '3rem',
        'space-xl': '2rem',
        'space-lg': '1.5rem',
        'space-md': '1rem',
        'space-sm': '0.75rem',
        'space-xs': '0.5rem',
        'space-2xs': '0.25rem',
        'gutter-mobile': '1rem',
        'gutter-desktop': '1.5rem',
        'touch-target-min': '3rem',
      },
    },
  },
  plugins: [],
}
