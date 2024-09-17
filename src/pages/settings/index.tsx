import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaUserEdit } from "react-icons/fa";
import { IoMdOptions, IoIosArrowForward } from "react-icons/io";
import { RiLockPasswordFill } from "react-icons/ri";
import {
  Card,
  CardHeader,
  CardBody,
  Flex,
  Spacer,
  Heading,
  Box,
  Avatar,
  Text,
  Grid,
  Icon,
  GridItem,
  VStack,
  Stack,
  useColorMode,
  Tabs,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react';
import Preferences from './Preferences';
import PersonalInfo from './PersonalInfo';
import ChangePassword from './ChangePassword';
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext';

const animationVariants = {
  initial: { opacity: 0, scale: 0.5 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.5 },
  transition: { type: 'easy', duration: 0.2 }
}

const MenuItem: React.FC<{
  item: { key: string; label: string; icon: any };
  isActive: boolean
}> = ({ item, isActive }) => {
  const [isHovered, setIsHovered] = useState(false)
  const isMobileOrTablet = window.innerWidth <= 992

  return (
    <Flex
      position="relative"
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
          {!isMobileOrTablet && (
            <Icon
              as={item.icon}
              boxSize={6}
              color={isActive ? 'purple.500' : ''}
            />
          )}
        </motion.div>
      }
      <Text
        ml={4}
        fontSize="md"
        color={isActive ? 'purple.500' : ''}
        position="relative"
        paddingBottom="5px"
      >
        {item.label}
        {isMobileOrTablet && isActive && (
          <Box
            position="absolute"
            left="0"
            bottom="0"
            height="2px"
            width="100%"
            backgroundColor="purple.500"
          />
        )}
      </Text>
      <Spacer />
      {!isMobileOrTablet && (
        <Box color={isActive ? 'purple.500' : ''}>
          <IoIosArrowForward size={20}/>
        </Box>
      )}
    </Flex>
  );
}

const Settings: React.FC = () =>  {
  const { t } = useTranslation()
  const { colorMode } = useColorMode()
  const { user } = useAuth();
  const [activeItem, setActiveItem] = useState<string | null>('preferences');
  const MotionBox = motion(Box)

  const handleMenuItemClick = (key: string) => {
    setActiveItem(key)
  };
  const getTabIndexByKey = (key: string | null) =>
    menuItems.findIndex(item => item.key === key);

  const menuItems = [
    {
      key: "preferences",
      label: t('preferences'),
      icon: IoMdOptions
    },
    {
      key: "personalInfo",
      label: t('personalInfo'),
      icon: FaUserEdit
    },
    {
      key: "changePassword",
      label: t('changePassword'),
      icon: RiLockPasswordFill
    },
  ];

  return (
    <Box>
      <Heading as="h1" size="lg" mb={5}>
        {t('settings')}
      </Heading>
      <Flex
        gap={4}
        direction={{ base: 'column', md: 'column', lg: 'row' }}
      >
        <Card
          layerStyle={colorMode}
          width="33.33%"
          maxHeight="500px"
          display="flex"
          flexDirection="column"
          w={{ xs: '355px', sm: '400px', md: '100%', lg: '400px' }}
        >
          <CardHeader>
            <Heading
              as="h2"
              size="md"
              w={300}
            >
              {t('account')}
            </Heading>
          </CardHeader>

          <CardBody p={{ xs: 0, xl: 10 }}>
            <VStack gap={4} align={{ base: 'center', md: 'center', lg: 'stretch'}}>
              <Grid
                h='100px'
                templateRows='repeat(2, 1fr)'
                templateColumns='repeat(3, 1fr)'
                gap={2}
                mb={{ base: 5, md: 10, lg: 20 }}
                alignItems={{ base: 'center' }}
              >
                <GridItem rowSpan={2} colSpan={1}>
                  <Avatar
                    size={{ base: 'lg', lg: 'xl' }}
                    bg='purple.500'
                    src='https://bit.ly/broken-link'
                  />
                </GridItem>
                <GridItem colSpan={2}>
                  <Text
                    fontWeight='bold'
                    fontSize={18}
                    pt={5}
                  >
                    {user?.first_name} {user?.last_name}
                  </Text>
                </GridItem>
                <GridItem colSpan={2}>
                  <Text
                    fontStyle='italic'
                    fontSize={14}
                  >
                    {user?.email}
                  </Text>
                </GridItem>
              </Grid>
            </VStack>

            <Stack
              spacing={4}
              align="stretch"
              direction={{ base: 'row', md: 'row', lg: 'column' }}
            >
              {menuItems.map((item, index) => (
                <Box
                  key={index}
                  cursor='pointer'
                  onClick={() => handleMenuItemClick(item.key)}
                >
                  <MenuItem
                    item={item}
                    isActive={activeItem === item.key}
                  />
                </Box>
              ))}
            </Stack>

          </CardBody>
        </Card>

        <Card
          layerStyle={colorMode}
          width="66.66%"
          display="flex"
          flexDirection="column"
          height={500}
          w={{ xs: '355px', sm: '400px', md: '100%', lg: '650px' }}
        >
          <CardHeader>
            <Flex>
              <Heading as="h2" size="md">
                {t(`${activeItem}`)}
              </Heading>
            </Flex>
          </CardHeader>
          <Tabs
            index={getTabIndexByKey(activeItem)}
            onChange={(index) => setActiveItem(menuItems[index].key)}
            isLazy
          >
            <CardBody p={{ xs: 0, xl: 10 }}>
              <TabPanels>
                <TabPanel>
                  <MotionBox
                    key="preferences"
                    variants={animationVariants}
                    initial='initial'
                    animate='animate'
                    exit='exit'
                    transition='transition'
                  >
                    <Preferences />
                  </MotionBox>
                </TabPanel>
                <TabPanel>
                  <MotionBox
                    key="personalInfo"
                    variants={animationVariants}
                    initial='initial'
                    animate='animate'
                    exit='exit'
                    transition='transition'
                  >
                    <PersonalInfo />
                  </MotionBox>
                </TabPanel>
                <TabPanel>
                  <MotionBox
                    key="changePassword"
                    variants={animationVariants}
                    initial='initial'
                    animate='animate'
                    exit='exit'
                    transition='transition'
                  >
                    <ChangePassword />
                  </MotionBox>
                </TabPanel>
              </TabPanels>
            </CardBody>
          </Tabs>
        </Card>
        
      </Flex>
    </Box>
  )
}

export default Settings
