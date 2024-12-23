import { Box, Flex, Button, useColorMode, Image, Text, HStack } from '@chakra-ui/react';

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box 
      px={8} 
      py={4} 
      position="fixed" 
      w="full" 
      bg={colorMode === 'dark' ? 'gray.900' : 'white'}
      borderBottom="1px"
      borderColor={colorMode === 'dark' ? 'gray.700' : 'gray.100'}
      zIndex={1000}
    >
      <Flex maxW="1400px" mx="auto" alignItems="center" justifyContent="space-between">
        <Flex alignItems="center" gap={2}>
          <Image src="/logo.svg" h={8} alt="BrandAI Logo" />
          <Text fontSize="xl" fontWeight="bold" bgGradient="linear(to-r, blue.400, purple.500)" bgClip="text">
            BrandAI
          </Text>
        </Flex>
        
        <HStack spacing={8}>
          <Button variant="ghost">Features</Button>
          <Button variant="ghost">Pricing</Button>
          <Button variant="ghost">Resources</Button>
          <Button onClick={toggleColorMode} variant="ghost">
            {colorMode === 'light' ? '🌙' : '☀️'}
          </Button>
          <Button colorScheme="blue" rounded="full" px={8}>
            Get Started
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navbar; 