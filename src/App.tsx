import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ChakraProvider, HStack, Stack } from '@chakra-ui/react'

import Sidebar from './components/Sidebar'
import theme from './styles/themes'
import Transactions from './pages/transactions/index';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <HStack align='stretch' gap={5}>
        <Router>
          <Sidebar />
          <Stack display="flex" alignItems="center" w="100%" >
            <Routes>
              <Route path="/transactions" element={<Transactions />} />
            </Routes>
          </Stack>
        </Router>
      </HStack>
    </ChakraProvider>
  );
}

export default App;
