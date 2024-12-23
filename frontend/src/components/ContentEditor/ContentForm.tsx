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
  Flex,
  IconButton,
  Tooltip,
  Input,
  Image,
  AspectRatio,
  Grid
} from '@chakra-ui/react';
import { useState, useRef, useEffect } from 'react';
import { 
  FaTwitter, 
  FaLinkedin, 
  FaInstagram, 
  FaTiktok, 
  FaFacebook, 
  FaSnapchat,
  FaFileUpload,
  FaFilePdf,
  FaTrash
} from 'react-icons/fa';
import { aiService } from '../../services/aiService';
import dynamic from 'next/dynamic';
import SpeechRecognitionWrapper from './SpeechRecognitionWrapper';

interface SocialPlatform {
  id: string;
  name: string;
  icon: any;
  color: string;
  authUrl: string;
  maxLength?: number;
}

const socialPlatforms: SocialPlatform[] = [
  {
    id: 'twitter',
    name: 'Twitter',
    icon: FaTwitter,
    color: 'twitter.500',
    authUrl: 'https://twitter.com/i/oauth2/authorize',
    maxLength: 280
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: FaLinkedin,
    color: 'linkedin.500',
    authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
    maxLength: 3000
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: FaInstagram,
    color: 'pink.500',
    authUrl: 'https://api.instagram.com/oauth/authorize'
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: FaTiktok,
    color: 'black',
    authUrl: 'https://www.tiktok.com/auth/authorize/',
    maxLength: 2200
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: FaFacebook,
    color: 'facebook.500',
    authUrl: 'https://www.facebook.com/v12.0/dialog/oauth',
    maxLength: 63206
  },
  {
    id: 'snapchat',
    name: 'Snapchat',
    icon: FaSnapchat,
    color: 'yellow.400',
    authUrl: 'https://accounts.snapchat.com/accounts/oauth2/authorize'
  }
];

interface MediaFile {
  type: 'image' | 'video' | 'pdf' | 'doc';
  file: File;
  preview: string;
}

const isBrowser = typeof window !== 'undefined';

const ContentForm = () => {
  const [content, setContent] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('twitter');
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);
  const { colorMode } = useColorMode();
  const toast = useToast();
  const [isTransforming, setIsTransforming] = useState(false);
  const [transformedContent, setTransformedContent] = useState('');
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handlePlatformAuth = async (platform: SocialPlatform) => {
    localStorage.setItem('redirectUrl', window.location.href);
    window.open(platform.authUrl, '_blank');
  };

  const handleTransform = async () => {
    if (!content.trim()) {
      toast({
        title: 'Empty content',
        description: 'Please enter some content to transform',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    setIsTransforming(true);
    try {
      const transformed = await aiService.transformContent({
        content,
        platform: selectedPlatform,
        tone: 'professional' // You can make this configurable
      });
      
      setTransformedContent(transformed);
      toast({
        title: 'Content Transformed',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Transformation failed',
        description: 'Failed to transform content. Please try again.',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsTransforming(false);
    }
  };

  const handleSubmit = async () => {
    if (!connectedPlatforms.includes(selectedPlatform)) {
      toast({
        title: 'Platform not connected',
        description: 'Please connect to the platform first',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    const platform = socialPlatforms.find(p => p.id === selectedPlatform);
    if (platform?.maxLength && content.length > platform.maxLength) {
      toast({
        title: 'Content too long',
        description: `Maximum length for ${platform.name} is ${platform.maxLength} characters`,
        status: 'error',
        duration: 3000,
      });
      return;
    }

    toast({
      title: 'Content Transformed',
      status: 'success',
      duration: 3000,
    });
  };

  const currentPlatform = socialPlatforms.find(p => p.id === selectedPlatform);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newMediaFiles: MediaFile[] = Array.from(files).map(file => {
      const type = file.type.startsWith('image/') ? 'image' :
                  file.type.startsWith('video/') ? 'video' :
                  file.type === 'application/pdf' ? 'pdf' : 'doc';

      return {
        type,
        file,
        preview: type === 'image' ? URL.createObjectURL(file) : ''
      };
    });

    setMediaFiles([...mediaFiles, ...newMediaFiles]);
  };

  const handleTranscriptChange = (transcript: string) => {
    setContent(prev => prev + ' ' + transcript);
  };

  const removeMedia = (index: number) => {
    const newMediaFiles = [...mediaFiles];
    URL.revokeObjectURL(newMediaFiles[index].preview);
    newMediaFiles.splice(index, 1);
    setMediaFiles(newMediaFiles);
  };

  if (!isMounted) {
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
          <Text>Loading...</Text>
        </VStack>
      </Box>
    );
  }

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
            value={selectedPlatform} 
            onChange={(e) => setSelectedPlatform(e.target.value)}
            size="lg"
            variant="filled"
            w="200px"
          >
            {socialPlatforms.map(platform => (
              <option key={platform.id} value={platform.id}>
                {platform.name}
              </option>
            ))}
          </Select>
          <Flex gap={2}>
            {socialPlatforms.map(platform => (
              <Tooltip 
                key={platform.id}
                label={connectedPlatforms.includes(platform.id) 
                  ? `Connected to ${platform.name}` 
                  : `Connect to ${platform.name}`}
              >
                <IconButton
                  aria-label={platform.name}
                  icon={<Icon as={platform.icon} />}
                  color={platform.color}
                  variant={connectedPlatforms.includes(platform.id) ? "solid" : "ghost"}
                  onClick={() => handlePlatformAuth(platform)}
                />
              </Tooltip>
            ))}
          </Flex>
        </HStack>

        <HStack spacing={4}>
          <Input
            type="file"
            ref={fileInputRef}
            display="none"
            multiple
            accept="image/*,video/*,application/pdf,.doc,.docx"
            onChange={handleFileUpload}
          />
          <Tooltip label="Upload Media">
            <IconButton
              aria-label="Upload files"
              icon={<FaFileUpload />}
              onClick={() => fileInputRef.current?.click()}
            />
          </Tooltip>
          <SpeechRecognitionWrapper onTranscriptChange={handleTranscriptChange} />
        </HStack>

        {mediaFiles.length > 0 && (
          <Grid templateColumns="repeat(auto-fill, minmax(100px, 1fr))" gap={4}>
            {mediaFiles.map((media, index) => (
              <Box key={index} position="relative">
                {media.type === 'image' && (
                  <Image
                    src={media.preview}
                    alt="Preview"
                    objectFit="cover"
                    w="100px"
                    h="100px"
                  />
                )}
                {media.type === 'video' && (
                  <AspectRatio ratio={1}>
                    <video src={URL.createObjectURL(media.file)} controls />
                  </AspectRatio>
                )}
                {media.type === 'pdf' && (
                  <Icon as={FaFilePdf} w={10} h={10} />
                )}
                <IconButton
                  aria-label="Remove media"
                  icon={<Icon as={FaTrash} />}
                  size="xs"
                  position="absolute"
                  top={1}
                  right={1}
                  onClick={() => removeMedia(index)}
                />
              </Box>
            ))}
          </Grid>
        )}

        <Box position="relative">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your content here..."
            minH="150px"
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
            color={content.length > (currentPlatform?.maxLength || Infinity) ? 'red.500' : 'gray.500'}
          >
            {content.length} / {currentPlatform?.maxLength || '∞'}
          </Text>
        </Box>

        {transformedContent && (
          <Box position="relative">
            <Text mb={2} fontWeight="bold">Transformed Content:</Text>
            <Textarea
              value={transformedContent}
              onChange={(e) => setTransformedContent(e.target.value)}
              placeholder="Transformed content will appear here..."
              minH="150px"
              size="lg"
              resize="vertical"
              bg={colorMode === 'dark' ? 'gray.700' : 'gray.50'}
              border="none"
            />
          </Box>
        )}

        <Button 
          colorScheme="blue"
          size="lg"
          onClick={handleTransform}
          isLoading={isTransforming}
          loadingText="Transforming..."
          rounded="full"
          py={7}
          bgGradient="linear(to-r, blue.400, purple.500)"
          _hover={{
            bgGradient: "linear(to-r, blue.500, purple.600)",
          }}
        >
          Transform Content
        </Button>

        {transformedContent && (
          <Button
            colorScheme="green"
            size="lg"
            onClick={handleSubmit}
            rounded="full"
            py={7}
          >
            Post to {currentPlatform?.name}
          </Button>
        )}
      </VStack>
    </Box>
  );
};

export default dynamic(() => Promise.resolve(ContentForm), {
  ssr: false
}); 