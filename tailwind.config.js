/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flyonui/dist/js/*.js",
    "./node_modules/flowbite/**/*.js",
    "./node_modules/tw-elements-react/dist/js/**/*.js",
    "./node_modules/@tremor/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("flyonui"),
    require("flowbite/plugin"),
    require("tw-elements-react/dist/plugin.cjs"),
    require("daisyui"),
  ],
  darkMode: "class", // atau 'media' jika ingin berdasarkan sistem
};
