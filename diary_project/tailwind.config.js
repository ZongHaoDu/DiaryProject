/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {boxShadow: {
      'custom-shadow': '0 4px 30px rgba(216,180,254,0.7)', // 自定義陰影顏色
    },},
  },
  plugins: [],
}


