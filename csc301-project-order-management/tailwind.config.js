module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'custom-grey': '#f7efec',
        'custom-col': '#eae9e7',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};

