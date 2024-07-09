import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ChakraProvider, HStack, Stack } from '@chakra-ui/react'
import theme from './styles/themes'

import { CurrencyProvider } from './hooks/useCurrency'

import Sidebar from './components/Sidebar'
import Transactions from './pages/transactions/index';
import Goals from './pages/goals/index';
import Settings from './pages/settings/index';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <CurrencyProvider>
        <HStack align='stretch' gap={5}>
          <Router>
            <Sidebar />
            <Stack display="flex" alignItems="center" w="100%" >
              <Routes>
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/goals" element={<Goals />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </Stack>
          </Router>
        </HStack>
      </CurrencyProvider>
    </ChakraProvider>
  );
}

export default App;
