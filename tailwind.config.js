/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        'mainPurple': 'darkGrey',
        'mainPurpleHover': '#A8A4FF',
        'black': '#000112',
        'veryDarkGrey': '#20212C',
        'darkGrey': '#2B2C37',
        'darkLines': '#3E3F4E',
        'mediumGrey': '#828FA3',
        'lightLines': '#E4EBFA',
        'lightBackgroundGrey': '#F4F7FD',
        'white': '#FFFFFF',
        'red': '#EA5555',
        'redHover': '#FF9898',
      },

      fontFamily: {
        'main': ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      fontSize: {
        'XL': ['24px', {
          lineHeight: '30px',
          fontWeight: 'bold',
        }],
        'L': ['18px', {
          lineHeight: '23px',
          fontWeight: 'bold',
        }],
        'M': ['15px', {
          lineHeight: '19px',
          fontWeight: 'bold',
        }],
        'S': ['12px', {
          lineHeight: '15px',
          fontWeight: 'bold',
          letterSpacing: '2.4px',
        }],
        'BodyL': ['13px', {
          lineHeight: '23px',
          fontWeight: 'medium',
        }],
        'BodyM': ['12px', {
          lineHeight: '15px',
          fontWeight: 'bold',
        }],
      },
    },
  },
  plugins: [
    import('tailwind-scrollbar-hide'),
  ],
}

