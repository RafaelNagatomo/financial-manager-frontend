import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import { FaRegTrashAlt, FaRegEdit } from "react-icons/fa";
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
} from '@chakra-ui/react';
import { formatAmount } from '../../utils/formatAmount';
import { useCurrency } from '../../hooks/useCurrency';
import moment from 'moment';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';
import AddTransactionModal from '../../components/AddTransactionModal';
import { useTransactions, Transaction } from '../../contexts/TransactionContext';

export const TransactionTable: React.FC = () => {
  const { t } = useTranslation();
  const { currency } = useCurrency();
  const { colorMode } = useColorMode();
  const { transactions, deleteTransaction, editTransaction } = useTransactions();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [transactionsToPaidState, setTransactionsToPaidState] = useState(transactions);

  const handleDeleteTransaction = async () => {
    if (selectedTransaction) {
      await deleteTransaction(selectedTransaction);
      setIsDeleteModalOpen(false);
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
            <Th>{t('type')}</Th>
            <Th>{t('title')}</Th>
            <Th>{t('category')}</Th>
            <Th>{t('paid')}</Th>
            <Th>{t('value')}</Th>
            <Th>{t('date')}</Th>
            <Th>{t('actions')}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {transactions.map((transaction) => (
            <Tr
              key={transaction.id}
              sx={!transaction.categoryExists
                ? {
                    color: colorMode === 'dark' ? 'gray.600' : 'gray.400',
                    cursor: "not-allowed",
                    textDecoration: "line-through",
                  }
                : {}}
            >
              <Td>
                {
                  transaction.transaction_type === 'expense'
                    ? <FaArrowTrendDown color={!transaction.categoryExists ? '#693b3b' : '#b94a4a'} />
                    : <FaArrowTrendUp color={!transaction.categoryExists ? '#3f5749' : '#3a9e64'} />
                }
              </Td>
              <Td>{transaction.transaction_name}</Td>
              <Td>{transaction.transaction_type === 'income' ? t('income') : transaction.category_name}</Td>
              <Td>
                <LightMode>
                  <Switch
                    isChecked={transaction.paid}
                    isDisabled={!transaction.categoryExists}
                    onChange={(e) => handleTogglePaid(transaction.id, e.target.checked)}
                  />
                </LightMode>
              </Td>
              <Td>{formatAmount(transaction.transaction_amount, currency)}</Td>
              <Td>{moment(transaction.expiration_date).format('DD/MM/YYYY')}</Td>
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
            </Tr>
          ))}
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
