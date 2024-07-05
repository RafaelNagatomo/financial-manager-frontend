import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'
import { Box, Flex, VStack, Text, useColorModeValue } from '@chakra-ui/react';

const Sidebar: React.FC = () => {
  const bg = useColorModeValue('gray.100', 'gray.900');
  const hoverBg = useColorModeValue('gray.200', 'gray.700');
  const {t} = useTranslation()

  return (
    <Box bg={bg} w="250px" p={4} borderRightWidth={1} borderRightColor="gray.200" h="100vh">
      <VStack spacing={4} align="stretch">
        <Link to="/dashboard">
          <Flex
            align="center"
            p={2}
            borderRadius="md"
            _hover={{ bg: hoverBg }}
          >
            <Text fontSize="lg">{t('yes')}</Text>
          </Flex>
        </Link>
        <Link to="/transactions">
          <Flex
            align="center"
            p={2}
            borderRadius="md"
            _hover={{ bg: hoverBg }}
          >
            <Text fontSize="lg">Transactions</Text>
          </Flex>
        </Link>
        <Link to="/goals">
          <Flex
            align="center"
            p={2}
            borderRadius="md"
            _hover={{ bg: hoverBg }}
          >
            <Text fontSize="lg">Goals</Text>
          </Flex>
        </Link>
        <Link to="/settings">
          <Flex
            align="center"
            p={2}
            borderRadius="md"
            _hover={{ bg: hoverBg }}
          >
            <Text fontSize="lg">Settings</Text>
          </Flex>
        </Link>
      </VStack>
    </Box>
  );
};

export default Sidebar;
