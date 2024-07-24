import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import useCustomToast from './useCustomToast';

export interface Category {
  id: number;
  category_name: string;
  max_amount: number;
}

const useCategories = () => {
  const { t } = useTranslation();
  const showToast = useCustomToast();
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
      showToast(t('errorOccured'), 'error');
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
        showToast(t('categoryAddedSuccessfully'), 'success');
      } else {
        showToast(t('failedToAddCategory'), 'error');
      }
    } catch (error) {
      showToast(t('errorOccured'), 'error');
    }
  };

  const deleteCategory = async (category: Category) => {
    try {
      const response = await fetch(`http://localhost:3001/categories/delete/${category.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setCategories(categories.filter(item => item.id !== category.id));
        showToast(t('successfullyDeleted'), 'success');
      } else {
        showToast(t('failedToDelete'), 'error');
      }
    } catch (error) {
      showToast(t('errorOccured'), 'error');
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
        showToast(t('categoryEditedSuccessfully'), 'success');
      } else {
        showToast(t('failedToEditCategory'), 'error');
      }
    } catch (error) {
      showToast(t('errorOccured'), 'error');
    }
  };

  return {
    categories,
    fetchCategories,
    addCategory,
    deleteCategory,
    editCategory,
  };
};

export default useCategories;
