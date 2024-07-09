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
  VStack
} from '@chakra-ui/react';
import CustomInput from '../../components/CustomInput';
import CustomSelect from '../../components/CustomSelect';

const Settings: React.FC = () =>  {
  const { t } = useTranslation()

  const currencyOptions = [
    { value: 'USD', label: '($) USD' },
    { value: 'BRL', label: '(R$) BRL'},
  ];
  
  const languageOptions = [
    { value: 'en-US', label: 'English' },
    { value: 'pt-BR', label: 'Português' },
  ];

  return (
    <Box>
      <Heading as="h1" size="lg" mb={5}>
        {t('settings')}
      </Heading>
      <HStack gap={5} align='stretch'>
        <Card bg="gray.100">
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
                  <Avatar size='xl' name='Segun Adebayo' src='https://bit.ly/sage-adebayo' />
                </GridItem>
                <GridItem colSpan={2}>
                  <Text fontWeight='bold' fontSize={18} pt={5}>{t('firstName')} {t('lastName')}</Text>
                </GridItem>
                <GridItem colSpan={2}>
                  <Text fontStyle='italic' fontSize={14}>{t('email')}</Text>
                </GridItem>
              </Grid>

              <CustomInput placeholder={t('firstName')} label={t('firstName')} labelPosition='topStart'/>
              <CustomInput placeholder={t('lastName')} label={t('lastName')} labelPosition='topStart' />
              <CustomInput placeholder={t('email')} label={t('email')} labelPosition='topStart' />
        
            </VStack>
          </CardBody>
        </Card>

        <Card bg="gray.100">
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
            />
            <CustomSelect
              w={200}
              ml={100}
              label={t('currency')}
              placeholder={t('selectCurrency')}
              options={currencyOptions}
            />
          </CardBody>
        </Card>
    </HStack>
  </Box>
  )
}

export default Settings