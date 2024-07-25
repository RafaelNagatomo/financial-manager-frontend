import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaRegTrashAlt, FaRegEdit } from "react-icons/fa"
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Progress,
  Stack,
  Text,
  useColorMode,
  LightMode,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import { formatAmount } from '../../utils/formatAmount'
import { useCurrency } from '../../hooks/useCurrency';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';
import AddCategoryModal from '../../components/AddCategoryModal';
import useCategories, { Category } from '../../hooks/useCategories';
import { Transaction } from '../../hooks/useTransactions';

interface SpendingByCategoryTableProps {
  categories: Category[];
  fetchCategories: () => Promise<void>;
  transactions: Transaction[];
}

export const SpendingByCategoryTable: React.FC<SpendingByCategoryTableProps> = ({
    categories,
    fetchCategories,
    transactions,
  }) => {
    const { t } = useTranslation();
    const { currency } = useCurrency();
    const { colorMode } = useColorMode();
    const { deleteCategory, editCategory } = useCategories();
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  
    const handleDeleteCategory = async (category: Category) => {
      await deleteCategory(category);
      fetchCategories();
      setIsDeleteModalOpen(false);
    };
  
    const handleEditCategory = (category: Category) => {
      setSelectedCategory(category);
      setIsAddModalOpen(true);
    };
  
    const handleUpdateCategory = async (category: Category) => {
      await editCategory(category);
      fetchCategories();
      setIsAddModalOpen(false);
    };

    const getCategoryTotal = (categoryName: string) => {
      return transactions
        .filter(transaction => transaction.category_name === categoryName)
        .reduce((total, transaction) => total + Number(transaction.transaction_amount), 0);
    }

    return (
      <>
        <Table
          layerStyle={colorMode === 'dark' ? 'darkTable' : 'lightTable'}
          variant="unstyled"
          borderRadius={8}
          w='100%'
        >
          <Thead>
            <Tr>
              <Th>{t('title')}</Th>
              <Th>{t('maxAmount')}</Th>
              <Th>{t('progress')}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {categories.map((category) => {
              const totalAmount = getCategoryTotal(category.category_name);
              const progressValue = Math.min((Number(totalAmount) / category.max_amount) * 100, 100);

              return (
              <Tr key={category.id}>
                <Td>{category.category_name}</Td>
                <Td>{formatAmount(category.max_amount, currency)}</Td>
                <Td>
                  <Tooltip
                    placement='top'
                    label={
                      <Text>
                        <p>{t('totalSpentToDate')}: {formatAmount(totalAmount, currency)}</p>
                        <p>{t('maximuValueStipulated')}: {formatAmount(category.max_amount, currency)}</p>
                      </Text>
                      }
                  >
                    <Stack>
                      <LightMode>
                        <Progress
                          borderRadius={5}
                          hasStripe
                          value={progressValue}
                        />
                      </LightMode>
                      <Text fontSize={11} style={{alignSelf: 'flex-end'}}>
                        {(progressValue).toFixed(2)}% / 100%
                      </Text>
                    </Stack>
                  </Tooltip>
                </Td>
                <Td display='flex' justifyContent='end'>
                  <Stack direction="row" spacing={2}>
                    <IconButton
                      variant='ghost'
                      aria-label={t('edit')}
                      _hover={{ bg: colorMode === 'dark' ? 'gray.600' : 'gray.300' }}
                      icon={<FaRegEdit size={22} color='#3a9e64' />}
                      onClick={() => handleEditCategory(category)}
                    />
                    <IconButton
                      variant='ghost'
                      aria-label={t('delete')}
                      _hover={{ bg: colorMode === 'dark' ? 'gray.600' : 'gray.300' }}
                      icon={<FaRegTrashAlt size={22} color='#b94a4a'/>}
                      onClick={() => {
                        setSelectedCategory(category);
                        setIsDeleteModalOpen(true);
                      }}
                    />
                  </Stack>
                </Td>
              </Tr>
              )
            })}
          </Tbody>
        </Table>

        {selectedCategory && (
          <ConfirmDeleteModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={() => handleDeleteCategory(selectedCategory)}
            type='category'
          />
        )}

        {selectedCategory && (
          <AddCategoryModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            category={selectedCategory}
            fetchCategories={fetchCategories}
            onCategoryUpdated={handleUpdateCategory}
          />
        )}
      </>
    );
  }
  