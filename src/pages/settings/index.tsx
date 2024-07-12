import { useTranslation } from 'react-i18next';
import {
  Card,
  CardHeader,
  CardBody,
  Flex,
  Spacer,
  Heading,
  Box,
  HStack,
  Avatar,
  Text,
  Grid,
  GridItem,
  Stack,
  VStack,
  RadioGroup,
  Radio,
  Image,
  useColorMode,
  LightMode,
} from '@chakra-ui/react';
import CustomInput from '../../components/CustomInput';
import CustomSelect from '../../components/CustomSelect';
import { useLanguage } from '../../hooks/useLanguage'

const Settings: React.FC = () =>  {
  const { t } = useTranslation()
  const { currentLanguage, changeLanguage } = useLanguage()
  const { colorMode, setColorMode } = useColorMode()

  const currencyOptions = [
    { value: 'USD', label: '($) USD' },
    { value: 'BRL', label: '(R$) BRL'},
  ];

  const languageOptions = [
    { value: 'en-US', label: 'English' },
    { value: 'pt-BR', label: 'Português' },
  ];

  const handleThemeChange = (value: string) => {
    setColorMode(value);
  };

  return (
    <Box>
      <Heading as="h1" size="lg" mb={5}>
        {t('settings')}
      </Heading>
      <HStack gap={5} align='stretch'>
        <Card layerStyle={colorMode}>
          <CardHeader>
            <Heading
              as="h2"
              size="md"
              w={300}
            >
              {t('account')}
            </Heading>
          </CardHeader>

          <CardBody>
            <VStack gap={2} align='stretch'>
              <Grid
                h='100px'
                templateRows='repeat(2, 1fr)'
                templateColumns='repeat(3, 1fr)'
                gap={2}
                mb={20}
              >
                <GridItem rowSpan={2} colSpan={1}>
                  <Avatar
                    size='xl'
                    name='Segun Adebayo'
                    src='https://bit.ly/sage-adebayo'
                  />
                </GridItem>
                <GridItem colSpan={2}>
                  <Text
                    fontWeight='bold'
                    fontSize={18}
                    pt={5}
                  >
                    {t('firstName')} {t('lastName')}
                  </Text>
                </GridItem>
                <GridItem colSpan={2}>
                  <Text
                    fontStyle='italic'
                    fontSize={14}
                  >
                    {t('email')}
                  </Text>
                </GridItem>
              </Grid>

              <CustomInput
                placeholder={t('firstName')}
                label={t('firstName')}
                labelPosition='topStart'
              />
              <CustomInput
                placeholder={t('lastName')}
                label={t('lastName')}
                labelPosition='topStart'
              />
              <CustomInput
                placeholder={t('email')}
                label={t('email')}
                labelPosition='topStart'
              />
        
            </VStack>
          </CardBody>
        </Card>

        <Card layerStyle={colorMode}>
          <CardHeader>
            <Flex>
              <Heading
                as="h2"
                size="md"
                w={500}
              >
                {t('preferences')}
              </Heading>
              <Spacer />
            </Flex>
          </CardHeader>

          <CardBody>
            <CustomSelect
              w={200}
              ml={100}
              label={t('language')}
              placeholder={t('selectLanguage')}
              options={languageOptions}
              onChange={(e) => changeLanguage(e.target.value)}
              value={currentLanguage}
            />
            <CustomSelect
              w={200}
              ml={100}
              label={t('currency')}
              placeholder={t('selectCurrency')}
              options={currencyOptions}
            />
            <HStack mb={5}>
              <Text fontSize={18}>{t('theme')}</Text>
              <LightMode>
                <RadioGroup
                  size='lg'
                  colorScheme= 'purple'
                  ml={110}
                  onChange={handleThemeChange}
                >
                  <Stack spacing={20} direction='row'>
                    <Radio value='light' style={{ border: '2px solid gray' }}>
                      {t('light')}
                    </Radio>
                    <Radio ml={59} value='dark' style={{ border: '2px solid gray' }}>
                      {t('dark')}
                    </Radio>
                  </Stack>
                </RadioGroup>
              </LightMode>
            </HStack>

            <HStack ml={160} gap={5}>
            <Image
              w='190px'
              src='/media/lightmode.png'
              alt='light-mode'
              borderRadius={6}
            />
            <Image
              w='190px'
              src='/media/darkmode.png'
              alt='dark-mode'
              borderRadius={6}
            />
            </HStack>
          </CardBody>
        </Card>
      </HStack>
    </Box>
  )
}

export default Settings
