import { useEffect, useState } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../theme';
import Navbar from '../components/Layout/Navbar';

function MyApp({ Component, pageProps }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <ChakraProvider theme={theme}>
      <Navbar />
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp; 