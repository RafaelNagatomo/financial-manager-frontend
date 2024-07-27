import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from './styles/theme';
import App from './App';
import './index.css'
import './i18n'

import { CategoryProvider } from './contexts/CategoryContext'
import { TransactionProvider } from './contexts/TransactionContext'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <CategoryProvider>
        <TransactionProvider>
          <App />
        </TransactionProvider>
      </CategoryProvider>
    </ChakraProvider>
  </React.StrictMode>
);
