import { useState, useCallback, createContext, useContext, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import useCustomToast from '../hooks/useCustomToast';
import { useCategories, Category } from '../contexts/CategoryContext';
import { useAuth } from '../contexts/AuthContext';
import { getAuthHeaders } from '../utils/getAuthHeaders';
import { useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';

export interface Transaction {
  id: string;
  transaction_type?: string;
  transaction_name?: string;
  category_name?: string;
  paid?: boolean;
  transaction_amount: number;
  expiration_date: string;
  categoryExists?: boolean
  goal_id?: number
  goal_name?: string
  created_at?: string
  category_exists?: Category | null
}

interface TransactionContextProps {
  transactions: Transaction[];
  refetchTransactions: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  deleteTransaction: (transaction: Transaction) => Promise<void>;
  editTransaction: (transaction: Transaction) => Promise<void>;
}

const TransactionContext = createContext<TransactionContextProps | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { shortToast, noticeToast } = useCustomToast();
  const { categories, fetchCategories } = useCategories();
  const [transactions, setTransactions] = useState<Transaction[]>(
    queryClient.getQueryData<Transaction[]>(['transactions']) || []
  );

  const handleApiError = (error: any, message: string) => {
    noticeToast(`${message} ${error}`, 'error');
  };

  const refetchTransactions = useCallback(async () => {
    try {
      const response = await api.get('/transactions/', {
        headers: getAuthHeaders(),
        params: { userId: user?.id },
      });
      const transactionsResponse = response.data;

      queryClient.setQueryData<Transaction[]>(['transactions'], transactionsResponse);

      setTransactions(transactionsResponse);
      return transactionsResponse
    } catch (error) {
      handleApiError(error, t('errorFetchingTransactions'));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTransactions = useCallback(async () => {
    const cachedTransactions = queryClient.getQueryData<Transaction[]>(['transactions']);
    if (cachedTransactions) {
      setTransactions(cachedTransactions);
      return cachedTransactions;
    }
    
    try {
      const response = await api.get('/transactions/', {
        headers: getAuthHeaders(),
        params: { userId: user?.id },
      });
      const transactionsResponse = response.data;

      const hasIncomeCategory = transactionsResponse.some(
        (transaction: Transaction) => transaction.category_name === 'income'
      );

      if (hasIncomeCategory) {
        const categoriesResponse = await api.get('/categories/', {
          headers: getAuthHeaders(),
          params: { userId: user?.id },
        });

        const incomeCategory = categoriesResponse.data.find(
          (cat: Category) => cat.category_name === 'income'
        );

        if (incomeCategory) {
          await api.delete(`/categories/delete/${incomeCategory.id}`, {
            headers: getAuthHeaders(),
          });
        }
      }

      queryClient.setQueryData<Transaction[]>(['transactions'], transactionsResponse);
      setTransactions(transactionsResponse);
      return transactionsResponse
    } catch (error) {
      handleApiError(error, t('errorFetchingTransactions'));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      if (transaction.transaction_type === 'income' && !categories.some((cat) => cat.category_name === 'income')) {
        await api.post(
          '/categories/add',
          { user_id: user?.id, category_name: 'income', max_amount: 0 },
          { headers: getAuthHeaders() }
        );
        await fetchCategories();
      }

      const response = await api.post('/transactions/add', {
        ...transaction,
        user_id: user?.id,
        expiration_date: transaction.expiration_date ? new Date(transaction.expiration_date).toISOString() : null,
      }, {
        headers: getAuthHeaders(),
      });

      queryClient.setQueryData<Transaction[]>(['transactions'], (oldTransactions = []) => [
        { ...response.data, categoryExists: response?.data?.category_name ? true : false },
        ...oldTransactions,
      ]);

      fetchTransactions();
      shortToast(t('transactionAddedSuccessfully'), 'success');
    } catch (error) {
      handleApiError(error, t('failedToAddTransaction'));
    }
  };

  const deleteTransaction = async (transaction: Transaction) => {
    try {
      await api.delete(`/transactions/delete/${transaction.id}`, {
        headers: getAuthHeaders(),
      });

      queryClient.setQueryData<Transaction[]>(['transactions'], (oldTransactions = []) =>
        oldTransactions.filter((item) => item.id !== transaction.id)
      );

      fetchTransactions();
      shortToast(t('successfullyDeleted'), 'success');
    } catch (error) {
      handleApiError(error, t('failedToDelete'));
    }
  };

  const editTransaction = async (transaction: Transaction) => {
    try {
      const response = await api.put(`/transactions/edit/${transaction.id}`, {
        ...transaction,
        user_id: user?.id,
        expiration_date: transaction.expiration_date ? new Date(transaction.expiration_date).toISOString() : null,
      }, {
        headers: getAuthHeaders(),
      });

      queryClient.setQueryData<Transaction[]>(['transactions'], (oldTransactions = []) =>
        oldTransactions.map(item => 
          item.id === transaction.id
            ? {
                ...response.data,
                categoryExists: response?.data?.category_name ?? item.categoryExists,
                category_exists: response?.data?.category_name ?? item.category_exists
              }
            : item
        )
      );

      fetchTransactions();
      shortToast(t('transactionEditedSuccessfully'), 'success');
    } catch (error) {
      handleApiError(error, t('failedToEditTransaction'));
    }
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        refetchTransactions,
        fetchTransactions,
        addTransaction,
        deleteTransaction,
        editTransaction
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};
