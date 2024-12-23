import { ChakraProvider } from '@chakra-ui/react';
import theme from '../theme';
import Navbar from '../components/Layout/Navbar';

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Navbar />
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp; 