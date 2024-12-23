import { Box, Grid, GridItem, VStack, Heading, Text, Container } from '@chakra-ui/react';
import ContentForm from '../ContentEditor/ContentForm';
import StatsCard from '../Analytics/StatsCard';
import { useColorMode } from '@chakra-ui/react';

const Dashboard = () => {
  const { colorMode } = useColorMode();

  return (
    <Box 
      minH="100vh" 
      bg={colorMode === 'dark' ? 'gray.900' : 'gray.50'}
      pt="80px"
    >
      <Container maxW="1400px" py={8}>
        <VStack spacing={8} align="stretch">
          <Box textAlign="center" mb={8}>
            <Heading 
              size="2xl" 
              bgGradient="linear(to-r, blue.400, purple.500)" 
              bgClip="text"
              mb={4}
            >
              Transform Your Social Presence
            </Heading>
            <Text fontSize="xl" color={colorMode === 'dark' ? 'gray.400' : 'gray.600'}>
              Create engaging content for multiple platforms in seconds
            </Text>
          </Box>

          <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
            <GridItem>
              <ContentForm />
            </GridItem>
            
            <GridItem>
              <VStack spacing={6}>
                <Box w="full">
                  <Heading size="md" mb={4}>Performance Analytics</Heading>
                  <StatsCard 
                    title="Total Posts" 
                    stat={150} 
                    change={12.5}
                    icon="📝"
                  />
                  <StatsCard 
                    title="Engagement Rate" 
                    stat={4.8} 
                    change={2.1}
                    icon="💫"
                  />
                  <StatsCard 
                    title="Followers Growth" 
                    stat={1250} 
                    change={8.3}
                    icon="📈"
                  />
                </Box>
              </VStack>
            </GridItem>
          </Grid>
        </VStack>
      </Container>
    </Box>
  );
};

export default Dashboard; 