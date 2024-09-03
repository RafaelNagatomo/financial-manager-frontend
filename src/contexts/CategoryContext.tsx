import React, { useState, useCallback, createContext, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import useCustomToast from '../hooks/useCustomToast';

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
  
  const fetchCategories = useCallback(async () => {
    const response = await fetch('http://localhost:3001/categories/');
    const categoriesResponse = await response.json();
    setCategories(categoriesResponse);
  }, []);

  const addCategory = async (category: Omit<Category, 'id'>) => {
    const data = {
      ...category,
      user_id: "3695f015-9880-4d70-98dc-3610c328357f",
    };
  
    try {  
      const response = await fetch('http://localhost:3001/categories/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        const result = await response.json();
        if (result === 'CATEGORY_EXISTS') {
          shortToast(t('unableToAddExistingCategory'), 'error');
        } else {
          shortToast(t('categoryAddedSuccessfully'), 'success');
        }
      } else {
        shortToast(t('failedToAddCategory'), 'error');
      }
    } catch (error) {
      shortToast(t('errorOccured'), 'error');
    }
  }; 

  const deleteCategory = async (category: Category, transactionCount: number) => {
    try {
      const response = await fetch(`http://localhost:3001/categories/delete/${category.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
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
      shortToast(t('errorOccured'), 'error');
    }
  };

  const editCategory = async (category: Category) => {
    const data = {
      ...category,
      user_id: "3695f015-9880-4d70-98dc-3610c328357f",
    };

    try {
      const response = await fetch(`http://localhost:3001/categories/edit/${category.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        fetchCategories();
        shortToast(t('categoryEditedSuccessfully'), 'success');
      } else {
        shortToast(t('failedToEditCategory'), 'error');
      }
    } catch (error) {
      shortToast(t('errorOccured'), 'error');
    }
  };

  return (
    <CategoryContext.Provider value={{ categories, fetchCategories, addCategory, deleteCategory, editCategory }}>
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
