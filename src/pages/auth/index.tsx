import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Stack,
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
    <Stack
      flexDirection={{ base: 'column', md: 'row' }}
      spacing={8}
      w="100%"
      h={{ base: '100%', md: '100vh' }}
      alignItems={{ base: "center"}}
    >
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
        w={{ base: '90%', md: '800px' }}
        h={{ base: '100%', md: '100vh' }}
        mt={{base: '20px', md: '0'}}
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
          w={{ base: '250px', md: '350px' }}
          alt='FiManager-logo'
          src={
            colorMode === 'dark'
            ? '/logos/logo-white.png'
            : '/logos/logo-black.png'
          }
        />
        <Box textAlign='center'>
          <Text fontSize={{ base: 'xl', md: '2xl' }} my={{ base: '0', md: 20 }}>
            {t('letsGo')}!
          </Text>
          <Text fontSize={{ base: '2xl', md: '3xl' }} textAlign="center">
            {t('welcomeTo')}
          </Text>
          <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight='bold'>
            Financial Manager
          </Text>
        </Box>
      </VStack>

      <Center w={{ base: '100%', md: '50%' }}>
        <AnimatePresence mode="wait">
          {isLogin ? (
            <Login key="login" onSwitch={toggleView} />
          ) : (
            <Register key="register" onSwitch={toggleView} />
          )}
        </AnimatePresence>
      </Center>
      
    </Stack>
  )
};

export default Auth;
