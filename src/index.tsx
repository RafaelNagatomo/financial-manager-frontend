import React from 'react';
import ReactDOM from 'react-dom/client';
import { CurrencyProvider } from './hooks/useCurrency';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from './styles/theme';
import App from './App';
import './index.css'
import './i18n'

import { CategoryProvider } from './contexts/CategoryContext'
import { TransactionProvider } from './contexts/TransactionContext'
import { GoalProvider } from './contexts/GoalContext'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
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
  </React.StrictMode>
);
