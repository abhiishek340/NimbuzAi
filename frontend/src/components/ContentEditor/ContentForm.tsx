import { 
  Box, 
  VStack, 
  HStack, 
  Select, 
  Textarea, 
  Button, 
  useToast,
  useColorMode,
  Text,
  Icon,
  Flex
} from '@chakra-ui/react';
import { useState } from 'react';
import { FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';

const ContentForm = () => {
  const [content, setContent] = useState('');
  const [platform, setPlatform] = useState('twitter');
  const { colorMode } = useColorMode();
  const toast = useToast();

  const handleSubmit = async () => {
    toast({
      title: 'Content Transformed',
      status: 'success',
      duration: 3000,
    });
  };

  return (
    <Box 
      p={8} 
      bg={colorMode === 'dark' ? 'gray.800' : 'white'} 
      rounded="xl" 
      shadow="xl"
      border="1px"
      borderColor={colorMode === 'dark' ? 'gray.700' : 'gray.100'}
    >
      <VStack spacing={6} align="stretch">
        <HStack spacing={4}>
          <Select 
            value={platform} 
            onChange={(e) => setPlatform(e.target.value)}
            size="lg"
            variant="filled"
            w="200px"
          >
            <option value="twitter">Twitter</option>
            <option value="linkedin">LinkedIn</option>
            <option value="instagram">Instagram</option>
          </Select>
          <Flex gap={2}>
            <Icon as={FaTwitter} w={6} h={6} color="twitter.500" />
            <Icon as={FaLinkedin} w={6} h={6} color="linkedin.500" />
            <Icon as={FaInstagram} w={6} h={6} color="pink.500" />
          </Flex>
        </HStack>

        <Box position="relative">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your content here..."
            minH="200px"
            size="lg"
            resize="vertical"
            bg={colorMode === 'dark' ? 'gray.700' : 'gray.50'}
            border="none"
            _focus={{
              boxShadow: 'none',
              bg: colorMode === 'dark' ? 'gray.600' : 'white',
            }}
          />
          <Text 
            position="absolute" 
            bottom={2} 
            right={2} 
            fontSize="sm" 
            color="gray.500"
          >
            {content.length} / 280
          </Text>
        </Box>

        <Button 
          colorScheme="blue"
          size="lg"
          onClick={handleSubmit}
          rounded="full"
          py={7}
          bgGradient="linear(to-r, blue.400, purple.500)"
          _hover={{
            bgGradient: "linear(to-r, blue.500, purple.600)",
          }}
        >
          Transform Content
        </Button>
      </VStack>
    </Box>
  );
};

export default ContentForm; 