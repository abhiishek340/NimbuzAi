import { 
  HStack, 
  IconButton, 
  useColorMode,
  Tooltip,
} from '@chakra-ui/react';
import { FiSun, FiMoon } from 'react-icons/fi';

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <HStack spacing={2}>
      <Tooltip label={`Switch to ${colorMode === 'dark' ? 'light' : 'dark'} mode`}>
        <IconButton
          aria-label="Toggle color mode"
          icon={colorMode === 'dark' ? <FiSun /> : <FiMoon />}
          onClick={toggleColorMode}
          variant="ghost"
          size="sm"
          color={colorMode === 'dark' ? 'gray.400' : 'gray.600'}
          _hover={{
            color: colorMode === 'dark' ? 'white' : 'gray.900',
            bg: colorMode === 'dark' ? 'whiteAlpha.200' : 'blackAlpha.50',
            transform: 'rotate(180deg)',
          }}
          transition="all 0.3s"
        />
      </Tooltip>
    </HStack>
  );
};

export default Navbar; 