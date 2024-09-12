import { useState, useCallback, createContext, useContext, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import useCustomToast from '../hooks/useCustomToast';
import { useCategories, Category } from '../contexts/CategoryContext'
import { useAuth } from '../contexts/AuthContext'
import { getAuthHeaders } from '../utils/getAuthHeaders'
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
}

interface TransactionContextProps {
  transactions: Transaction[];
  fetchTransactions: () => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  deleteTransaction: (transaction: Transaction) => Promise<void>;
  editTransaction: (transaction: Transaction) => Promise<void>;
}

const TransactionContext = createContext<TransactionContextProps | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { t } = useTranslation();
  const { shortToast, noticeToast } = useCustomToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { categories, fetchCategories } = useCategories();
  const { user } = useAuth();

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await api.get('/transactions/',
        {
        headers: getAuthHeaders(),
        params: { userId: user?.id }
      });
      const transactionsResponse = response.data;
      const hasIncomeCategory = transactionsResponse.some((transaction: Transaction) => transaction.category_name === 'income');
    
      if (hasIncomeCategory) {
        const categoriesResponse = await api.get('/categories/', {
          headers: getAuthHeaders(),
          params: { userId: user?.id }
        });
        const categories = categoriesResponse.data;
    
        const transactionCategory = categories.find((cat: Category) => cat.category_name === 'income');
        if (transactionCategory) {
          await api.delete(`/categories/delete/${transactionCategory.id}`, {
            headers: getAuthHeaders(),
          });
        }
      }
    
      setTransactions(transactionsResponse);
    } catch (error) {
      noticeToast(t('errorFetchingTransactions') + `${error}`, 'error');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      if (transaction.transaction_type === 'income') {
        const categoryExists = categories.some(cat => cat.category_name === 'income');
        if (!categoryExists) {
          await api.post('/categories/add', {
            user_id: user?.id,
            category_name: 'income',
            max_amount: 0
          }, {
            headers: getAuthHeaders(),
          });
          await fetchCategories();
        }
      }
      const data = {
        ...transaction,
        user_id: user?.id,
        expiration_date: transaction.expiration_date ? new Date(transaction.expiration_date).toISOString() : null,
      };
      const response = await api.post('/transactions/add', data, {
        headers: getAuthHeaders(),
      });
      
      if (response.status === 201) {
        shortToast(t('transactionAddedSuccessfully'), 'success');
      } else {
        shortToast(t('failedToAddTransaction'), 'error');
      }
    } catch (error) {
      shortToast(t('errorOccured') + `${error}`, 'error');
    }
  };

  const deleteTransaction = async (transaction: Transaction) => {
    try {
      await api.delete(`/transactions/delete/${transaction.id}`, {
        headers: getAuthHeaders(),
      });
        setTransactions(transactions.filter(item => item.id !== transaction.id));
        shortToast(t('successfullyDeleted'), 'success');
    } catch (error) {
      shortToast(t('failedToDelete') + `${error}`, 'error');
    }
  };

  const editTransaction = async (transaction: Transaction) => {
    const data = {
      ...transaction,
      user_id: user?.id,
      expiration_date: transaction.expiration_date ? new Date(transaction.expiration_date).toISOString() : null,
    };
    try {
      const response = await api.put(`/transactions/edit/${transaction.id}`, data, {
        headers: getAuthHeaders(),
      });

      if (response.status === 200) {
        fetchTransactions();
        shortToast(t('transactionEditedSuccessfully'), 'success');
      } else {
        shortToast(t('failedToEditTransaction'), 'error');
      }
    } catch (error) {
      shortToast(t('errorOccured') + `${error}`, 'error');
    }
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        fetchTransactions,
        addTransaction,
        deleteTransaction,
        editTransaction,
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
