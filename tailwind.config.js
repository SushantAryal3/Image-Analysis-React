/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        primaryfont: ['Product Sans', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#E3F2FF',
          100: '#BADFFF',
          200: '#5BB6FF',
          300: '#0097FF',
          400: '#0088F8',
          500: '#0077E4',
          600: '#0664D2',
          700: '#0A45B3',
          800: '#003675',
          900: '#0F204C',
        },
        secondary: {
          50: '#DFF2EF',
          100: '#AFDED6',
          200: '#7ACABC',
          300: '#42B4A2',
          400: '#05A48E',
          500: '#00947C',
          600: '#008770',
          700: '#007760',
          800: '#006752',
          900: '#004B37',
        },
        grey: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E6E6E6',
          300: '#D7D7D7',
          400: '#BDBDBD',
          500: '#989898',
          600: '#757575',
          700: '#616161',
          800: '#484848',
          900: '#212121',
        },
        other: {
          green: '#009061',
          red: '#D33A38',
          yellow: '#F6C644',
          blue: '#F6C644',
          purple: '#AB47BC',
          'green-light': '#E7F3E8',
          'red-light': '#FBE2E2',
          'yellow-light': '#FBF3E1',
          'blue-light': '#E1EDFB',
          'purple-light': '#F2E8F4',
        },
      },
      fontSize: {
        'body-lg': [
          '0.938rem',
          {
            lineHeight: '1.25rem',
            fontWeight: '400',
            letterSpacing: '0',
          },
        ],
        'body-md': [
          '0.813rem',
          {
            lineHeight: '1.125rem',
            fontWeight: '400',
            letterSpacing: '0',
          },
        ],
        'body-sm': [
          '0.75rem',
          {
            lineHeight: '1rem',
            fontWeight: '400',
            letterSpacing: '0',
          },
        ],
        'body-btn': [
          '0.938rem',
          {
            lineHeight: '1.25rem',
            fontWeight: '700',
            letterSpacing: '0',
          },
        ],
        'headline-2': [
          '2.375rem',
          {
            lineHeight: '2.75rem',
            fontWeight: '700',
            letterSpacing: '0',
          },
        ],
        'headline-5': [
          '1.063rem',
          {
            lineHeight: '1.375rem',
            fontWeight: '400',
            letterSpacing: '0',
          },
        ],
        'headline-4': [
          '1.25rem',
          {
            lineHeight: '1.75rem',
            fontWeight: '400',
            letterSpacing: '0',
          },
        ],
        'icon-md': [
          '1.5rem',
          {
            fontFamily: 'Material Icons Outlined',
            fontWeight: '400',
            lineHeight: '24px',
          },
        ],
        'icon-sm': [
          '1.125rem',
          {
            lineHeight: '1.125rem',
            fontWeight: '400',
            letterSpacing: '0',
          },
        ],
      },
      boxShadow: {
        '3xl': '0px 2px 20px 4px rgba(0, 0, 0, 0.20)',
        light: '0px 2px 20px 4px rgba(0, 0, 0, 0.12)',
        dark: '0px 4px 16px 8px rgba(217, 217, 217, 0.28)',
      },
      animation: {
        loader: 'loader 0.6s infinite alternate',
      },
      keyframes: {
        loader: {
          to: {
            transform: 'translate3d(0, -0.3rem, 0)',
          },
        },
      },
    },
  },
  plugins: [],
  prefix: '',
};
