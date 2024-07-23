import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import useCustomToast from './useCustomToast';

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
  const showToast = useCustomToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  const fetchData = async (endpoint: string) => {
    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      showToast(t('errorOccured'), 'error');
      return [];
    }
  };

  const fetchTransactions = useCallback(async () => {
    const data = await fetchData('http://localhost:3001/transactions/');
    setTransactions(data);
  }, []);

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    const data = {
      ...transaction,
      user_id: "3695f015-9880-4d70-98dc-3610c328357f",
      expiration_date: transaction.expiration_date ? new Date(transaction.expiration_date).toISOString() : null,
    };

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
        showToast(t('transactionAddedSuccessfully'), 'success');
      } else {
        showToast(t('failedToAddTransaction'), 'error');
      }
    } catch (error) {
      showToast(t('errorOccured'), 'error');
    }
  };

  const deleteTransaction = async (transaction: Transaction) => {
    try {
      const response = await fetch(`http://localhost:3001/transactions/delete/${transaction.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setTransactions(transactions.filter(item => item.id !== transaction.id));
        showToast(t('successfullyDeleted'), 'success');
      } else {
        showToast(t('failedToDelete'), 'error');
      }
    } catch (error) {
      showToast(t('errorOccured'), 'error');
    }
  };

  const editTransaction = async (transaction: Transaction) => {
    const data = {
      ...transaction,
      user_id: "3695f015-9880-4d70-98dc-3610c328357f",
      expiration_date: transaction.expiration_date ? new Date(transaction.expiration_date).toISOString() : null,
    };

    try {
      const response = await fetch(`http://localhost:3001/transactions/edit/${transaction.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        fetchTransactions();
        showToast(t('transactionEditedSuccessfully'), 'success');
      } else {
        showToast(t('failedToEditTransaction'), 'error');
      }
    } catch (error) {
      showToast(t('errorOccured'), 'error');
    }
  };

  return {
    transactions,
    fetchTransactions,
    addTransaction,
    deleteTransaction,
    editTransaction,
  };
};

export default useTransactions;
