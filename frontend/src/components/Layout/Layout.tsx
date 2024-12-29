import { Box, Container, HStack, VStack, Text, Image, useColorMode, Grid, GridItem, IconButton } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSun, FiMoon } from 'react-icons/fi';

const MotionBox = motion(Box);
const MotionText = motion(Text);
const MotionImage = motion(Image);

const fadeInUp = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.5 }
};

const Layout = ({ children }) => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box 
      minH="100vh" 
      bg={colorMode === 'dark' ? 'gray.900' : 'gray.50'}
      overflow="hidden"
      position="relative"
    >
      {/* Add Theme Toggle Button */}
      <IconButton
        aria-label="Toggle theme"
        icon={colorMode === 'dark' ? <FiSun /> : <FiMoon />}
        onClick={toggleColorMode}
        position="fixed"
        bottom={4}
        right={4}
        colorScheme={colorMode === 'dark' ? 'orange' : 'purple'}
        size="lg"
        shadow="lg"
        zIndex={100}
        borderRadius="full"
        _hover={{
          transform: 'scale(1.1)',
        }}
        transition="all 0.2s"
      />

      {/* Background Gradient Animation */}
      <MotionBox
        position="absolute"
        top="-50%"
        left="-25%"
        w="150%"
        h="150%"
        bgGradient="radial(circle, rgba(66,153,225,0.1) 0%, rgba(157,110,225,0.1) 50%, rgba(237,100,166,0.1) 100%)"
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 50,
          repeat: Infinity,
          ease: "linear"
        }}
        opacity={0.6}
        zIndex={0}
      />

      {/* Header */}
      <Box 
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex={100}
        bg={colorMode === 'dark' ? 'rgba(26, 32, 44, 0.9)' : 'rgba(255, 255, 255, 0.9)'}
        backdropFilter="blur(10px)"
        borderBottom="1px"
        borderColor={colorMode === 'dark' ? 'gray.700' : 'gray.200'}
        py={3}
      >
        <Container maxW="container.xl">
          <HStack spacing={4} justify="center">
            <MotionImage
              src="/logo.svg"
              alt="NimbuzAI Logo"
              h="40px"
              w="40px"
              animate={{ 
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              whileHover={{ scale: 1.2 }}
            />
            <MotionText 
              fontSize="3xl" 
              fontWeight="bold"
              bgGradient="linear(to-r, blue.400, purple.500, pink.500)"
              bgClip="text"
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{ 
                backgroundSize: "300% 300%"
              }}
              whileHover={{ scale: 1.05 }}
            >
              NimbuzAI
            </MotionText>
          </HStack>
        </Container>
      </Box>

      {/* Main Content */}
      <Container 
        maxW="container.xl" 
        pt="80px"
        pb={8}
        px={{ base: 4, md: 6, lg: 8 }}
        position="relative"
        zIndex={1}
      >
        <Grid
          templateColumns={{ base: "1fr", lg: "350px 1fr" }}
          gap={6}
          h="calc(100vh - 100px)"
        >
          {/* Left Side - Tagline and Info */}
          <GridItem>
            <MotionBox
              initial="initial"
              animate="animate"
              variants={fadeInUp}
              h="full"
              display="flex"
              flexDirection="column"
              justifyContent="center"
            >
              <VStack spacing={6} align="flex-start">
                <MotionText
                  fontSize="4xl"
                  bgGradient="linear(to-r, blue.400, purple.400)"
                  bgClip="text"
                  fontWeight="bold"
                  lineHeight="1.2"
                  animate={{ 
                    scale: [1, 1.02, 1],
                    opacity: [0.8, 1, 0.8]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  Transform Your Social Media Game
                </MotionText>
                <MotionText
                  fontSize="lg"
                  color={colorMode === 'dark' ? 'gray.300' : 'gray.600'}
                  animate={{ 
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: 0.5
                  }}
                >
                  Engage Smarter • Post Faster • Grow Bigger
                </MotionText>
                
                {/* Feature Points */}
                <VStack spacing={4} align="flex-start" mt={4}>
                  {[
                    "🎯 AI-Powered Content Generation",
                    "🔄 Multi-Platform Optimization",
                    "📊 Analytics & Insights",
                    "⚡ Quick Transformations"
                  ].map((feature, index) => (
                    <MotionBox
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 * index }}
                    >
                      <Text fontSize="md" fontWeight="medium">
                        {feature}
                      </Text>
                    </MotionBox>
                  ))}
                </VStack>
              </VStack>
            </MotionBox>
          </GridItem>

          {/* Right Side - Main Content */}
          <GridItem>
            <MotionBox
              initial="initial"
              animate="animate"
              variants={fadeInUp}
              h="full"
            >
              <MotionBox
                p={1}
                bgGradient="linear(to-r, blue.400, purple.500, pink.500)"
                borderRadius="2xl"
                h="full"
                whileHover={{ scale: 1.005 }}
                transition={{ duration: 0.3 }}
              >
                <Box
                  bg={colorMode === 'dark' ? 'gray.800' : 'white'}
                  borderRadius="2xl"
                  p={6}
                  h="full"
                  boxShadow="xl"
                  overflow="auto"
                >
                  {children}
                </Box>
              </MotionBox>
            </MotionBox>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};

export default Layout; 