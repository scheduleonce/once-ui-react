/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: 'tw-',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      screens: {
        s767: { max: '767px' },
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
