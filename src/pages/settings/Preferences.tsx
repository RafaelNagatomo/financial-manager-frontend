import { useTranslation } from 'react-i18next';
import {
  HStack,
  Text,
  Stack,
  RadioGroup,
  Radio,
  Image,
  useColorMode,
  LightMode,
  Box,
} from '@chakra-ui/react';
import CustomSelect from '../../components/CustomSelect';
import { useLanguage } from '../../hooks/useLanguage'

const Settings: React.FC = () =>  {
  const { t } = useTranslation()
  const { currentLanguage, changeLanguage } = useLanguage()
  const { setColorMode } = useColorMode()

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
    <Box w={550}>
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
              <Radio
                value='light'
                style={{ border: '2px solid gray'
              }}>
                {t('light')}
              </Radio>
              <Radio
                ml={59}
                value='dark'
                style={{ border: '2px solid gray'
              }}>
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
    </Box>
  )
}

export default Settings
