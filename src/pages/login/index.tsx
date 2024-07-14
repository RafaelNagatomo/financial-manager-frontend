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
  useColorMode,
  Divider,
  IconButton,
  Center,
  Spacer,
  VStack,
  LightMode,
} from '@chakra-ui/react';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { useLanguage } from '../../hooks/useLanguage'
import CustomSelect from "../../components/CustomSelect";

const Login: React.FC = () =>  {
  const { t } = useTranslation()
  const { colorMode } = useColorMode()
  const { currentLanguage, changeLanguage } = useLanguage()

  const languageOptions = [
    { value: 'en-US', label: 'English' },
    { value: 'pt-BR', label: 'Português' },
  ];

  return (
    <Box>
      <HStack align='stretch' gap={0}>
        <Card
          layerStyle={colorMode}
          borderTopLeftRadius={30} 
          borderBottomLeftRadius={30}
          h={800}
        >
          <CardBody p='0' >
            <Box
              h="100%"
              w={700}
              position="relative"
              borderTopLeftRadius={30}
              borderBottomLeftRadius={30}
              overflow="hidden"
            >
              <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                backgroundImage="url('/media/login-img.png')"
                backgroundSize="cover"
                backgroundPosition="center"
                opacity={0.4}
                filter="blur(4px)"
              />
              <Box
                position="relative"
                zIndex={1}
                p={4}
                color="white"
              >
                <HStack alignItems='center'>
                  <Image w={200} src='/logos/logo.png' alt='FiManager-logo'/>
                  <Spacer />
                  <CustomSelect
                    mt={5}
                    w='auto'
                    placeholder={t('selectLanguage')}
                    options={languageOptions}
                    onChange={(e) => changeLanguage(e.target.value)}
                    value={currentLanguage}
                  />
                </HStack>

                <VStack>
                  <Text fontSize='6xl' my={70}>
                    {t('letsGo')}!
                  </Text>
                  <Text fontSize='5xl'>
                    {t('welcomeTo')}
                    <Text fontSize='6xl' fontWeight='bold'>
                      Financial Manager
                    </Text>
                  </Text>
                </VStack>

              </Box>
            </Box>
          </CardBody>
        </Card>

        <Card 
          layerStyle={colorMode}
          align='center'
          borderTopRightRadius={30} 
          borderBottomRightRadius={30}
          w={700}
        >
          <CardHeader>
            <Heading
              as="h2"
              size="2xl"
              mt={30}
            >
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
            <CustomButton title='Login' w='100%'/>

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
                  icon={<FcGoogle size='full'/>}
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
                  icon={<CgFacebook size='full'/>}
                  isRound
                  colorScheme="blue"
                  _hover={{ bg: 'blue.800' }}
                />
              </LightMode>
            </Center>
          </CardBody>
        </Card>
      </HStack>
    </Box>
  )
}

export default Login
