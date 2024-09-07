import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion'
import {
  Box,
  Flex,
  VStack,
  Text,
  Image,
  Icon,
  Button,
  LightMode,
  useColorMode,
} from '@chakra-ui/react';

import { FaMoneyBillTransfer } from "react-icons/fa6"
import { RiDashboardHorizontalLine } from "react-icons/ri"
import { PiCrown } from "react-icons/pi"
import { IoSettingsOutline } from "react-icons/io5"
import { BiLogOut } from "react-icons/bi"
import { useAuth } from '../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const { colorMode } = useColorMode()
  const handleMenuItemClick = (label: string) => setActiveItem(label);

  const menuItems = [
    {
      route: "/dashboard",
      label: t('dashboard'),
      icon: RiDashboardHorizontalLine
    },
    {
      route: "/transactions",
      label: t('transactions'),
      icon: FaMoneyBillTransfer
    },
    {
      route: "/goals",
      label: t('goals'),
      icon: PiCrown
    },
    {
      route: "/settings",
      label: t('settings'),
      icon: IoSettingsOutline
    },
  ];


  return (
    <Box
      layerStyle={colorMode}
      w="220px"
      h="100vh"
      p={4}
      fontWeight='bold'
      position="fixed"
      zIndex="999"
    >
      <Logo />
      <Menu
        menuItems={menuItems}
        activeItem={activeItem}
        onMenuItemClick={handleMenuItemClick}
      />
      <LogoutButton />
    </Box>
  );
};

const Logo: React.FC = () => {
  const { colorMode } = useColorMode()
  const navigate = useNavigate()
  return (
    <Image
      mt={4}
      mb={12}
      alt='FiManager-logo'
      src={
        colorMode === 'dark'
        ? '/logos/logo-white.png'
        : '/logos/logo-black.png'
      }
      cursor='pointer'
      onClick={() => navigate('/dashboard')}
    />
  )
};

const Menu: React.FC<{
  menuItems: { route: string; label: string; icon: any }[];
  activeItem: string | null;
  onMenuItemClick: (label: string) => void;
}> = ({
  menuItems,
  activeItem,
  onMenuItemClick
}) => {
  return (
    <VStack spacing={4} align="stretch" >
      {menuItems.map((item, index) => (
        <Link
          to={item.route}
          key={index}
          onClick={() => onMenuItemClick(item.label)}
        >
          <MenuItem
            item={item}
            isActive={activeItem === item.label}
          />
        </Link>
      ))}
    </VStack>
  )
};

const MenuItem: React.FC<{
  item: { route: string; label: string; icon: any };
  isActive: boolean
}> = ({ item }) => {
  const location = useLocation()
  const isActive = location.pathname === item.route
  const [isHovered, setIsHovered] = useState(false)
  const MotionBox = motion(Box)

  return (
    <Flex
      position="relative"
      align="center"
      p={1}
      borderRadius="md"
      _hover={{ color: "purple.500" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {item.icon &&
        <motion.div
          animate={isHovered ? {
            scale: [1, 1.1, 1.2, 1.1, 1],
            rotate: [0, -20, 20, -20, 0]
          } : {
            scale: 1,
            rotate: 0,
            transition: {duration: [0.1]}
          }}
          transition={{
            duration: 0.6,
            ease: "easeInOut",
            times: [0, 0.1, 0.25, 0.4, 0.55]
          }}
        >
          <Icon
            as={item.icon}
            boxSize={6}
            color={isActive ? 'purple.500' : ''}
          />
        </motion.div>
      }
      <Text
        ml={4}
        fontSize="md"
        color={isActive ? 'purple.500' : ''}
      >
        {item.label}
      </Text>
      {isActive &&
        <MotionBox
          layoutId="underline"
          position="absolute"
          right={-4}
          w={1}
          h={10}
          bg="purple.400"
          borderBottomLeftRadius={10}
          borderTopLeftRadius={10}
          transition={{ duration: 0.18, ease: 'easeInOut' }}
        />
      }
    </Flex>
  );
}

const LogoutButton: React.FC = () => {
  const { logout } = useAuth();

  return (
    <Flex mt={500} width='100%'>
      <Link to="/auth" style={{ width: 200 }}>
        <LightMode>
          <Button
            justifyContent="start"
            width='100%'
            variant="outline"
            _hover={{ bg: 'purple.500', color: 'white', border: 'none' }}
            leftIcon={<BiLogOut size={18} style={{ marginRight: 30 }} />}
            onClick={logout}
          >
            Log out
          </Button>
        </LightMode>
      </Link>
    </Flex>
  )
}

export default Sidebar;