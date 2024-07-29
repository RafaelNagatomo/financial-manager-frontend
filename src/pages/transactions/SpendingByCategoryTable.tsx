import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaRegTrashAlt, FaRegEdit } from "react-icons/fa"
import { GiBoxUnpacking } from "react-icons/gi"
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
  VStack,
} from '@chakra-ui/react';
import { formatAmount } from '../../utils/formatAmount'
import { useCurrency } from '../../hooks/useCurrency';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';
import AddCategoryModal from '../../components/AddCategoryModal';
import { useCategories, Category } from '../../contexts/CategoryContext';
import { useTransactions, Transaction } from '../../contexts/TransactionContext';

interface SpendingByCategoryTableProps {
  transactions: Transaction[];
}

export const SpendingByCategoryTable: React.FC<SpendingByCategoryTableProps> = ({
  transactions,
}) => {
  const { t } = useTranslation();
  const { currency } = useCurrency();
  const { colorMode } = useColorMode();
  const { categories, fetchCategories, deleteCategory } = useCategories();
  const { fetchTransactions } = useTransactions();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [transactionCount, setTransactionCount] = useState<number>(0);
  const isCategoriesEmpty = categories.length === 0;

  const handleDeleteCategory = async (selectedCategory: Category, transactionCount: number) => {
    if (selectedCategory) {
      await deleteCategory(selectedCategory, transactionCount);
      fetchCategories();
      fetchTransactions();
      setIsDeleteModalOpen(false);
    }
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsAddModalOpen(true);
  };

  const getCategoryTotal = (categoryName: string) => {
    return transactions
      .filter(transaction => transaction.category_name === categoryName)
      .reduce((total, transaction) => total + Number(transaction.transaction_amount), 0);
  };

  const getCategoryTransactionCount = (categoryName: string) => {
    return transactions
      .filter(transaction => transaction.category_name === categoryName).length;
  };

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
          {!isCategoriesEmpty ? categories.map((category) => {
            const totalAmount = getCategoryTotal(category.category_name);
            const progressValue = Math.min((Number(totalAmount) / category.max_amount) * 100, 100);
            const transactionCount = getCategoryTransactionCount(category.category_name);
            const exceededLimit = totalAmount > category.max_amount;

            return (
              <Tr key={category.id}>
                <Td>{category.category_name}</Td>
                <Td>{formatAmount(category.max_amount, currency)}</Td>
                <Td>
                  <Tooltip
                    bg={exceededLimit ? 'red.600' : ''}
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
                          colorScheme={exceededLimit ? 'red' : 'purple'}
                        />
                      </LightMode>
                      <Text fontSize={11} style={{ alignSelf: 'flex-end' }}>
                        {
                          exceededLimit
                            ? <span style={{ color: 'red' }}>
                              {t('amountExceeded')}: {formatAmount(totalAmount - category.max_amount, currency)}
                            </span>
                            : `${(progressValue).toFixed(2)}% / 100%`
                        }
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
                      icon={<FaRegTrashAlt size={22} color='#b94a4a' />}
                      onClick={() => {
                        setSelectedCategory(category);
                        setTransactionCount(transactionCount);
                        setIsDeleteModalOpen(true);
                      }}
                    />
                  </Stack>
                </Td>
              </Tr>
            )
          }) : (
            <Tr>
              <Td colSpan={3} textAlign="center">
                <VStack
                  bg={colorMode === 'dark' ? 'gray.600' : 'gray.200'}
                  color={colorMode === 'dark' ? 'gray.700' : 'gray.400'}
                  h={200}
                  p={5}
                  borderRadius={6}
                  spacing={8}
                  justify='center'
                >
                  <GiBoxUnpacking size={50} />
                  <Text fontWeight='bold' fontSize='lg'>
                    {t('NoData')}
                  </Text>
                </VStack>
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
        
      {selectedCategory && (
        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={() => handleDeleteCategory(selectedCategory, transactionCount)}
          selectedCategory={selectedCategory.category_name}
          transactionCount={transactionCount}
          type='category'
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
