import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  HStack,
  Text,
  Image,
  Center,
  VStack,
  useColorMode
} from '@chakra-ui/react';
import Login from './Login';
import Register from './Register';
import { AnimatePresence } from 'framer-motion';

const Auth: React.FC = () =>  {
  const { t } = useTranslation()
  const { colorMode } = useColorMode();
  const [isLogin, setIsLogin] = useState(true);

  const toggleView = () => setIsLogin(!isLogin);

  return (
    <HStack>
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        backgroundImage="url('/media/minimalist-mountain-usuygt27au6eh1jt.png')"
        backgroundSize="cover"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        opacity={0.2}
        zIndex={1}
      />
      <VStack
        w={800}
        h='100vh'
        p={8}
        spacing={8}
        zIndex={2}
        position="relative"
        bg='rgba(0, 0, 0, 0.178)'
        color="white"
        justifyContent='center'
        backdropFilter="blur(7px)"
      >
        <Image
          w={350}
          alt='FiManager-logo'
          src={
            colorMode === 'dark'
            ? '/logos/logo-white.png'
            : '/logos/logo-black.png'
          }
        />
        <Box textAlign='center'>
          <Text fontSize='2xl' my={20}>
            {t('letsGo')}!
          </Text>
          <Text fontSize='3xl' textAlign="center">
            {t('welcomeTo')}
          </Text>
          <Text fontSize='3xl' fontWeight='bold'>
            Financial Manager
          </Text>
        </Box>
      </VStack>

      <Center w='100%'>
        <AnimatePresence mode="wait">
          {isLogin ? (
            <Login key="login" onSwitch={toggleView} />
          ) : (
            <Register key="register" onSwitch={toggleView} />
          )}
        </AnimatePresence>
      </Center>
      
    </HStack>
  )
};

export default Auth;
