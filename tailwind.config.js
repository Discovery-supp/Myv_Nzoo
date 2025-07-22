/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Charte graphique Nzoo Immo
        'nzoo': {
          'primary': '#183154',    // Couleur dominante du logo
          'secondary': '#4B4F54',  // Gris Urbain
          'light': '#D3D6DB',      // Gris Clair neutre
        }
      }
    },
  },
  plugins: [],
};
