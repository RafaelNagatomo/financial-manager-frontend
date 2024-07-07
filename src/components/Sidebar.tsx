import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Flex, VStack, Text, Image, Icon, Button } from '@chakra-ui/react';
import { RiDashboardHorizontalLine } from "react-icons/ri"
import { BiTransferAlt } from "react-icons/bi"
import { PiCrown } from "react-icons/pi"
import { IoSettingsOutline } from "react-icons/io5"
import { BiLogOut } from "react-icons/bi"

const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const menuItems = [
    {
      route: "/dashboard",
      label: t('dashboard'),
      icon: RiDashboardHorizontalLine,
    },
    {
      route: "/transactions",
      label: t('transactions'),
      icon: BiTransferAlt,
    },
    {
      route: "/goals",
      label: t('goals'),
      icon: PiCrown,
    },
    {
      route: "/settings",
      label: t('settings'),
      icon: IoSettingsOutline,
    },
  ];

  const handleClick = (label: string) => {
    setActiveItem(label);
  };

  return (
    <Box bg="gray.100" w="200px" h="100vh" p={4}>
      <Image mt={4} mb={12} src='/logos/logo.png' alt='FiManager-logo' />
      <VStack spacing={4} align="stretch">
        {menuItems.map((item, index) => (
          <Link to={item.route} key={index} onClick={() => handleClick(item.label)}>
            <Flex
              position="relative"
              align="center"
              p={1}
              borderRadius="md"
              _hover={{ color: "purple.500" }}
            >
              {item.icon &&
                <Icon
                as={item.icon}
                boxSize={5}
                mr={3}
                color={activeItem === item.label ? 'purple.500' : ''}
              />}
              <Text
                fontSize="md"
                color={activeItem === item.label ? 'purple.500' : ''}
              >
                {item.label}
              </Text>
              {activeItem === item.label && (
                <Box
                  position="absolute"
                  right={-4}
                  w={1.5}
                  h={10}
                  bg="purple.400"
                  borderBottomLeftRadius={10}
                  borderTopLeftRadius={10}
                />
              )}
            </Flex>
          </Link>
        ))}
      </VStack>
      <Flex justifyContent="center" mt={500} width='100%' >
        <Link to="/login" style={{ width: 200 }}>
          <Button
            justifyContent="start"
            size="sm"
            width='100%'
            colorScheme="purple"
            variant="outline"
            _hover={{ bg: 'purple.500', color: 'white' }}
            leftIcon={<BiLogOut size={18} style={{ marginRight: 25 }} />}
          >
            Log out
          </Button>
        </Link>
      </Flex>
    </Box>
  );
};

export default Sidebar;
