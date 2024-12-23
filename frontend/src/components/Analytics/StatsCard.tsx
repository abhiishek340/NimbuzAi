import { Box, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, Flex, useColorMode } from '@chakra-ui/react';

interface StatsCardProps {
  title: string;
  stat: number;
  change: number;
  icon: string;
}

const StatsCard = ({ title, stat, change, icon }: StatsCardProps) => {
  const { colorMode } = useColorMode();

  return (
    <Box 
      p={6} 
      bg={colorMode === 'dark' ? 'gray.800' : 'white'} 
      rounded="xl" 
      shadow="sm"
      mb={4}
      border="1px"
      borderColor={colorMode === 'dark' ? 'gray.700' : 'gray.100'}
      transition="all 0.2s"
      _hover={{
        transform: 'translateY(-2px)',
        shadow: 'md',
      }}
    >
      <Flex align="center" justify="space-between">
        <Stat>
          <StatLabel fontSize="md" color={colorMode === 'dark' ? 'gray.400' : 'gray.500'}>
            {title}
          </StatLabel>
          <StatNumber fontSize="3xl" fontWeight="bold">
            {stat}
          </StatNumber>
          <StatHelpText>
            <StatArrow type={change > 0 ? 'increase' : 'decrease'} />
            {Math.abs(change)}%
          </StatHelpText>
        </Stat>
        <Box fontSize="2xl">{icon}</Box>
      </Flex>
    </Box>
  );
};

export default StatsCard; 