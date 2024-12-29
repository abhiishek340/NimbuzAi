import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.900' : 'gray.50',
      },
    }),
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'medium',
        borderRadius: 'xl',
      },
      variants: {
        solid: (props) => ({
          bg: 'transparent',
          bgGradient: 'linear(to-r, blue.400, purple.500)',
          color: 'white',
          _hover: {
            bgGradient: 'linear(to-r, blue.500, purple.600)',
            _disabled: {
              bgGradient: 'linear(to-r, blue.400, purple.500)',
            },
          },
        }),
        ghost: {
          _hover: {
            bg: props => props.colorMode === 'dark' ? 'whiteAlpha.200' : 'blackAlpha.50',
          }
        }
      }
    },
    IconButton: {
      baseStyle: {
        borderRadius: 'lg',
      },
      variants: {
        ghost: {
          _hover: {
            bg: props => props.colorMode === 'dark' ? 'whiteAlpha.200' : 'blackAlpha.50',
          }
        }
      }
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: 'xl',
          overflow: 'hidden',
          transition: 'all 0.2s',
          bg: props => props.colorMode === 'dark' ? 'gray.800' : 'white',
          borderColor: props => props.colorMode === 'dark' ? 'gray.700' : 'gray.200',
          _hover: {
            shadow: 'lg',
            transform: 'translateY(-2px)',
          }
        }
      }
    }
  }
});

export default theme; 