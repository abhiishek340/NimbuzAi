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
  IconButton,
  Tooltip,
  Grid,
  Divider,
  Card,
  CardHeader,
  CardBody,
  Badge,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Portal,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure
} from '@chakra-ui/react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiImage, 
  FiVideo, 
  FiMic, 
  FiCalendar, 
  FiMoreVertical,
  FiTrash2,
  FiMaximize2,
  FiDownload,
  FiCopy,
  FiEdit2,
  FiShare2,
  FiActivity,
  FiUpload
} from 'react-icons/fi';
import { 
  FaTwitter, 
  FaLinkedin, 
  FaInstagram, 
  FaTiktok, 
  FaFacebook, 
  FaSnapchat 
} from 'react-icons/fa';
import PostCalendar from '../Calendar/PostCalendar';
import { aiService } from '../../services/aiService';
import { socialMediaService } from '../../services/socialMediaService';
import { imageGenerationService } from '../../services/imageGenerationService';
import { authService } from '../../services/authService';
import BrainstormModal from './BrainstormModal';
import { useDropzone } from 'react-dropzone';
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

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
    id: 'facebook',
    name: 'Facebook',
    icon: FaFacebook,
    color: 'facebook.500',
    authUrl: 'https://www.facebook.com/v12.0/dialog/oauth',
    maxLength: 63206
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: FaTiktok,
    color: 'gray.900',
    authUrl: 'https://www.tiktok.com/auth/authorize/',
    maxLength: 2200
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

const MotionBox = motion(Box);
const MotionButton = motion(Button);

// First, add animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

const PlatformButton = ({ platform, isSelected, isConnected, onClick }) => {
  const { colorMode } = useColorMode();
  const toast = useToast();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent platform selection when clicking connect
    
    setIsConnecting(true);
    try {
      await authService.connectPlatform(platform.id);
    } catch (error) {
      console.error(`Error connecting to ${platform.name}:`, error);
      toast({
        title: `Failed to connect to ${platform.name}`,
        description: error instanceof Error ? error.message : 'Please try again',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const getPlatformColors = (platformId) => {
    const colors = {
      twitter: {
        bg: 'blue.50',
        hover: 'blue.100',
        selected: 'blue.500',
        darkBg: 'blue.900',
        darkHover: 'blue.800',
        text: 'blue.600'
      },
      linkedin: {
        bg: 'linkedin.50',
        hover: 'linkedin.100',
        selected: 'linkedin.600',
        darkBg: 'linkedin.900',
        darkHover: 'linkedin.800',
        text: 'linkedin.700'
      },
      instagram: {
        bg: 'pink.50',
        hover: 'pink.100',
        selected: 'pink.500',
        darkBg: 'pink.900',
        darkHover: 'pink.800',
        text: 'pink.600'
      },
      facebook: {
        bg: 'facebook.50',
        hover: 'facebook.100',
        selected: 'facebook.600',
        darkBg: 'facebook.900',
        darkHover: 'facebook.800',
        text: 'facebook.700'
      },
      tiktok: {
        bg: 'gray.50',
        hover: 'gray.100',
        selected: 'gray.700',
        darkBg: 'gray.800',
        darkHover: 'gray.700',
        text: 'gray.800'
      },
      snapchat: {
        bg: 'yellow.50',
        hover: 'yellow.100',
        selected: 'yellow.500',
        darkBg: 'yellow.900',
        darkHover: 'yellow.800',
        text: 'yellow.600'
      }
    };
    return colors[platformId];
  };

  const colors = getPlatformColors(platform.id);

  return (
    <MotionBox
      variants={itemVariants}
      whileHover={{ x: 8, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
    >
      <Button
        w="full"
        h="50px"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        px={4}
        bg={isSelected 
          ? colors.selected
          : colorMode === 'dark' 
            ? colors.darkBg 
            : colors.bg
        }
        color={isSelected 
          ? 'white'
          : colorMode === 'dark' 
            ? 'white' 
            : colors.text
        }
        _hover={{
          bg: isSelected 
            ? colors.selected
            : colorMode === 'dark'
              ? colors.darkHover
              : colors.hover,
          transform: 'translateX(4px)'
        }}
        onClick={onClick}
        position="relative"
        rounded="xl"
        shadow={isSelected ? 'md' : 'sm'}
        borderWidth="1px"
        borderColor={isSelected 
          ? colors.selected
          : colorMode === 'dark' 
            ? 'gray.700' 
            : 'gray.200'
        }
        transition="all 0.2s"
      >
        <HStack spacing={3}>
          <Icon 
            as={platform.icon} 
            boxSize={5}
            color={isSelected 
              ? 'white'
              : colorMode === 'dark' 
                ? 'white' 
                : colors.text
            }
          />
          <Text 
            fontWeight="medium"
            color={isSelected 
              ? 'white'
              : colorMode === 'dark' 
                ? 'white' 
                : colors.text
            }
          >
            {platform.name}
          </Text>
        </HStack>
        
        {!isConnected && (
          <Button
            size="sm"
            onClick={handleConnect}
            isLoading={isConnecting}
            loadingText="Connecting..."
            bg={isSelected 
              ? 'whiteAlpha.300'
              : colorMode === 'dark' 
                ? 'whiteAlpha.200' 
                : `${platform.id}.100`
            }
            color={isSelected 
              ? 'white'
              : colorMode === 'dark' 
                ? 'white' 
                : colors.text
            }
            _hover={{
              bg: isSelected 
                ? 'whiteAlpha.400'
                : colorMode === 'dark' 
                  ? 'whiteAlpha.300' 
                  : `${platform.id}.200`
            }}
            px={3}
            rounded="full"
          >
            Connect
          </Button>
        )}
      </Button>
    </MotionBox>
  );
};

// Add these new interfaces and components at the top
interface BrainstormIdea {
  title: string;
  content: string;
}

interface BrainstormModalProps {
  isOpen: boolean;
  onClose: () => void;
  ideas: Array<{ title: string, content: string }>;
  onSelectIdea: (idea: { title: string, content: string }) => void;
}

const TransformModal = ({ isOpen, onClose, transformedContent, onApply }) => {
  const { colorMode } = useColorMode();

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" isCentered>
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent
        bg={colorMode === 'dark' ? 'gray.800' : 'white'}
        shadow="2xl"
      >
        <ModalHeader borderBottomWidth="1px">
          <HStack>
            <Icon as={FiEdit2} color={colorMode === 'dark' ? 'blue.300' : 'blue.500'} />
            <Text>Transformed Content</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody py={6}>
          <VStack spacing={4} align="stretch">
            <Box
              p={4}
              bg={colorMode === 'dark' ? 'gray.700' : 'gray.50'}
              rounded="lg"
              borderWidth="1px"
              borderColor={colorMode === 'dark' ? 'gray.600' : 'gray.200'}
            >
              <Text whiteSpace="pre-wrap" fontSize="md">
                {transformedContent}
              </Text>
            </Box>
            <HStack spacing={4} justify="flex-end">
              <Button
                leftIcon={<FiCopy />}
                onClick={() => {
                  navigator.clipboard.writeText(transformedContent);
                  toast({
                    title: "Copied to clipboard",
                    status: "success",
                    duration: 2000,
                  });
                }}
                colorScheme="gray"
              >
                Copy
              </Button>
              <Button
                leftIcon={<FiEdit2 />}
                onClick={() => {
                  setContent(transformedContent);
                  onClose();
                }}
                colorScheme="blue"
              >
                Use This
              </Button>
            </HStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const ButtonWithAnimation = ({ icon, label, onClick, isLoading = false, colorScheme = "blue" }) => (
  <MotionButton
    leftIcon={<Icon as={icon} />}
    colorScheme={colorScheme}
    onClick={onClick}
    isLoading={isLoading}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    transition={{ duration: 0.2 }}
    size="md"
    px={6}
    shadow="md"
    _hover={{ shadow: "lg" }}
  >
    {label}
  </MotionButton>
);

// Add this function for file type validation
const isValidFileType = (file: File) => {
  const validTypes = {
    'image': ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    'video': ['video/mp4', 'video/webm', 'video/quicktime'],
    'document': ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  };

  if (validTypes.image.includes(file.type)) return 'image';
  if (validTypes.video.includes(file.type)) return 'video';
  if (validTypes.document.includes(file.type)) return 'document';
  return null;
};

// Add these components for file upload and voice input
const FileUploadArea = ({ onFileSelect }) => {
  const { colorMode } = useColorMode();
  const toast = useToast();

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach(file => {
      const fileType = isValidFileType(file);
      if (fileType) {
        onFileSelect(file, fileType);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload images, videos, PDFs, or documents",
          status: "error",
          duration: 3000,
        });
      }
    });
  }, [onFileSelect, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <Box
      {...getRootProps()}
      p={6}
      border="2px dashed"
      borderColor={isDragActive ? 'blue.400' : colorMode === 'dark' ? 'gray.600' : 'gray.200'}
      borderRadius="xl"
      bg={isDragActive ? (colorMode === 'dark' ? 'blue.800' : 'blue.50') : 'transparent'}
      cursor="pointer"
      transition="all 0.2s"
      _hover={{
        borderColor: 'blue.400',
        bg: colorMode === 'dark' ? 'whiteAlpha.50' : 'gray.50'
      }}
    >
      <input {...getInputProps()} />
      <VStack spacing={2}>
        <Icon as={FiUpload} boxSize={6} color={isDragActive ? 'blue.400' : 'gray.500'} />
        <Text align="center" color={isDragActive ? 'blue.400' : 'gray.500'}>
          {isDragActive
            ? "Drop files here..."
            : "Drag & drop files here, or click to select"}
        </Text>
        <Text fontSize="sm" color="gray.500">
          Supports: Images, Videos, PDFs, and Documents
        </Text>
      </VStack>
    </Box>
  );
};

const VoiceInput = ({ onTranscript }) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      onTranscript(transcript);
    }
  }, [transcript, onTranscript]);

  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  return (
    <IconButton
      aria-label="Voice input"
      icon={<FiMic />}
      colorScheme={listening ? 'red' : 'gray'}
      isRound
      size="lg"
      onMouseDown={() => {
        resetTranscript();
        SpeechRecognition.startListening({ continuous: true });
      }}
      onMouseUp={() => {
        SpeechRecognition.stopListening();
      }}
      onTouchStart={() => {
        resetTranscript();
        SpeechRecognition.startListening({ continuous: true });
      }}
      onTouchEnd={() => {
        SpeechRecognition.stopListening();
      }}
    />
  );
};

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
  const [isPosting, setIsPosting] = useState(false);
  const [scheduledDate, setScheduledDate] = useState(null);
  const scheduleDisclosure = useDisclosure();
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const previewDisclosure = useDisclosure();
  const [brainstormIdeas, setBrainstormIdeas] = useState<Array<{ title: string; content: string }>>([]);
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false);
  const brainstormDisclosure = useDisclosure();
  const transformDisclosure = useDisclosure();
  const [drafts, setDrafts] = useState<Array<{ content: string; date: string }>>([]);
  const [isSaving, setIsSaving] = useState(false);
  
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
        title: 'Please enter some content first',
        description: 'Write something to transform',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    if (!selectedPlatform) {
      toast({
        title: 'Select a platform',
        description: 'Choose a platform to optimize content for',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    setIsTransforming(true);
    try {
      const result = await aiService.transformContent({
        content,
        platform: selectedPlatform,
        tone: 'professional'
      });

      if (result.success && result.transformedContent) {
        setTransformedContent(result.transformedContent);
        transformDisclosure.onOpen();
      } else {
        throw new Error(result.error || 'Failed to transform content');
      }
    } catch (error) {
      console.error('Transform error:', error);
      toast({
        title: "Error transforming content",
        description: error.message || "Failed to transform content. Please try again.",
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsTransforming(false);
    }
  };

  // Helper functions for content transformation
  const getRelevantHashtags = (content: string, limit: number) => {
    const keywords = content.toLowerCase()
      .split(' ')
      .filter(word => word.length > 4)
      .map(word => word.replace(/[^a-zA-Z0-9]/g, ''));
    
    const commonHashtags = {
      marketing: ['Marketing', 'DigitalMarketing', 'MarketingStrategy'],
      business: ['Business', 'Entrepreneurship', 'Success'],
      technology: ['Tech', 'Innovation', 'Digital'],
      growth: ['Growth', 'Development', 'Progress'],
      social: ['SocialMedia', 'Community', 'Networking']
    };

    let hashtags = new Set<string>();
    keywords.forEach(keyword => {
      Object.entries(commonHashtags).forEach(([category, tags]) => {
        if (content.toLowerCase().includes(category)) {
          tags.forEach(tag => hashtags.add(tag));
        }
      });
    });

    return Array.from(hashtags)
      .slice(0, limit)
      .map(tag => `#${tag}`)
      .join(' ');
  };

  const getTrendingHashtags = (limit: number) => {
    const trending = [
      'trending', 'viral', 'fyp', 'foryou', 'trending2024',
      'learn', 'education', 'tips', 'howto', 'strategy'
    ];
    return trending
      .slice(0, limit)
      .map(tag => `#${tag}`)
      .join(' ');
  };

  const generateKeyTakeaway = (content: string) => {
    const sentences = content.split('.');
    return sentences[0].trim() + (sentences.length > 1 ? '.' : '');
  };

  const handlePost = async () => {
    if (!connectedPlatforms.includes(selectedPlatform)) {
      toast({
        title: 'Platform not connected',
        description: 'Please connect to the platform first',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    setIsPosting(true);
    try {
      await socialMediaService.postToSocialMedia({
        content: transformedContent || content,
        mediaFiles: mediaFiles.map(m => m.file),
        platform: selectedPlatform,
        scheduledDate
      });

      toast({
        title: scheduledDate ? 'Post Scheduled' : 'Posted Successfully',
        description: scheduledDate ? 
          `Content scheduled for ${scheduledDate.toLocaleString()}` :
          `Content posted to ${selectedPlatform}`,
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Posting Failed',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsPosting(false);
    }
  };

  const currentPlatform = socialPlatforms.find(p => p.id === selectedPlatform);

  const handleFileSelect = (file: File, type: string) => {
    const newFile = {
      file,
      type,
      preview: URL.createObjectURL(file)
    };
    setMediaFiles(prev => [...prev, newFile]);
  };

  const handleVoiceTranscript = (text: string) => {
    setContent(prev => prev + ' ' + text);
  };

  const handleSchedule = (date: Date) => {
    setScheduledDate(date);
    scheduleDisclosure.onClose();
    toast({
      title: "Post scheduled",
      description: `Your post will be published on ${date.toLocaleDateString()}`,
      status: "success",
      duration: 3000,
    });
  };

  const handleRemoveMedia = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSelectIdea = (idea: { title: string, content: string }) => {
    setContent(idea.content);
    brainstormDisclosure.onClose();
    toast({
      title: "Idea selected",
      description: "Content updated with selected idea",
      status: "success",
      duration: 2000,
    });
  };

  const handleBrainstorm = async () => {
    setIsGeneratingIdeas(true);
    try {
      const prompt = content.trim() 
        ? `Generate content ideas related to: ${content}`
        : "Generate engaging social media content ideas";

      const result = await aiService.generateIdeas(prompt);
      if (result.success && result.ideas) {
        setBrainstormIdeas(result.ideas);
        brainstormDisclosure.onOpen();
      }
    } catch (error) {
      console.error('Brainstorm error:', error);
      toast({
        title: "Error generating ideas",
        description: error.message || "Please try again",
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsGeneratingIdeas(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!content.trim()) {
      toast({
        title: "No content to save",
        description: "Please write something first",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    setIsSaving(true);
    try {
      const newDraft = {
        content,
        date: new Date().toISOString(),
        platform: selectedPlatform
      };

      // Save to local storage for now
      const existingDrafts = JSON.parse(localStorage.getItem('contentDrafts') || '[]');
      const updatedDrafts = [newDraft, ...existingDrafts];
      localStorage.setItem('contentDrafts', JSON.stringify(updatedDrafts));

      toast({
        title: "Draft saved",
        status: "success",
        duration: 2000,
      });
    } catch (error) {
      console.error('Error saving draft:', error);
      toast({
        title: "Error saving draft",
        description: "Please try again",
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!content.trim()) {
      toast({
        title: "No content for image generation",
        description: "Please write some content first",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    setIsGeneratingImage(true);
    try {
      const result = await imageGenerationService.generateImage(content);
      console.log('Image generation result:', result);

      if (result.success && result.imageUrl) {
        const newMedia = {
          type: 'image' as const,
          file: await urlToFile(result.imageUrl, 'generated-image.png', 'image/png'),
          preview: result.imageUrl
        };

        setMediaFiles(prev => [...prev, newMedia]);
        setSelectedImage(result.imageUrl);
        previewDisclosure.onOpen();

        toast({
          title: "Image generated successfully",
          status: "success",
          duration: 2000,
        });
      } else {
        throw new Error(result.error || 'Failed to generate image');
      }
    } catch (error) {
      console.error('Image generation error:', error);
      toast({
        title: "Error generating image",
        description: "Please try again with a simpler prompt or wait a few moments",
        status: "error",
        duration: 4000,
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Add this helper function to convert URL to File
  const urlToFile = async (url: string, filename: string, mimeType: string): Promise<File> => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new File([blob], filename, { type: mimeType });
    } catch (error) {
      console.error('Error converting URL to File:', error);
      throw error;
    }
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
    <VStack spacing={6} w="full" align="stretch">
      {/* Platform Selection */}
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4}>
          {socialPlatforms.map((platform) => (
            <PlatformButton
              key={platform.id}
              platform={platform}
              isSelected={selectedPlatform === platform.id}
              isConnected={connectedPlatforms.includes(platform.id)}
              onClick={() => setSelectedPlatform(platform.id)}
            />
          ))}
        </Grid>
      </MotionBox>

      {/* Content Input Area */}
      <Box position="relative" w="full">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your content here..."
          minH="200px"
          resize="vertical"
          bg={colorMode === 'dark' ? 'gray.700' : 'white'}
          border="2px"
          borderColor={colorMode === 'dark' ? 'gray.600' : 'gray.200'}
          _hover={{ borderColor: 'blue.400' }}
          _focus={{ borderColor: 'blue.500', boxShadow: 'none' }}
          fontSize="md"
          p={4}
          borderRadius="xl"
        />
      </Box>

      {/* Action Buttons */}
      <Grid 
        templateColumns={{ 
          base: "1fr", 
          sm: "repeat(2, 1fr)", 
          md: "repeat(3, 1fr)", 
          lg: "repeat(5, 1fr)" 
        }} 
        gap={4}
      >
        <MotionButton
          leftIcon={<FiEdit2 />}
          colorScheme="gray"
          onClick={handleSaveDraft}
          isLoading={isSaving}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          h="48px"
          fontSize="md"
          shadow="md"
          _hover={{ shadow: 'lg' }}
        >
          Save Draft
        </MotionButton>

        <MotionButton
          leftIcon={<FiImage />}
          colorScheme="purple"
          onClick={handleGenerateImage}
          isLoading={isGeneratingImage}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          h="48px"
          fontSize="md"
          shadow="md"
          _hover={{ shadow: 'lg' }}
        >
          Generate Image
        </MotionButton>

        <MotionButton
          leftIcon={<FiActivity />}
          colorScheme="pink"
          onClick={handleBrainstorm}
          isLoading={isGeneratingIdeas}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          h="48px"
          fontSize="md"
          shadow="md"
          _hover={{ shadow: 'lg' }}
        >
          Brainstorm
        </MotionButton>

        <MotionButton
          leftIcon={<FiShare2 />}
          colorScheme="blue"
          onClick={handleTransform}
          isLoading={isTransforming}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          h="48px"
          fontSize="md"
          shadow="md"
          _hover={{ shadow: 'lg' }}
        >
          Transform
        </MotionButton>

        <MotionButton
          leftIcon={<FiCalendar />}
          colorScheme="orange"
          onClick={scheduleDisclosure.onOpen}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          h="48px"
          fontSize="md"
          shadow="md"
          _hover={{ shadow: 'lg' }}
        >
          Schedule
        </MotionButton>
      </Grid>

      {/* Media Preview Area */}
      {mediaFiles.length > 0 && (
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          p={4}
          bg={colorMode === 'dark' ? 'gray.700' : 'gray.50'}
          borderRadius="xl"
          borderWidth="1px"
          borderColor={colorMode === 'dark' ? 'gray.600' : 'gray.200'}
        >
          <Text mb={4} fontWeight="medium">Uploaded Media</Text>
          <Grid templateColumns="repeat(auto-fill, minmax(150px, 1fr))" gap={4}>
            {mediaFiles.map((file, index) => (
              <MediaPreviewCard
                key={index}
                media={file}
                onRemove={() => handleRemoveMedia(index)}
                onView={() => {
                  setSelectedImage(URL.createObjectURL(file));
                  previewDisclosure.onOpen();
                }}
                onDownload={() => handleDownloadMedia(file)}
              />
            ))}
          </Grid>
        </MotionBox>
      )}

      {/* Post Button */}
      <MotionButton
        colorScheme="blue"
        size="lg"
        isLoading={isPosting}
        onClick={handlePost}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        h="60px"
        fontSize="lg"
        bgGradient="linear(to-r, blue.400, purple.500)"
        _hover={{
          bgGradient: "linear(to-r, blue.500, purple.600)",
        }}
        leftIcon={<FiShare2 />}
        shadow="lg"
        mt={4}
      >
        Post Content
      </MotionButton>

      {/* Modals */}
      <BrainstormModal
        isOpen={brainstormDisclosure.isOpen}
        onClose={brainstormDisclosure.onClose}
        ideas={brainstormIdeas}
        onSelectIdea={handleSelectIdea}
      />

      <Modal isOpen={transformDisclosure.isOpen} onClose={transformDisclosure.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Transformed Content</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Text mb={4}>{transformedContent}</Text>
            <HStack spacing={4}>
              <Button
                leftIcon={<FiCopy />}
                onClick={() => {
                  navigator.clipboard.writeText(transformedContent);
                  toast({
                    title: "Copied to clipboard",
                    status: "success",
                    duration: 2000,
                  });
                }}
              >
                Copy
              </Button>
              <Button
                leftIcon={<FiEdit2 />}
                onClick={() => {
                  setContent(transformedContent);
                  transformDisclosure.onClose();
                }}
              >
                Edit
              </Button>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Schedule Modal */}
      <ScheduleModal
        isOpen={scheduleDisclosure.isOpen}
        onClose={scheduleDisclosure.onClose}
        onDateSelect={handleSchedule}
      />

      {/* Media Preview Modal */}
      <MediaPreviewModal
        isOpen={previewDisclosure.isOpen}
        onClose={() => {
          previewDisclosure.onClose();
          setSelectedImage(null);
        }}
        imageUrl={selectedImage}
      />
    </VStack>
  );
};

// Add these new components at the bottom of the file
const MediaPreviewCard = ({ media, onRemove, onView, onDownload }) => {
  const { colorMode } = useColorMode();

  return (
    <MotionBox
      position="relative"
      rounded="lg"
      overflow="hidden"
      bg={colorMode === 'dark' ? 'gray.800' : 'white'}
      shadow="md"
      transition="all 0.2s"
      whileHover={{ scale: 1.02 }}
      onClick={onView}
      cursor="pointer"
    >
      <Box position="relative" h="150px">
        {media.type === 'image' && (
          <Image
            src={media.preview}
            alt="Preview"
            objectFit="cover"
            w="full"
            h="full"
            loading="eager"
          />
        )}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="blackAlpha.300"
          opacity={0}
          transition="opacity 0.2s"
          _groupHover={{ opacity: 1 }}
        />
      </Box>

      {/* Controls */}
      <HStack
        position="absolute"
        top={2}
        right={2}
        spacing={1}
      >
        <IconButton
          icon={<FiTrash2 />}
          aria-label="Remove media"
          size="sm"
          colorScheme="red"
          variant="solid"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          opacity={0.8}
          _hover={{ opacity: 1 }}
        />
        <IconButton
          icon={<FiDownload />}
          aria-label="Download media"
          size="sm"
          colorScheme="green"
          variant="solid"
          onClick={(e) => {
            e.stopPropagation();
            onDownload();
          }}
          opacity={0.8}
          _hover={{ opacity: 1 }}
        />
      </HStack>
    </MotionBox>
  );
};

const MediaPreviewModal = ({ isOpen, onClose, imageUrl }) => {
  const { colorMode } = useColorMode();
  const [isZoomed, setIsZoomed] = useState(false);

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'generated-image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Image downloaded successfully",
        status: "success",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Failed to download image",
        status: "error",
        duration: 2000,
      });
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="full" 
      isCentered
    >
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent
        bg={colorMode === 'dark' ? 'gray.800' : 'white'}
        m={4}
        rounded="xl"
      >
        <ModalHeader 
          borderBottomWidth="1px"
          borderColor={colorMode === 'dark' ? 'gray.600' : 'gray.200'}
          py={3}
        >
          <HStack justify="space-between">
            <HStack>
              <Icon 
                as={FiImage} 
                color={colorMode === 'dark' ? 'purple.300' : 'purple.500'} 
              />
              <Text>Generated Image</Text>
            </HStack>
            <HStack spacing={2}>
              <IconButton
                icon={<FiMaximize2 />}
                aria-label="Toggle zoom"
                onClick={() => setIsZoomed(!isZoomed)}
                colorScheme="blue"
                size="sm"
                variant="ghost"
                _hover={{
                  bg: colorMode === 'dark' ? 'blue.700' : 'blue.100'
                }}
              />
              <IconButton
                icon={<FiDownload />}
                aria-label="Download image"
                onClick={handleDownload}
                colorScheme="green"
                size="sm"
                variant="ghost"
                _hover={{
                  bg: colorMode === 'dark' ? 'green.700' : 'green.100'
                }}
              />
              <IconButton
                icon={<FiTrash2 />}
                aria-label="Delete image"
                onClick={onClose}
                colorScheme="red"
                size="sm"
                variant="ghost"
                _hover={{
                  bg: colorMode === 'dark' ? 'red.700' : 'red.100'
                }}
              />
            </HStack>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody p={0}>
          <Box
            position="relative"
            width="full"
            height="calc(100vh - 140px)"
            overflow="auto"
            bg={colorMode === 'dark' ? 'gray.900' : 'gray.50'}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <MotionBox
              initial={false}
              animate={{
                scale: isZoomed ? 1.5 : 1
              }}
              transition={{ duration: 0.3 }}
              cursor={isZoomed ? 'zoom-out' : 'zoom-in'}
              onClick={() => setIsZoomed(!isZoomed)}
              maxW="90%"
              maxH="90%"
              position="relative"
            >
              <Image
                src={imageUrl}
                alt="Generated image"
                objectFit="contain"
                maxW="100%"
                maxH="calc(100vh - 160px)"
                rounded="md"
                shadow="xl"
                draggable={false}
                loading="eager"
              />
            </MotionBox>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const ScheduleModal = ({ isOpen, onClose, onDateSelect }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Schedule Post</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <PostCalendar
            scheduledPosts={[]}
            onDateSelect={onDateSelect}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ContentForm; 