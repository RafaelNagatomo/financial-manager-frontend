import { useState, useCallback, createContext, useContext, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import useCustomToast from '../hooks/useCustomToast';
import { useCategories, Category } from '../contexts/CategoryContext'

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
  const { shortToast } = useCustomToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { categories, fetchCategories } = useCategories();

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3001/transactions/');
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const transactionsResponse = await response.json();
      const hasIncomeCategory = transactionsResponse.some((transaction: Transaction) => transaction.category_name === 'income');
    
      if (hasIncomeCategory) {
        const categoriesResponse = await fetch('http://localhost:3001/categories/');
        const categories = await categoriesResponse.json();
    
        const transactionCategory = categories.find((cat: Category) => cat.category_name === 'income');
        if (transactionCategory) {
          const deleteResponse = await fetch(`http://localhost:3001/categories/delete/${transactionCategory.id}`, {
            method: 'DELETE',
          });
          if (!deleteResponse.ok) {
            console.error('Failed to delete income category');
          }
        }
      }
    
      setTransactions(transactionsResponse);
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
    }
  }, []);

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      if (transaction.transaction_type === 'income') {
        let categoryExists = categories.some(cat => cat.category_name === 'income');

        if (!categoryExists) {
          const categoryResponse = await fetch('http://localhost:3001/categories/add', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user_id: "3695f015-9880-4d70-98dc-3610c328357f",
              category_name: 'income',
              max_amount: 0
            }),
          });

          if (!categoryResponse.ok) {
            throw new Error('Failed to add income category');
          }
          await fetchCategories();
        }
      }
      const data = {
        ...transaction,
        user_id: "3695f015-9880-4d70-98dc-3610c328357f",
        expiration_date: transaction.expiration_date ? new Date(transaction.expiration_date).toISOString() : null,
      };
      const response = await fetch('http://localhost:3001/transactions/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        shortToast(t('transactionAddedSuccessfully'), 'success');
      } else {
        shortToast(t('failedToAddTransaction'), 'error');
      }
    } catch (error) {
      shortToast(t('errorOccured'), 'error');
    }
  };

  const deleteTransaction = async (transaction: Transaction) => {
    try {
      const response = await fetch(`http://localhost:3001/transactions/delete/${transaction.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setTransactions(transactions.filter(item => item.id !== transaction.id));
        shortToast(t('successfullyDeleted'), 'success');
      } else {
        shortToast(t('failedToDelete'), 'error');
      }
    } catch (error) {
      shortToast(t('errorOccured'), 'error');
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
        shortToast(t('transactionEditedSuccessfully'), 'success');
        fetchTransactions();
      } else {
        shortToast(t('failedToEditTransaction'), 'error');
      }
    } catch (error) {
      shortToast(t('errorOccured'), 'error');
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
