import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ChakraProvider, HStack } from '@chakra-ui/react'

import Sidebar from './components/Sidebar'
import theme from './styles/themes'
import Transactions from './pages/transactions/index';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <HStack align='stretch'>
        <Router>
          <Sidebar />
          <Routes>
            <Route path="/transactions" element={<Transactions />} />
          </Routes>
        </Router>
      </HStack>
    </ChakraProvider>
  );
}

export default App;
