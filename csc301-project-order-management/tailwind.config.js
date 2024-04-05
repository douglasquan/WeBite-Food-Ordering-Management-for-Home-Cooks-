module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Paths to your components
    "./public/index.html", // Path to your HTML template
    "./node_modules/tw-elements/js/**/*.js", // Paths to tw-elements JS files
  ],
  theme: {
    extend: {
      colors: {
        "custom-grey": "#f7efec",
        "custom-col": "#eae9e7",
        "custom-blue": "#3b82f6",
        "custom-light-orange": "#fff7ed",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require("tw-elements/plugin.cjs"), // Include tw-elements plugin
  ],
  darkMode: "class", // Enable dark mode using classes
};
