import { Box, VStack, Text, useColorMode } from '@chakra-ui/react';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styled from '@emotion/styled';

const StyledCalendar = styled(Calendar)`
  width: 100%;
  border: none;
  border-radius: 8px;
  padding: 16px;
  
  .react-calendar__tile {
    padding: 16px;
    border-radius: 8px;
    
    &:enabled:hover,
    &:enabled:focus {
      background-color: ${props => props.theme.colors.blue[100]};
    }
    
    &--active {
      background-color: ${props => props.theme.colors.blue[500]} !important;
      color: white;
    }
  }
`;

interface PostCalendarProps {
  scheduledPosts: Array<{
    date: Date;
    content: string;
  }>;
  onDateSelect: (date: Date) => void;
}

const PostCalendar = ({ scheduledPosts, onDateSelect }: PostCalendarProps) => {
  const { colorMode } = useColorMode();

  return (
    <VStack spacing={4} align="stretch">
      <Box
        bg={colorMode === 'dark' ? 'gray.700' : 'white'}
        borderRadius="xl"
        p={4}
      >
        <StyledCalendar
          onChange={onDateSelect}
          minDate={new Date()}
          tileContent={({ date }) => {
            const post = scheduledPosts.find(
              p => p.date.toDateString() === date.toDateString()
            );
            return post ? (
              <Text fontSize="xs" color="blue.500">
                •
              </Text>
            ) : null;
          }}
        />
      </Box>
    </VStack>
  );
};

export default PostCalendar; 