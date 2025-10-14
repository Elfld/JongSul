/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", 
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  
  theme: {
    extend: {
      // 여기에 나만의 색상, 폰트, 간격 등을 추가할 수 있습니다.
    },
  },
  plugins: [],
}