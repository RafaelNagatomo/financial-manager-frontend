import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next';
import { CgFacebook } from "react-icons/cg";
import { FcGoogle } from "react-icons/fc"
import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Box,
  HStack,
  Text,
  Image,
  Divider,
  IconButton,
  Center,
  VStack,
  LightMode,
  useColorMode
} from '@chakra-ui/react';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

const Login: React.FC = () =>  {
  const { t } = useTranslation()
  const { colorMode } = useColorMode();
  const navigate = useNavigate()

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
        w={500}
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
        <Text fontSize='2xl' my={10}>{t('letsGo')}!</Text>
        <Text fontSize='3xl' textAlign="center">
          {t('welcomeTo')}
          <Text fontSize='3xl' fontWeight='bold'>
            Financial Manager
          </Text>
        </Text>
      </VStack>
      

      <Card 
        w={500}
        p={8}
        zIndex={3}
        mx='auto'
        align='center'
        bg='rgba(255, 255, 255, 0.075)'
        backdropFilter="blur(7px)"
      >
        <CardHeader>
          <Heading as="h2" size="2xl" mt={30}>
            {t('Login')}
          </Heading>
        </CardHeader>

        <CardBody w={400} alignContent='center'>
          <CustomInput
            placeholder={t('firstName')}
            label={t('firstName')}
            labelPosition='topStart'
          />
          <CustomInput
            placeholder={t('email')}
            label={t('email')}
            labelPosition='topStart'
          />
          <CustomButton
            title={t('Login')}
            w='100%'
            h='50px'
            onClick={() => navigate('/dashboard')}
          />

          <HStack mt={10}>
            <Divider borderWidth='1.5px' borderColor='black.500'/>
            <Text p={2}>{t('or')}</Text>
            <Divider borderWidth='1.5px' borderColor='black.500'/>
          </HStack>

          <Center gap={20} my={10}>
            <LightMode>
              <IconButton
                w={70}
                h={70}
                as="a"
                href="https://www.google.com"
                aria-label="Google"
                icon={<FcGoogle size='full' />}
                isRound
                size="lg"
                colorScheme="gray"
                _hover={{ bg: 'gray.400' }}
              />
            </LightMode>
            <LightMode>
              <IconButton
                w={70}
                h={70}
                as="a"
                href="https://www.facebook.com"
                aria-label="Facebook"
                icon={<CgFacebook size='full' />}
                isRound
                colorScheme="blue"
                _hover={{ bg: 'blue.800' }}
              />
            </LightMode>
          </Center>
        </CardBody>
      </Card>
      
    </HStack>
  );
};

export default Login;
