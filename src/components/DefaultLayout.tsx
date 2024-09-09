import { Flex, HStack } from '@chakra-ui/react';
import Sidebar from './Sidebar';
import Header from './Header';

const DefaultLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <HStack align="stretch">
      <Sidebar />
      <Flex
        w="100vw"
        minH="100vh"
        py={{ base: 70, md: 70, lg: 100}}
        pl={{ lg: 200}}
        justifyContent="center"
      >
        <Header />
          {children}
      </Flex>
    </HStack>
  );
}

export default DefaultLayout;
