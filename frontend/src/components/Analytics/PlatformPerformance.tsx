import {
  Box,
  Grid,
  Text,
  useColorMode,
  HStack,
  Icon,
  Flex,
  Select,
  Badge,
  Container,
  SimpleGrid,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { 
  FaTwitter, 
  FaLinkedin, 
  FaInstagram, 
  FaFacebook, 
  FaTiktok, 
  FaYoutube,
  FaPinterest,
  FaSnapchat 
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { FiActivity, FiUsers } from 'react-icons/fi';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const MotionBox = motion(Box);
const MotionButton = motion(Button);

const PlatformPerformance = ({ data, timeRange, onTimeRangeChange }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  // Add these for modal control
  const engagementModalDisclosure = useDisclosure();
  const reachModalDisclosure = useDisclosure();

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: isDark ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)',
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        titleColor: isDark ? '#fff' : '#000',
        bodyColor: isDark ? '#fff' : '#000',
        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: {
          color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: isDark ? '#fff' : '#000'
        }
      },
      y: {
        grid: {
          color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: isDark ? '#fff' : '#000'
        }
      }
    }
  };

  const platforms = {
    twitter: { icon: FaTwitter, color: '#1DA1F2' },
    linkedin: { icon: FaLinkedin, color: '#0A66C2' },
    instagram: { icon: FaInstagram, color: '#E4405F' },
    facebook: { icon: FaFacebook, color: '#1877F2' },
    tiktok: { icon: FaTiktok, color: '#000000' },
    youtube: { icon: FaYoutube, color: '#FF0000' },
    pinterest: { icon: FaPinterest, color: '#E60023' },
    snapchat: { icon: FaSnapchat, color: '#FFFC00' }
  };

  const engagementData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: Object.entries(platforms).map(([platform, { color }]) => ({
      label: platform.charAt(0).toUpperCase() + platform.slice(1),
      data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 100)),
      borderColor: color,
      backgroundColor: `${color}20`,
      fill: true,
      tension: 0.4
    }))
  };

  const reachData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Impressions',
        data: [1200, 1900, 3000, 5000, 2000, 3000, 4000],
        backgroundColor: isDark ? 'rgba(99, 179, 237, 0.6)' : 'rgba(66, 153, 225, 0.6)',
      },
      {
        label: 'Reach',
        data: [1000, 1500, 2200, 3500, 1500, 2300, 3000],
        backgroundColor: isDark ? 'rgba(237, 100, 166, 0.6)' : 'rgba(236, 64, 122, 0.6)',
      }
    ]
  };

  return (
    <Box w="full" px={6} py={4}>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <VStack spacing={8} w="full" align="stretch">
          {/* Header */}
          <Flex 
            justify="space-between" 
            alignItems="center" 
            w="full"
          >
            <Text fontSize="2xl" fontWeight="bold" color={isDark ? 'white' : 'gray.800'}>
              Platform Performance
            </Text>
            <Select
              value={timeRange}
              onChange={(e) => onTimeRangeChange(e.target.value)}
              w="200px"
              size="md"
              bg={isDark ? 'gray.800' : 'white'}
              borderColor={isDark ? 'gray.600' : 'gray.200'}
              _hover={{ borderColor: 'blue.400' }}
              color={isDark ? 'white' : 'gray.800'}
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </Select>
          </Flex>

          {/* Chart Buttons */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
            <MotionButton
              h="200px"
              bg={isDark ? 'gray.800' : 'white'}
              onClick={engagementModalDisclosure.onOpen}
              rounded="xl"
              shadow="lg"
              borderWidth="1px"
              borderColor={isDark ? 'gray.700' : 'gray.200'}
              _hover={{ transform: 'translateY(-2px)', shadow: 'xl' }}
              transition="all 0.2s"
              display="flex"
              flexDirection="column"
              gap={4}
            >
              <Icon as={FiActivity} boxSize={8} color="blue.400" />
              <Text fontSize="lg" fontWeight="medium">Engagement Over Time</Text>
              <Text fontSize="sm" color={isDark ? 'gray.400' : 'gray.600'}>
                Click to view detailed analytics
              </Text>
            </MotionButton>

            <MotionButton
              h="200px"
              bg={isDark ? 'gray.800' : 'white'}
              onClick={reachModalDisclosure.onOpen}
              rounded="xl"
              shadow="lg"
              borderWidth="1px"
              borderColor={isDark ? 'gray.700' : 'gray.200'}
              _hover={{ transform: 'translateY(-2px)', shadow: 'xl' }}
              transition="all 0.2s"
              display="flex"
              flexDirection="column"
              gap={4}
            >
              <Icon as={FiUsers} boxSize={8} color="purple.400" />
              <Text fontSize="lg" fontWeight="medium">Reach & Impressions</Text>
              <Text fontSize="sm" color={isDark ? 'gray.400' : 'gray.600'}>
                Click to view detailed analytics
              </Text>
            </MotionButton>
          </SimpleGrid>

          {/* Platform Stats Grid */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6} w="full">
            {Object.entries(platforms).map(([platform, { icon, color }]) => (
              <MotionBox
                key={platform}
                p={6}
                bg={isDark ? 'gray.800' : 'white'}
                rounded="xl"
                shadow="lg"
                borderWidth="1px"
                borderColor={isDark ? 'gray.700' : 'gray.200'}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <HStack mb={4} justify="space-between">
                  <HStack>
                    <Icon 
                      as={icon}
                      color={color}
                      boxSize={5}
                    />
                    <Text fontWeight="medium" textTransform="capitalize" color={isDark ? 'white' : 'gray.800'}>
                      {platform}
                    </Text>
                  </HStack>
                  <Badge
                    colorScheme={Math.random() > 0.5 ? 'green' : 'red'}
                    px={2}
                    py={1}
                    borderRadius="full"
                  >
                    {Math.random() > 0.5 ? '+' : '-'}{(Math.random() * 20).toFixed(1)}%
                  </Badge>
                </HStack>
                
                <SimpleGrid columns={2} gap={4}>
                  {['Followers', 'Engagement', 'Reach', 'Posts'].map((metric) => (
                    <Box key={metric}>
                      <Text color={isDark ? 'gray.400' : 'gray.600'} fontSize="sm" mb={1}>
                        {metric}
                      </Text>
                      <Text fontSize="xl" fontWeight="bold" color={isDark ? 'white' : 'gray.800'}>
                        {(Math.random() * 10000).toFixed(0)}
                      </Text>
                    </Box>
                  ))}
                </SimpleGrid>
              </MotionBox>
            ))}
          </SimpleGrid>

          {/* Engagement Modal */}
          <Modal 
            isOpen={engagementModalDisclosure.isOpen} 
            onClose={engagementModalDisclosure.onClose}
            size="6xl"
          >
            <ModalOverlay backdropFilter="blur(4px)" />
            <ModalContent
              bg={isDark ? 'gray.800' : 'white'}
              maxW="90vw"
              maxH="90vh"
            >
              <ModalHeader>Engagement Over Time</ModalHeader>
              <ModalCloseButton />
              <ModalBody p={6}>
                <Box h="70vh">
                  <Line 
                    options={{
                      ...chartOptions,
                      maintainAspectRatio: false,
                      responsive: true,
                    }} 
                    data={engagementData}
                  />
                </Box>
              </ModalBody>
            </ModalContent>
          </Modal>

          {/* Reach Modal */}
          <Modal 
            isOpen={reachModalDisclosure.isOpen} 
            onClose={reachModalDisclosure.onClose}
            size="6xl"
          >
            <ModalOverlay backdropFilter="blur(4px)" />
            <ModalContent
              bg={isDark ? 'gray.800' : 'white'}
              maxW="90vw"
              maxH="90vh"
            >
              <ModalHeader>Reach & Impressions</ModalHeader>
              <ModalCloseButton />
              <ModalBody p={6}>
                <Box h="70vh">
                  <Bar 
                    options={{
                      ...chartOptions,
                      maintainAspectRatio: false,
                      responsive: true,
                    }} 
                    data={reachData}
                  />
                </Box>
              </ModalBody>
            </ModalContent>
          </Modal>
        </VStack>
      </MotionBox>
    </Box>
  );
};

export default PlatformPerformance; 