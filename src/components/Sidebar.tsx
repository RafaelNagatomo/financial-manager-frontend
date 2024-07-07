import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Flex, VStack, Text, Image, Icon } from '@chakra-ui/react';
import { RiDashboardHorizontalLine } from "react-icons/ri"
import { BiTransferAlt } from "react-icons/bi"
import { PiCrown } from "react-icons/pi"
import { IoSettingsOutline } from "react-icons/io5"

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
                fontSize="lg"
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
    </Box>
  );
};

export default Sidebar;
