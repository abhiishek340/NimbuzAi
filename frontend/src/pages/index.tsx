import { Box, Container, HStack, Button, Text, useColorMode } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import ContentForm from '../components/ContentEditor/ContentForm';
import Dashboard from '../components/Analytics/Dashboard';
import Layout from '../components/Layout/Layout';

const MotionBox = motion(Box);

export default function Home() {
  const [activeTab, setActiveTab] = useState<'content' | 'analytics'>('content');
  const { colorMode } = useColorMode();

  return (
    <Layout>
      <Box>
        {/* Page Header */}
        <Box mb={8}>
          <Text fontSize="2xl" fontWeight="bold" mb={2}>
            Content Creator
          </Text>
          <Text color={colorMode === 'dark' ? 'gray.400' : 'gray.600'}>
            Create and manage your social media content
          </Text>
          <Text 
            color={colorMode === 'dark' ? 'gray.500' : 'gray.500'} 
            fontStyle="italic"
            mt={2}
            fontSize="sm"
          >
            "Create once, share everywhere. Transform your ideas into engaging social content."
          </Text>
        </Box>

        {/* Tab Navigation */}
        <Box 
          borderBottom="1px" 
          borderColor={colorMode === 'dark' ? 'gray.700' : 'gray.200'}
          mb={6}
        >
          <HStack spacing={8}>
            <Button
              variant="ghost"
              px={1}
              fontWeight="medium"
              color={activeTab === 'content' ? 'blue.500' : colorMode === 'dark' ? 'gray.400' : 'gray.600'}
              borderBottom="2px"
              borderColor={activeTab === 'content' ? 'blue.500' : 'transparent'}
              onClick={() => setActiveTab('content')}
              rounded="none"
              _hover={{
                color: activeTab === 'content' ? 'blue.500' : colorMode === 'dark' ? 'gray.200' : 'gray.800',
              }}
            >
              Content Creator
            </Button>
            <Button
              variant="ghost"
              px={1}
              fontWeight="medium"
              color={activeTab === 'analytics' ? 'blue.500' : colorMode === 'dark' ? 'gray.400' : 'gray.600'}
              borderBottom="2px"
              borderColor={activeTab === 'analytics' ? 'blue.500' : 'transparent'}
              onClick={() => setActiveTab('analytics')}
              rounded="none"
              _hover={{
                color: activeTab === 'analytics' ? 'blue.500' : colorMode === 'dark' ? 'gray.200' : 'gray.800',
              }}
            >
              Analytics
            </Button>
          </HStack>
        </Box>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {activeTab === 'content' ? (
            <MotionBox
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ContentForm />
            </MotionBox>
          ) : (
            <MotionBox
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Dashboard />
            </MotionBox>
          )}
        </AnimatePresence>
      </Box>
    </Layout>
  );
} 