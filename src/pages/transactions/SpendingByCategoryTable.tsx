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
  Heading,
} from '@chakra-ui/react';
import { formatAmount } from '../../utils/formatAmount'
import { useCurrency } from '../../hooks/useCurrency';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';
import AddCategoryModal from '../../components/AddCategoryModal';
import { useCategories, Category } from '../../contexts/CategoryContext';
import { Transaction } from '../../contexts/TransactionContext';

interface SpendingByCategoryTableProps {
  transactions: Transaction[];
}

export const SpendingByCategoryTable: React.FC<SpendingByCategoryTableProps> = ({
    transactions,
  }) => {
    const { t } = useTranslation();
    const { currency } = useCurrency();
    const { colorMode } = useColorMode();
    const { categories, fetchCategories, deleteCategory, editCategory } = useCategories();
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

    const getCategoryTransactionCount = (categoryName: string) => {
      return transactions
        .filter(transaction => transaction.category_name === categoryName).length;
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
              const transactionCount = getCategoryTransactionCount(category.category_name)
              
              return (
              <Tr key={category.id}>
                <Td>{category.category_name}</Td>
                <Td>{formatAmount(category.max_amount, currency)}</Td>
                <Td>
                  <Tooltip
                    hasArrow
                    placement='top'
                    label={
                      <Stack gap={1}>
                        <Heading size='sm' my={1}>{category.category_name}</Heading>
                        <Table size="xs" variant='unstyled'>
                          <Tbody>
                            <Tr>
                              <Td>{t('totalSpentToDate')}</Td>
                              <Td>{formatAmount(totalAmount, currency)}</Td>
                            </Tr>
                            <Tr>
                              <Td>{t('maximuValueStipulated')}</Td>
                              <Td>{formatAmount(category.max_amount, currency)}</Td>
                            </Tr>
                            <Tr>
                              <Td>{t('linkedTransaction', { count: transactionCount })}</Td>
                              <Td>{transactionCount === 0 ? '' : transactionCount}</Td>
                            </Tr>
                          </Tbody>
                        </Table>
                      </Stack>
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
            transactions={transactions}
            selectedCategory={selectedCategory.category_name}
          />
        )}

        {selectedCategory && (
          <AddCategoryModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            category={selectedCategory}
          />
        )}
      </>
    );
  }
  