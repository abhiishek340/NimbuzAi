import {
  Box,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  useColorMode,
  Icon,
  HStack
} from '@chakra-ui/react';
import { FiBarChart2, FiUsers, FiTrendingUp, FiFileText } from 'react-icons/fi';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

interface StatsCardProps {
  title: string;
  value: number | string;
  icon?: string;
  change?: number;
}

const StatsCard = ({ title, value, icon, change }: StatsCardProps) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'posts':
        return FiFileText;
      case 'engagement':
        return FiBarChart2;
      case 'reach':
        return FiUsers;
      case 'growth':
        return FiTrendingUp;
      default:
        return FiBarChart2;
    }
  };

  const formatValue = (val: number | string) => {
    if (typeof val === 'number') {
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        p={6}
        bg={isDark ? 'gray.800' : 'white'}
        rounded="xl"
        shadow="lg"
        borderWidth="1px"
        borderColor={isDark ? 'gray.700' : 'gray.200'}
        transition="all 0.2s"
        _hover={{ transform: 'translateY(-2px)', shadow: 'xl' }}
      >
        <Stat>
          <HStack spacing={2} mb={2}>
            {icon && (
              <Icon
                as={getIcon(icon)}
                w={5}
                h={5}
                color={isDark ? 'blue.300' : 'blue.500'}
              />
            )}
            <StatLabel fontSize="sm" color={isDark ? 'gray.400' : 'gray.600'}>
              {title}
            </StatLabel>
          </HStack>
          <StatNumber fontSize="3xl" fontWeight="bold">
            {formatValue(value)}
          </StatNumber>
          {typeof change === 'number' && (
            <StatHelpText>
              <StatArrow 
                type={change >= 0 ? 'increase' : 'decrease'} 
                color={change >= 0 ? 'green.400' : 'red.400'}
              />
              {Math.abs(change)}%
            </StatHelpText>
          )}
        </Stat>
      </Box>
    </MotionBox>
  );
};

export default StatsCard; 