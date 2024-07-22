import { defineStyleConfig, extendTheme } from '@chakra-ui/react';
import type { StyleFunctionProps } from '@chakra-ui/styled-system'
import { mode } from '@chakra-ui/theme-tools'

const Button = defineStyleConfig({
  defaultProps: {
    size: 'sm',
    colorScheme: 'purple',
  },
});

const Switch = defineStyleConfig({
  defaultProps: {
    size: 'sm',
    colorScheme: 'purple',
  },
});

const Progress = defineStyleConfig({
  baseStyle: {
    track: {
      bg: 'gray.300'
    }
  },
  defaultProps: {
    size: 'md',
    colorScheme: 'purple',
  },
});

const Input = {
  variants: {
    outline: (props: StyleFunctionProps) => ({
      field: {
        bg: mode('gray.200', 'gray.700')(props),
        borderColor: mode('purple.300', 'purple.600')(props),
        _hover: {
          borderColor: mode('purple.500', 'gray.500')(props),
        },
        _focus: {
          borderColor: mode('purple.500', 'purple.500')(props),
          boxShadow: `0 0 0 1px ${mode('purple.500', 'purple.300')(props)}`,
        },
      },
    }),
  },
  defaultProps: {
    size: 'md',
    variant: 'outline',
  },
}

const NumberInput = {
  variants: {
    outline: (props: StyleFunctionProps) => ({
      field: {
        bg: mode('gray.200', 'gray.700')(props),
        borderColor: mode('purple.300', 'purple.600')(props),
        _hover: {
          borderColor: mode('purple.500', 'gray.500')(props),
        },
        _focus: {
          borderColor: mode('purple.500', 'purple.500')(props),
          boxShadow: `0 0 0 1px ${mode('purple.500', 'purple.300')(props)}`,
        },
      },
    }),
  },
  defaultProps: {
    size: 'md',
    variant: 'outline',
  },
}

const Select = {
  variants: {
    outline: (props: StyleFunctionProps) => ({
      field: {
        bg: mode('gray.200', 'gray.700')(props),
        borderColor: mode('purple.300', 'purple.600')(props),
        color: mode('black', 'white')(props),
        _hover: {
          borderColor: mode('purple.400', 'purple.500')(props),
        },
        _focus: {
          borderColor: mode('purple.500', 'purple.300')(props),
          boxShadow: `0 0 0 1px ${mode('purple.500', 'purple.300')(props)}`,
        },
      },
    }),
  },
  defaultProps: {
    size: 'md',
    variant: 'outline',
  },
}

export const theme = extendTheme({
  styles: {
    global: (props: StyleFunctionProps) => ({
      'html, body': {
        bgGradient: mode(
          'linear(to-r, blackAlpha.200, gray.400)','linear(to-r, whiteAlpha.200, gray.800)')(props),
        color: mode('blackAlpha.800', 'whiteAlpha.800')(props),
      },
    }),
  },
  layerStyles: {
    dark: {
      bg: 'gray.800',
      color: 'whiteAlpha.800'
    },
    light: {
      bg: 'gray.300',
      color: 'blackAlpha.800'
    },
    darkTable: {
      bg: 'gray.700',
      color: 'whiteAlpha.700'
    },
    lightTable: {
      bg: 'gray.100',
      color: 'blackAlpha.800'
    },
    darkCard: {
      bg: 'gray.700',
      color: 'whiteAlpha.700'
    },
    lightCard: {
      bg: 'gray.100',
      color: 'blackAlpha.800'
    },
  },
  fonts: {
    heading: 'Rubik, sans-serif',
    body: 'Rubik, sans-serif',
  },
  fontWeights: {
    normal: 400,
    medium: 500,
    bold: 600,
  },
  components: {
    Button,
    Input,
    NumberInput,
    Select,
    Switch,
    Progress
  },
});

