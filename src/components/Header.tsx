import { useTranslation } from 'react-i18next';
import {
  Flex,
  Spacer,
  Avatar,
  Text,
  useColorMode
} from '@chakra-ui/react';

const Header: React.FC = () => {
  const { t } = useTranslation()
  const { colorMode } = useColorMode();

  return (
    <Flex
      gap='4'
      w='100%'
      p='10px 45px 10px 265px'
      position="fixed"
      top="0"
      left="0"
      zIndex="900"
      bg={
        colorMode === 'dark'
        ? 'rgba(124, 121, 155, 0.103)'
        : 'rgba(15, 36, 105, 0.103)'
      }
      backdropFilter="blur(5px)"
      alignItems="center"
    >
      <Text
        fontWeight='bold'
        fontSize='lg'
      >
        {t('goodMorning')}, {t('firstName')}!
      </Text>
      <Spacer />
      <Avatar
        size='md'
        name='Segun Adebayo'
        src='https://bit.ly/sage-adebayo'
      />
      <Text
        fontWeight='bold'
        fontSize='lg'
      >
        {t('firstName')} {t('lastName')}
      </Text>
    </Flex>
  )
}

export default Header