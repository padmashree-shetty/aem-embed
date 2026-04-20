import { theme } from '@subway/shared-styles/tailwind-theme.js';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./blocks/**/*.{js,jsx}', './scripts/**/*.js'],
  theme: {
    extend: theme,
  },
  plugins: [],
};
