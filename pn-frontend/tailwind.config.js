/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}", "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {
      colors: {
        primary: "hsl(210, 54%, 34%)",
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
