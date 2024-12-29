import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  VStack,
  Card,
  CardHeader,
  CardBody,
  Text,
  Button,
  useColorMode,
  HStack,
  Icon,
  Box,
  Badge
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiActivity, FiEdit2 } from 'react-icons/fi';

const MotionCard = motion(Card);

interface BrainstormModalProps {
  isOpen: boolean;
  onClose: () => void;
  ideas: Array<{ title: string; content: string }>;
  onSelectIdea: (idea: { title: string; content: string }) => void;
}

const BrainstormModal = ({ isOpen, onClose, ideas, onSelectIdea }: BrainstormModalProps) => {
  const { colorMode } = useColorMode();

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="4xl" 
      isCentered
      scrollBehavior="inside"
    >
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent
        bg={colorMode === 'dark' ? 'gray.800' : 'white'}
        maxH="85vh"
      >
        <ModalHeader 
          borderBottomWidth="1px"
          borderColor={colorMode === 'dark' ? 'gray.600' : 'gray.200'}
          bg={colorMode === 'dark' ? 'gray.700' : 'gray.50'}
          roundedTop="md"
        >
          <HStack>
            <Icon 
              as={FiActivity} 
              color={colorMode === 'dark' ? 'pink.300' : 'pink.500'} 
            />
            <Text>Content Ideas</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody py={6}>
          <VStack spacing={6} align="stretch">
            {ideas.map((idea, index) => (
              <MotionCard
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                bg={colorMode === 'dark' ? 'gray.700' : 'white'}
                borderWidth="1px"
                borderColor={colorMode === 'dark' ? 'gray.600' : 'gray.200'}
                shadow="lg"
                _hover={{ 
                  shadow: '2xl',
                  transform: 'translateY(-2px)',
                  borderColor: colorMode === 'dark' ? 'pink.400' : 'pink.200'
                }}
                transition="all 0.2s"
              >
                <CardHeader
                  bg={colorMode === 'dark' ? 'gray.600' : 'gray.50'}
                  borderBottomWidth="1px"
                  borderColor={colorMode === 'dark' ? 'gray.500' : 'gray.200'}
                  py={3}
                  px={6}
                >
                  <HStack justify="space-between" align="center">
                    <Text 
                      fontSize="lg"
                      fontWeight="bold"
                      color={colorMode === 'dark' ? 'white' : 'gray.700'}
                    >
                      {idea.title}
                    </Text>
                    <Badge
                      colorScheme="pink"
                      variant="subtle"
                      fontSize="sm"
                    >
                      Idea {index + 1}
                    </Badge>
                  </HStack>
                </CardHeader>
                <CardBody p={6}>
                  <Box mb={4}>
                    <Text 
                      color={colorMode === 'dark' ? 'gray.200' : 'gray.700'}
                      whiteSpace="pre-wrap"
                      fontSize="md"
                      lineHeight="tall"
                    >
                      {idea.content}
                    </Text>
                  </Box>
                  <Button
                    size="md"
                    colorScheme="pink"
                    onClick={() => onSelectIdea(idea)}
                    leftIcon={<FiEdit2 />}
                    w="full"
                    variant="solid"
                    _hover={{
                      transform: 'translateY(-1px)',
                      shadow: 'lg'
                    }}
                  >
                    Use This Idea
                  </Button>
                </CardBody>
              </MotionCard>
            ))}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default BrainstormModal; 