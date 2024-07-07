import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  fonts: {
    heading: 'Rubik, sans-serif',
    body: 'Rubik, sans-serif',
  },
  fontWeights: {
    normal: 400,
    medium: 500,
    bold: 600,
  },
});

export default theme;
