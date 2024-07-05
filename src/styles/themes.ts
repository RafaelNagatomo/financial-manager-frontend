import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    primary: {
      50: '#e3f2f9',
      100: '#c5e4f3',
      200: '#a2d4ec',
      300: '#7ac1e4',
      400: '#47a9da',
      500: '#0088cc',
      600: '#007ab8',
      700: '#006ba1',
      800: '#005885',
      900: '#003f5e',
    },
    secondary: {
      50: '#fcefee',
      100: '#f8d7d5',
      200: '#f3bdb9',
      300: '#ee9c96',
      400: '#e96a63',
      500: '#e02b2b',
      600: '#c82424',
      700: '#a31d1d',
      800: '#791515',
      900: '#531010',
    },
  },
  fonts: {
    heading: 'Aeonik, sans-serif',
    body: 'Aeonik, sans-serif',
  },
});

export default theme;
