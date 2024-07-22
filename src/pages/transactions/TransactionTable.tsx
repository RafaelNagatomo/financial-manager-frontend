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
  const { deleteTransaction } = useTransactions();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleDeleteTransaction = async (transactionId: number) => {
    await deleteTransaction(transactionId);
    fetchTransactions();
    setIsModalOpen(false);
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
                    // onClick={() => handleEdit(transaction)}
                  />
                  <IconButton
                    variant='ghost'
                    aria-label={t('delete')}
                    _hover={{ bg: colorMode === 'dark' ? 'gray.600' : 'gray.300' }}
                    icon={<FaRegTrashAlt size={22} color='#b94a4a'/>}
                    onClick={() => {
                      setSelectedTransaction(transaction);
                      setIsModalOpen(true);
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
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={() => handleDeleteTransaction(selectedTransaction.id)}
        />
      )}
    </>
  );
};
