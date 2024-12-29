import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  useColorMode,
  Grid,
  Select,
  Flex
} from '@chakra-ui/react';
import { useState } from 'react';
import PlatformPerformance from './PlatformPerformance';
import StatsCard from './StatsCard';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const Dashboard = () => {
  const { colorMode } = useColorMode();
  const [timeRange, setTimeRange] = useState('7d');

  // Sample data - replace with real data
  const analyticsData = {
    overview: {
      totalPosts: 156,
      totalEngagement: 23890,
      averageReach: 15678,
      growthRate: 12.5
    },
    platforms: {
      twitter: {
        growth: 15.2,
        metrics: {
          Followers: 12500,
          Engagement: 3200,
          Impressions: 45000,
          Clicks: 890
        }
      },
      linkedin: {
        growth: 8.7,
        metrics: {
          Connections: 8900,
          Engagement: 2100,
          Impressions: 32000,
          Clicks: 670
        }
      },
      instagram: {
        growth: -2.3,
        metrics: {
          Followers: 25600,
          Likes: 12300,
          Comments: 890,
          Saves: 456
        }
      }
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Overview Stats */}
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }}
          gap={6}
        >
          <StatsCard
            title="Total Posts"
            value={analyticsData.overview.totalPosts || 0}
            icon="posts"
          />
          <StatsCard
            title="Total Engagement"
            value={analyticsData.overview.totalEngagement || 0}
            icon="engagement"
          />
          <StatsCard
            title="Average Reach"
            value={analyticsData.overview.averageReach || 0}
            icon="reach"
          />
          <StatsCard
            title="Growth Rate"
            value={`${analyticsData.overview.growthRate || 0}%`}
            icon="growth"
          />
        </Grid>

        {/* Platform Performance */}
        <PlatformPerformance
          data={analyticsData}
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
        />
      </VStack>
    </Container>
  );
};

export default Dashboard; 