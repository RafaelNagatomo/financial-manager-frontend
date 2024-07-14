import { useTranslation } from 'react-i18next';
import {
  Flex,
  Spacer,
  Avatar,
  Text,
} from '@chakra-ui/react';

const Header: React.FC = () => {
  const { t } = useTranslation()

  return (
    <Flex gap='4' w='100%' my={30} px={45}>
      <Text
        fontWeight='bold'
        fontSize='lg'
        pt={5}
      >
        {t('goodMorning')}, {t('firstName')}!
      </Text>
      <Spacer />
      <Avatar
        size='lg'
        name='Segun Adebayo'
        src='https://bit.ly/sage-adebayo'
      />
      <Text
        fontWeight='bold'
        fontSize='lg'
        pt={5}
      >
        {t('firstName')} {t('lastName')}
      </Text>
    </Flex>
  )
}

export default Header