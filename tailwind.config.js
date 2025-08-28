module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}", 
  ],
  theme: {
    extend: {
      colors: {
        primary: "#d4a574",
      },
    },
  },
  plugins: [],
  presets: [require("nativewind/preset")], 
};

