import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import { FaRegTrashAlt, FaRegEdit, FaEllipsisV } from "react-icons/fa";
import { GiBoxUnpacking } from "react-icons/gi";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Stack,
  Switch,
  useColorMode,
  LightMode,
  IconButton,
  Text,
  VStack,
  Menu,
  MenuList,
  MenuItem,
  MenuButton,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatAmount } from '../../utils/formatAmount';
import { useCurrency } from '../../hooks/useCurrency';
import moment from 'moment';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';
import AddTransactionModal from '../../components/AddTransactionModal';
import { useTransactions, Transaction } from '../../contexts/TransactionContext';

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

export const TransactionTable: React.FC = () => {
  const { t } = useTranslation();
  const { currency } = useCurrency();
  const { colorMode } = useColorMode();
  const { transactions, deleteTransaction, editTransaction } = useTransactions();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [transactionsToPaidState, setTransactionsToPaidState] = useState(transactions);
  const isTransactionsEmpty = transactions.length === 0;
  const isMobile = window.innerWidth <= 768

  const handleDeleteTransaction = async () => {
    if (selectedTransaction) {
      await deleteTransaction(selectedTransaction);
      setIsDeleteModalOpen(false);
      setSelectedTransaction(null)
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsAddModalOpen(true);
  };

  const handleTogglePaid = async (transactionId: string, paid: boolean) => {
    const updatedTransactions = transactionsToPaidState.map((t) =>
      t.id === transactionId ? { ...t, paid } : t
    );
    setTransactionsToPaidState(updatedTransactions);

    try {
      const transactionToUpdate = updatedTransactions.find((t) => t.id === transactionId);
      if (transactionToUpdate) {
        await editTransaction(transactionToUpdate);
      }
    } catch (error) {}
  };

  useEffect(() => {
    setTransactionsToPaidState(transactions);
  }, [transactions]);

  return (
    <>
      <Table
        layerStyle={colorMode === 'dark' ? 'darkTable' : 'lightTable'}
        variant="unstyled"
        borderRadius={8}
      >
        <Thead>
          <Tr>
            {!isMobile && (<Th>{t('type')}</Th>)}
            <Th>{t('title')}</Th>
            <Th p={{ base: 1 }}>{t('category')}</Th>
            {!isMobile && (<Th>{t('paid')}</Th>)}
            <Th p={{ base: 2 }}>{t('value')}</Th>
            {!isMobile && (<Th>{t('expirationDate')}</Th>)}
            {!isMobile && (<Th>{t('actions')}</Th>)}
          </Tr>
        </Thead>
        <Tbody>
          <AnimatePresence>
            {!isTransactionsEmpty ? transactions.map(transaction => (
              <MotionTr
                key={transaction.id}
                variants={animationVariants}
                initial='initial'
                animate='animate'
                exit='exit'
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
                _hover={{
                  backgroundColor: colorMode === 'dark' ? '#323e52' : '#dbe0e6',
                  transition: 'background-color 0.4s ease',
                }}
                sx={!transaction.categoryExists
                  ? {
                      color: colorMode === 'dark' ? 'gray.600' : 'gray.400',
                      cursor: "not-allowed",
                      textDecoration: "line-through",
                    }
                  : {}
                }
              >
                {!isMobile && (
                  <Td>
                      {transaction.transaction_type === 'expense'
                        ? <FaArrowTrendDown color={!transaction.categoryExists ? '#693b3b' : '#b94a4a'} />
                        : <FaArrowTrendUp color={!transaction.categoryExists ? '#3f5749' : '#3a9e64'} />}
                  </Td>
                )}
                <Td>{transaction.transaction_name}</Td>
                <Td p={{ base: 1 }}>{
                  transaction.transaction_type === 'income'
                  ? t('income')
                  : transaction.category_name === 'goals'
                  ? t('goals')
                  : transaction.category_name
                }</Td>
                {!isMobile && (
                  <Td>
                    <LightMode>
                      <Switch
                        isChecked={transaction.paid}
                        isDisabled={!transaction.categoryExists}
                        onChange={(e) => handleTogglePaid(transaction.id, e.target.checked)}
                      />
                    </LightMode>
                  </Td>
                )}
                <Td p={{ base: 2 }}>{formatAmount(transaction.transaction_amount, currency)}</Td>

                {!isMobile && (
                  <Td>{transaction.expiration_date ? moment(transaction.expiration_date).format('DD/MM/YYYY') : t('noDate')}</Td>
                )}

                {isMobile ? (
                  <Td display='flex' justifyContent='end' p={{ base: 1 }}>
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
                          onClick={() => handleEditTransaction(transaction)}
                        >
                          {t('edit')}
                        </MenuItem>
                        <MenuItem
                          icon={<FaRegTrashAlt size={18} color='#b94a4a' />}
                          onClick={() => {
                            setSelectedTransaction(transaction);
                            setIsDeleteModalOpen(true);
                          }}
                        >
                          {t('delete')}
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Td>
                ) : (
                  <Td display='flex' justifyContent='end'>
                    <Stack direction="row" spacing={2}>
                      <IconButton
                        variant='ghost'
                        aria-label={t('edit')}
                        _hover={{ bg: colorMode === 'dark' ? 'gray.600' : 'gray.300' }}
                        icon={<FaRegEdit size={22} color='#3a9e64' />}
                        onClick={() => handleEditTransaction(transaction)}
                      />
                      <IconButton
                        variant='ghost'
                        aria-label={t('delete')}
                        _hover={{ bg: colorMode === 'dark' ? 'gray.600' : 'gray.300' }}
                        icon={<FaRegTrashAlt size={22} color='#b94a4a' />}
                        onClick={() => {
                          setSelectedTransaction(transaction);
                          setIsDeleteModalOpen(true);
                        }}
                      />
                    </Stack>
                  </Td>
                )}
              </MotionTr>
            )) : (
              <Tr>
                <Td colSpan={7} textAlign="center">
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
          </AnimatePresence>
        </Tbody>
      </Table>

      {selectedTransaction && (
        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteTransaction}
          type='transaction'
        />
      )}

      {selectedTransaction && (
        <AddTransactionModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          transaction={selectedTransaction}
        />
      )}
    </>
  );
};

export default TransactionTable;
