import { Box, SimpleGrid } from '@chakra-ui/react';
import StatsCard from './StatsCard';

const AnalyticsDashboard = () => {
  return (
    <Box>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
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
      </SimpleGrid>
    </Box>
  );
};

export default AnalyticsDashboard; 