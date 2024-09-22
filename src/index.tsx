import React from 'react';
import ReactDOM from 'react-dom/client';
import { CurrencyProvider } from './hooks/useCurrency';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from './styles/theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './index.css'
import './i18n'

import { AuthProvider } from './contexts/AuthContext';
import { CategoryProvider } from './contexts/CategoryContext'
import { TransactionProvider } from './contexts/TransactionContext'
import { GoalProvider } from './contexts/GoalContext'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CurrencyProvider>
          <ChakraProvider theme={theme}>
            <CategoryProvider>
              <TransactionProvider>
                <GoalProvider>
                  <App />
                </GoalProvider>
              </TransactionProvider>
            </CategoryProvider>
          </ChakraProvider>
        </CurrencyProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
