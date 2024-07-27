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
  deleteCategory: (category: Category) => void;
  editCategory: (category: Category) => void;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useTranslation();
  const { shortToast } = useCustomToast();
  const [categories, setCategories] = useState<Category[]>([]);
  
  const fetchData = async (endpoint: string) => {
    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      shortToast(t('errorOccured'), 'error');
      return [];
    }
  };

  const fetchCategories = useCallback(async () => {
    const data = await fetchData('http://localhost:3001/categories/');
    setCategories(data);
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
        fetchCategories();
        shortToast(t('categoryAddedSuccessfully'), 'success');
      } else {
        shortToast(t('failedToAddCategory'), 'error');
      }
    } catch (error) {
      shortToast(t('errorOccured'), 'error');
    }
  };

  const deleteCategory = async (category: Category) => {
    try {
      const response = await fetch(`http://localhost:3001/categories/delete/${category.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setCategories(categories.filter(item => item.id !== category.id));
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