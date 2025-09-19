/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./app/**/*.{js,jsx,ts,tsx}", 
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    colors: {
      'dark-grey': '#2b2827',
      'dark-grey-brown': '#524738',
      'off-grey': '#e7e3df',
      'off-white': '#f7f4f2'
    },
  },
  plugins: [],
}