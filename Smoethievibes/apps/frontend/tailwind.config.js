/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        white: "#ffffff",
        brown:{
          50: "#F9F3F0",
          100: "#ECD9D2",
          200: "#E2C7BC",
          300: "#D5AD9D",
          400: "#CD9D8A",
          500: "#C1856D",
          600: "#B07963",
          700: "#895E4D",
          800: "#6A493C",
          900: "#51382E",
        },
        green: {
          50: "#F4F5EF",
          100: "#DEE0CE",
          200: "#CDD1B7",
          300: "#B7BC96",
          400: "#A9AF81",
          500: "#939B62",
          600: "#868D59",
          700: "#686E46",
          800: "#515536",
          900: "#3E4129",
        }
      }
    },
  },
  plugins: [require("@tailwindcss/forms")],
}