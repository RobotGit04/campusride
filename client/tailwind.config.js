export default {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#eef4ff',
        'surface-container': '#e6eefc',
        'surface-container-high': '#e1e9f7',
        'surface-container-highest': '#dbe3f1',
        'surface': '#f8f9ff',
        'background': '#f8f9ff',
        'on-background': '#141c26',
        'on-surface': '#141c26',
        'on-surface-variant': '#44474e',
        'primary': '#000516',
        'primary-container': '#0c1e3d',
        'on-primary-container': '#7686ab',
        'secondary': '#0051d5',
        'secondary-container': '#316bf3',
        'outline': '#75777f',
        'outline-variant': '#c5c6cf',
        'error': '#ba1a1a',
      },
      fontFamily: {
        'headline': ['Manrope', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px',
      },
    },
  },
  plugins: [],
}