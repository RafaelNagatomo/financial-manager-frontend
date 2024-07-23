import React, { useState } from 'react';
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
import useTransactions, { Transaction } from '../../hooks/useTransactions';

interface TransactionTableProps {
  transactions: Transaction[];
  fetchTransactions: () => Promise<void>;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  fetchTransactions
}) => {
  const { t } = useTranslation();
  const { currency } = useCurrency();
  const { colorMode } = useColorMode();
  const { deleteTransaction, editTransaction } = useTransactions();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  const handleDeleteTransaction = async (transaction: Transaction) => {
    await deleteTransaction(transaction);
    fetchTransactions();
    setIsDeleteModalOpen(false);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsAddModalOpen(true);
  };

  const handleUpdateTransaction = async (transaction: Transaction) => {
    await editTransaction(transaction);
    fetchTransactions();
    setIsAddModalOpen(false);
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
            <Th>{t('type')}</Th>
            <Th>{t('title')}</Th>
            <Th>{t('category')}</Th>
            <Th>{t('status')}</Th>
            <Th>{t('value')}</Th>
            <Th>{t('date')}</Th>
            <Th>{t('actions')}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {transactions.map((transaction) => (
            <Tr key={transaction.id}>
              <Td>
                {transaction.transaction_type === 'expense' ? <FaArrowTrendDown color='#b94a4a'/> : <FaArrowTrendUp color='#3a9e64'/>}
              </Td>
              <Td>{transaction.transaction_name}</Td>
              <Td>{transaction.category_name}</Td>
              <Td>
                <LightMode>
                  <Switch isChecked={transaction.paid} />
                </LightMode>
              </Td>
              <Td>{formatAmount(transaction.transaction_amount, currency)}</Td>
              <Td>{moment(transaction.expiration_date).format('DD/MM/YYYY')}</Td>
              <Td>
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
                    icon={<FaRegTrashAlt size={22} color='#b94a4a'/>}
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
          onConfirm={() => handleDeleteTransaction(selectedTransaction)}
        />
      )}

      {selectedTransaction && (
        <AddTransactionModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          transaction={selectedTransaction}
          fetchTransactions={fetchTransactions}
          onTransactionUpdated={handleUpdateTransaction}
        />
      )}
    </>
  );
};
