import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { HStack, Stack } from '@chakra-ui/react';

import { CurrencyProvider } from './hooks/useCurrency';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Transactions from './pages/transactions/index';
import Goals from './pages/goals/index';
import Settings from './pages/settings/index';
import Login from './pages/login';

function App() {
  return (
    <CurrencyProvider>
      <Router>
        <AppContent />
      </Router>
    </CurrencyProvider>
  );
}

function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <HStack align="stretch" gap={5}>
      {!isLoginPage && <Sidebar />}
      <Stack display="flex" alignItems="center" w="100%">
        {!isLoginPage && <Header />}
        <Routes>
        <Route
            path="/login"
            element={
              <Stack
                alignItems="center"
                justifyContent="center"
                w="100%"
                h="100vh"
              >
                <Login />
              </Stack>
            }
          />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Stack>
    </HStack>
  );
}

export default App;
