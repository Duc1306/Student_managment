/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        // tái sử dụng biến màu HUST trong theme.css
        hust: {
          red: "#AF1E2D",
          "red-dark": "#c11f32",
        },
      },
    },
  },
  plugins: [],
};
