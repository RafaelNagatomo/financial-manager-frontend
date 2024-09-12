import React, { useState, useCallback, createContext, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import useCustomToast from '../hooks/useCustomToast';
import { useAuth } from '../contexts/AuthContext'
import { getAuthHeaders } from '../utils/getAuthHeaders'
import api from '../utils/api';

export interface Category {
  id: number;
  category_name: string;
  max_amount: number;
}

interface CategoryContextType {
  categories: Category[];
  fetchCategories: () => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => void;
  deleteCategory: (category: Category, transactionCount: number) => void;
  editCategory: (category: Category) => void;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useTranslation();
  const { shortToast, noticeToast } = useCustomToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const { user } = useAuth();
  
  const fetchCategories = useCallback(async () => {
    const response = await api.get('/categories/', {
      headers: getAuthHeaders(),
      params: { userId: user?.id }
    });
    const categoriesResponse = response.data;
    setCategories(categoriesResponse);
  }, [user?.id]);

  const addCategory = async (category: Omit<Category, 'id'>) => {
    const data = {
      ...category,
      user_id: user?.id,
    };
  
    try {  
      const response = await api.post('/categories/add', data, {
        headers: getAuthHeaders(),
      });
  
      if (response.status === 201) {
        const result = response.data;
        if (result === 'CATEGORY_EXISTS') {
          shortToast(t('unableToAddExistingCategory'), 'error');
        } else {
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
        setCategories(categories.filter(item => item.id !== category.id));
        if (transactionCount > 0) {
          noticeToast(
            t('categoryDeleted'),
            t('nowTransactionsAreUncategorized', { count: transactionCount }),
          );
        }
        shortToast(t('successfullyDeleted'), 'success');
      } else {
        shortToast(t('failedToDelete'), 'error');
      }
    } catch (error) {
      shortToast(t('errorOccured') + `${error}`, 'error');
    }
  };

  const editCategory = async (category: Category) => {
    const data = {
      ...category,
      user_id: user?.id,
    };

    try {
      const response = await api.put(`/categories/edit/${category.id}`, data, {
        headers: getAuthHeaders(),
      });

      if (response.status === 200) {
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
