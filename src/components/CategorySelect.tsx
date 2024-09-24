import React, { useEffect, useState } from 'react';
import { Select, SelectProps } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useCategories } from '../contexts/CategoryContext';

interface CategorySelectProps extends SelectProps {}

const CategorySelect: React.FC<CategorySelectProps> = (props) => {
  const { t } = useTranslation();
  const { categories, fetchCategories } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<string>();

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories]);

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
