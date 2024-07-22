import { useState, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export interface Transaction {
  id: number;
  transaction_type: string;
  transaction_name: string;
  category_name: string;
  paid: boolean;
  transaction_amount: number;
  expiration_date: string;
}

const useTransactions = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [spendingByCategory, setSpendingByCategory] = useState([]);
  const [upcomingPayments, setUpcomingPayments] = useState([]);

  const fetchData = async (endpoint: string) => {
    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return [];
    }
  };

  const fetchTransactions = useCallback(async () => {
    const data = await fetchData('http://localhost:3001/transactions/');
    setTransactions(data);
  }, []);

  const fetchSpendingByCategory = useCallback(async () => {
    const data = await fetchData('http://localhost:3001/categories/');
    setSpendingByCategory(data);
  }, []);

  const addTransaction = async (transaction: any) => {
    const data = {
        ...transaction,
        user_id: "3695f015-9880-4d70-98dc-3610c328357f",
        expiration_date: transaction.expiration_date ? new Date(transaction.expiration_date).toISOString() : null,
      }
    try {
      const response = await fetch('http://localhost:3001/transactions/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        fetchTransactions();
        toast({
          title: t('transactionAddedSuccessfully'),
          status: 'success',
          isClosable: true,
        });
      } else {
        toast({
          title: t('failedToAddTransaction'),
          status: 'error',
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: t('errorOccured'),
        status: 'error',
        isClosable: true,
      });
    }
  };

  const deleteTransaction = async (transactionId: number) => {
    try {
      const response = await fetch(`http://localhost:3001/transactions/delete/${transactionId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setTransactions(transactions.filter(item => item.id !== transactionId));
        toast({
          title: t('successfullyDeleted'),
          status: 'success',
          isClosable: true,
        });
      } else {
        toast({
          title: t('failedToDelete'),
          status: 'error',
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: t('failedToDelete'),
        status: 'error',
        isClosable: true,
      });
    }
  };

  return {
    transactions,
    spendingByCategory,
    upcomingPayments,
    fetchTransactions,
    fetchSpendingByCategory,
    addTransaction,
    deleteTransaction,
  };
};

export default useTransactions;
