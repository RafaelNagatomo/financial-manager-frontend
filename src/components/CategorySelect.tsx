import React, { useEffect, useState } from 'react';
import { Select, SelectProps } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

type Category = {
    id: number;
    category_name: string;
  };

interface CategorySelectProps extends SelectProps {}

const CategorySelect: React.FC<CategorySelectProps> = (props) => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>();

  useEffect(() => {
    fetch('http://localhost:3001/categories/')
      .then(response => response.json())
      .then(data => {
        setCategories(data);
      })
      .catch();
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
