import React, { useEffect, useState } from 'react';
import { Select, SelectProps } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import useCustomToast from '../hooks/useCustomToast';
import { getAuthHeaders } from '../utils/getAuthHeaders'
import { useAuth } from '../contexts/AuthContext'
import api from '../utils/api';

type Category = {
    id: number;
    category_name: string;
  };

interface CategorySelectProps extends SelectProps {}

const CategorySelect: React.FC<CategorySelectProps> = (props) => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const { noticeToast } = useCustomToast();
  const { user } = useAuth();

  useEffect(() => {
    api.get('/categories/', {
      headers: getAuthHeaders(),
      params: { userId: user?.id }
    })
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        noticeToast(t('errorFetchingCategories') + `${error}`, 'error')
      });
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value);
  };

  return (
    <Select 
      value={selectedCategory} 
      onChange={handleChange}
      {...props}
    >
      {categories.map((category) => (
        <option key={category.id} value={category.category_name}>
          {t(`${category.category_name}`)}
        </option>
      ))}
    </Select>
  );
};

export default CategorySelect;
