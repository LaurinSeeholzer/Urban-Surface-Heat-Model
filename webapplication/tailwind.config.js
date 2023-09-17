/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
      ],
  theme: {
    extend: {
        colors: {
            'accentcolor': "#4B5153",
            'accentcolorbright': "#6b7376",
        }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

