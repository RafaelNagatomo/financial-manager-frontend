import React, { useState, useCallback, createContext, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import useCustomToast from '../hooks/useCustomToast';
import { useAuth } from '../contexts/AuthContext'
import { getAuthHeaders } from '../utils/getAuthHeaders'
import { useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';

export interface Category {
  id: number;
  category_name: string;
  max_amount: number;
}

interface CategoryContextType {
  categories: Category[];
  fetchCategories: () => Promise<Category[]>;
  addCategory: (category: Omit<Category, 'id'>) => void;
  deleteCategory: (category: Category, transactionCount: number) => void;
  editCategory: (category: Category) => void;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { shortToast, noticeToast } = useCustomToast();
  const [categories, setCategories] = useState<Category[]>(
    queryClient.getQueryData<Category[]>(['categories']) || []
  );
  
  const fetchCategories = useCallback(async () => {
    const cachedTransactions = queryClient.getQueryData<Category[]>(['categories']);
    if (cachedTransactions) {
      setCategories(cachedTransactions);
      return cachedTransactions;
    }

    try {
      const response = await api.get('/categories/', {
        headers: getAuthHeaders(),
        params: { userId: user?.id }
      });
      const categoriesResponse = response.data;

      queryClient.setQueryData<Category[]>(['categories'], categoriesResponse);
      setCategories(categoriesResponse);
      return categoriesResponse;
    } catch (error) {
        shortToast(`${t('errorFetchingTransactions')} ${error}`, 'error');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addCategory = async (category: Omit<Category, 'id'>) => {  
    try {  
      const response = await api.post('/categories/add', {
        ...category,
        user_id: user?.id,
      }, {
        headers: getAuthHeaders(),
      });
  
      if (response.status === 201) {
        const result = response.data;
        if (result === 'CATEGORY_EXISTS') {
          shortToast(t('unableToAddExistingCategory'), 'error');
        } else {

          queryClient.setQueryData<Category[]>(['categories'], (oldCategories = []) => [
            ...oldCategories,
            response.data,
          ]);

          fetchCategories();
          shortToast(t('categoryAddedSuccessfully'), 'success');
        }
      } else {
        shortToast(t('failedToAddCategory'), 'error');
      }
    } catch (error) {
      shortToast(t('errorOccured') + `${error}`, 'error');
    }
  }; 

  const deleteCategory = async (category: Category, transactionCount: number) => {
    try {
      const response = await api.delete(`/categories/delete/${category.id}`, {
        headers: getAuthHeaders(),
      });
  
      if (response.status === 200) {

        queryClient.setQueryData<Category[]>(['categories'], (oldCategories = []) =>
          oldCategories.filter(item => item.id !== category.id)
        );
        
        if (transactionCount > 0) {
          noticeToast(
            t('categoryDeleted'),
            t('nowTransactionsAreUncategorized', { count: transactionCount })
          );
        }
        fetchCategories();
        shortToast(t('successfullyDeleted'), 'success');
      } else {
        shortToast(t('failedToDelete'), 'error');
      }
    } catch (error) {
      shortToast(t('errorOccured') + `${error}`, 'error');
    }
  };

  const editCategory = async (category: Category) => {  
    try {
      const response = await api.put(`/categories/edit/${category.id}`, {
        ...category,
        user_id: user?.id,
      }, {
        headers: getAuthHeaders(),
      });
  
      if (response.status === 200) {

        queryClient.setQueryData<Category[]>(['categories'], (oldCategories = []) =>
          oldCategories.map(item => (item.id === category.id ? response.data : item))
        );
  
        fetchCategories();
        shortToast(t('categoryEditedSuccessfully'), 'success');
      } else {
        shortToast(t('failedToEditCategory'), 'error');
      }
    } catch (error) {
      shortToast(t('errorOccured') + `${error}`, 'error');
    }
  };

  return (
    <CategoryContext.Provider
      value={{
        categories,
        fetchCategories,
        addCategory,
        deleteCategory,
        editCategory
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
};
