import React, { useState } from 'react';
import { Box, Textarea, Button, VStack } from '@chakra-ui/react';
import { useAITransform } from '../../hooks/useAITransform';

const ContentEditor: React.FC = () => {
  const [content, setContent] = useState('');
  const { transform, loading } = useAITransform();

  const handleTransform = async () => {
    const transformed = await transform(content);
    // Handle transformed content
  };

  return (
    <VStack spacing={4}>
      <Textarea 
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter your content here..."
        minH="200px"
      />
      <Button 
        colorScheme="blue" 
        isLoading={loading}
        onClick={handleTransform}
      >
        Transform Content
      </Button>
    </VStack>
  );
};

export default ContentEditor; 