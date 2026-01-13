/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        void: '#0B0C15',
        'void-light': '#151621',
        'void-lighter': '#20212E',
        'neon-blue': '#00F0FF',
        'neon-purple': '#BC13FE',
        'starlight': '#EAEAEA',
        'starlight-dim': '#8B8C99',
      },
      fontFamily: {
        gaming: ['Orbitron', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)",
      }
    },
  },
  plugins: [],
}