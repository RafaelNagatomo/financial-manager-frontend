import { useTranslation } from 'react-i18next';
import { PiSunHorizonDuotone, PiSunDuotone, PiMoonStarsDuotone  } from "react-icons/pi";
import {
  Flex,
  Spacer,
  Avatar,
  Text,
  useColorMode,
  HStack
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { t } = useTranslation()
  const { colorMode } = useColorMode();
  const { user } = useAuth();
  const isMobile = window.innerWidth <= 768

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour > 17 || hour < 4) {
      return {
        greeting: t('goodEvening'),
        icon: <PiMoonStarsDuotone size={25} color='#dcf85c' />
      };
    } else if (hour > 11) {
      return {
        greeting: t('goodAfternoon'),
        icon: <PiSunDuotone size={25} color='#e6793a' />
      };
    } else {
      return {
        greeting: t('goodMorning'),
        icon: <PiSunHorizonDuotone size={25} color='#e6d53a' />
      };
    }
  };
  const greetingInfo = getGreeting();

  return (
    <Flex
      gap='4'
      w='100%'
      p={{
        base: '10px 10px 10px 65px',
        md: '10px 45px 10px 65px',
        lg: '10px 45px 10px 265px'
      }}
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
        fontSize={{ base: 'md', md:'lg' }}
      >
        <HStack>
          <Flex>{greetingInfo.icon}</Flex>
          <Flex>{greetingInfo.greeting},</Flex>
          <Flex>{user?.first_name} !</Flex>
        </HStack>
      </Text>
      <Spacer />
      <Avatar
        size='md'
        bg='purple.500'
        src='https://bit.ly/broken-link'
      />
      <Text
        fontWeight='bold'
        fontSize='lg'
      >
        {isMobile ? '' : `${user?.first_name} ${user?.last_name}`}
      </Text>
    </Flex>
  )
}

export default Header