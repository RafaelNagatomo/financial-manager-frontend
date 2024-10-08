import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaRegTrashAlt, FaRegEdit, FaEllipsisV } from "react-icons/fa"
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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { formatAmount } from '../../utils/formatAmount'
import { getCategoryTotal } from '../../utils/getTotals'
import { useCurrency } from '../../hooks/useCurrency';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';
import AddCategoryModal from '../../components/AddCategoryModal';
import { useCategories, Category } from '../../contexts/CategoryContext';
import { Transaction, useTransactions } from '../../contexts/TransactionContext';
import { AnimatePresence, motion } from 'framer-motion';

const MotionTr = motion(Tr)

const animationVariants = {
  initial: { opacity: 0, y: -100 },
  animate: { opacity: 1, y: 0 },
  exit: {
    opacity: 0,
    scale: 0.2,
    transition: {duration: [0.4], ease: "backIn",}
  },
}

interface SpendingByCategoryTableProps {
  transactions: Transaction[];
}

export const SpendingByCategoryTable: React.FC<SpendingByCategoryTableProps> = ({
  transactions,
}) => {
  const { t } = useTranslation();
  const { currency } = useCurrency();
  const { colorMode } = useColorMode();
  const { categories, deleteCategory } = useCategories();
  const { refetchTransactions } = useTransactions();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [transactionCount, setTransactionCount] = useState<number>(0);
  const isCategoriesEmpty = categories.length === 0;
  const isMobile = window.innerWidth <= 768

  const handleDeleteCategory = async (selectedCategory: Category, transactionCount: number) => {
    if (selectedCategory) {
      await deleteCategory(selectedCategory, transactionCount);
      setIsDeleteModalOpen(false);
      refetchTransactions();
    }
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsAddModalOpen(true);
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
      >
        <Thead>
          <Tr>
            <Th>{t('title')}</Th>
            <Th>{t('maxAmount')}</Th>
            <Th p={1}>{t('progress')}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {!isCategoriesEmpty ? (
            <AnimatePresence>
              {categories.map((category) => {
                const totalAmount = getCategoryTotal(category.category_name, transactions);
                const progressValue = Math.min((Number(totalAmount) / category.max_amount) * 100, 100);
                const transactionCount = getCategoryTransactionCount(category.category_name);
                const exceededLimit = totalAmount > category.max_amount;

                return (
                  <MotionTr
                    key={category.id}
                    variants={animationVariants}
                    initial='initial'
                    animate='animate'
                    exit='exit'
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    _hover={{
                      backgroundColor: colorMode === 'dark' ? '#323e52' : '#dbe0e6',
                      transition: 'background-color 0.4s ease',
                    }}
                  >
                    <Td>{category.category_name === 'goals' ? t('goals') : category.category_name}</Td>
                    <Td>{formatAmount(category.max_amount, currency)}</Td>
                    {category.category_name !== 'goals' && (
                      <Td p={1}>
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
                                    <Td>{t('maximumValueStipulated')}</Td>
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
                    )}
                    {isMobile ? (
                      <Td display='flex' justifyContent='end' p={3}>
                        {category.category_name !== 'goals' && (
                          <Menu>
                            <MenuButton
                              as={IconButton}
                              aria-label="Options"
                              icon={<FaEllipsisV size={20} />}
                              variant='ghost'
                              _hover={{ bg: colorMode === 'dark' ? 'gray.600' : 'gray.300' }}
                            />
                            <MenuList>
                              <MenuItem
                                icon={<FaRegEdit size={18} color='#3a9e64' />}
                                onClick={() => handleEditCategory(category)}
                              >
                                {t('edit')}
                              </MenuItem>
                              <MenuItem
                                icon={<FaRegTrashAlt size={18} color='#b94a4a' />}
                                onClick={() => {
                                  setSelectedCategory(category);
                                  setTransactionCount(transactionCount);
                                  setIsDeleteModalOpen(true);
                                }}
                              >
                                {t('delete')}
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        )}
                      </Td>
                    ) : (
                      <Td display='flex' justifyContent='end'>
                        {category.category_name !== 'goals' && (
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
                        )}
                      </Td>
                    )}
                  </MotionTr>
                )
              })}
            </AnimatePresence>
          ) : (
            <Tr>
              <Td colSpan={3} textAlign="center">
                <VStack
                  bg={colorMode === 'dark' ? 'gray.600' : 'gray.200'}
                  color={colorMode === 'dark' ? 'gray.700' : 'gray.400'}
                  h={100}
                  p={5}
                  borderRadius={6}
                  justify='center'
                >
                  <GiBoxUnpacking size={30} />
                  <Text fontWeight='bold' fontSize='md'>
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
