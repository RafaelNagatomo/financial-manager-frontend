import React, { useState, useEffect } from 'react';
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6"
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
  Switch,
  Text,
  useColorMode,
  LightMode,
  IconButton,
} from '@chakra-ui/react';
import { formatAmount } from '../../utils/formatAmount'
import { useCurrency } from '../../hooks/useCurrency';
import moment from 'moment';

export const TransactionTable: React.FC<{
  transactions: any[],
  t: (key: string) => string,
}> = ({
  transactions,
  t
}) => {
  const { currency } = useCurrency()
  const { colorMode }  = useColorMode();
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [transactionList, setTransactionList] = useState(transactions);

  useEffect(() => {
    setTransactionList(transactions);
  }, [transactions]);

  const handleEdit = (transaction: any) => {
    setSelectedTransaction(transaction);
    // Implemente a lógica para editar o item selecionado
    console.log('Edit:', transaction);
  };

  const handleDelete = async (transaction: any) => {
    try {
      const response = await fetch(`http://localhost:3001/transactions/delete/${transaction.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setTransactionList(transactionList.filter(item => item.id !== transaction.id));
        console.log('Delete successful:', transaction);
      } else {
        console.error('Failed to delete:', transaction);
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const renderType = (transaction: any) => {
    return transaction.transaction_type === 'expense' ? <FaArrowTrendDown color='#b94a4a'/> : <FaArrowTrendUp color='#3a9e64'/>;
  };

  return (
    <Table
      layerStyle={colorMode === 'dark' ? 'darkTable' : 'lightTable'}
      variant="unstyled"
      w={700}
      minW={350}
      borderRadius={8}
    >
      <Thead>
        <Tr>
          <Th>{t('type')}</Th>
          <Th>{t('title')}</Th>
          <Th>{t('category')}</Th>
          <Th>{t('paid')}</Th>
          <Th>{t('amount')}</Th>
          <Th>{t('expirationDate')}</Th>
        </Tr>
      </Thead>
      <Tbody>
        {transactions.map((transaction, index) => (
          <Tr key={index}>
            <Td>{renderType(transaction)}</Td>
            <Td>{transaction.transaction_name}</Td>
            <Td>{transaction.category_name}</Td>
            <Td>
              <LightMode>
                <Switch size="sm" isChecked={transaction.paid} />
              </LightMode>
            </Td>
            <Td>{formatAmount(transaction.transaction_amount, currency)}</Td>
            <Td>{moment(transaction.expiration_date).format('DD/MM/YYYY')}</Td>
            <Td>
              <Stack spacing={2} direction='row'>
                <IconButton
                  variant='ghost'
                  aria-label='Edit'
                  _hover={{ bg: colorMode === 'dark' ? 'gray.600' : 'gray.300' }}
                  icon={<FaRegEdit size={22} color='#3a9e64'/>}
                  onClick={() => handleEdit(transaction)}
                />
                <IconButton
                  variant='ghost'
                  aria-label='Trash'
                  _hover={{ bg: colorMode === 'dark' ? 'gray.600' : 'gray.300' }}
                  icon={<FaRegTrashAlt size={22} color='#b94a4a'/>}
                  onClick={() => handleDelete(transaction)}
                />
              </Stack>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export const SpendingByCategoryTable: React.FC<{
  spendingByCategory: any[],
  t: (key: string) => string,
}> = ({
  spendingByCategory,
  t
}) => {
  const { currency } = useCurrency()
  const { colorMode }  = useColorMode();

  return (
    <Table
      layerStyle={colorMode === 'dark' ? 'darkTable' : 'lightTable'}
      variant="unstyled"
      w={700}
      minW={350}
      borderRadius={8}
    >
      <Thead>
        <Tr>
          <Th>{t('title')}</Th>
          <Th>{t('maxAmount')}</Th>
          <Th w={250}>{t('progress')}</Th>
        </Tr>
      </Thead>
      <Tbody>
        {spendingByCategory.map((item, index) => (
          <Tr key={index}>
            <Td>{item.category_name}</Td>
            <Td>{formatAmount(item.max_amount, currency)}</Td>
            <Td>
              <Stack>
                <LightMode>
                  <Progress
                    borderRadius={5}
                    hasStripe
                    value={item.max_amount}
                  />
                </LightMode>
                <Text fontSize={11} style={{alignSelf: 'flex-end'}}>
                  ({(10).toFixed(1)}/100%)
                </Text>
              </Stack>
            </Td>
            <Td>
              <Stack spacing={2} direction='row'>
                <IconButton
                  variant='ghost'
                  aria-label='Edit'
                  _hover={{ bg: colorMode === 'dark' ? 'gray.600' : 'gray.300' }}
                  icon={<FaRegEdit size={22} color='#3a9e64'/>}
                />
                <IconButton
                  variant='ghost'
                  aria-label='Trash'
                  _hover={{ bg: colorMode === 'dark' ? 'gray.600' : 'gray.300' }}
                  icon={<FaRegTrashAlt size={22} color='#b94a4a'/>}
                />
              </Stack>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}

export const UpcomingPaymentsTable: React.FC<{
  upcomingPayments: any[],
  t: (key: string) => string,
}> = ({
  upcomingPayments,
  t
}) => {
  const { currency } = useCurrency()
  const { colorMode }  = useColorMode();

  return (
    <Table
      layerStyle={colorMode === 'dark' ? 'darkTable' : 'lightTable'}
      variant="unstyled"
      minW={350}
      borderRadius={8}
    >
      <Thead>
        <Tr>
          <Th>{t('description')}</Th>
          <Th>{t('amount')}</Th>
          <Th>{t('expireDate')}</Th>
        </Tr>
      </Thead>
      <Tbody>
        {upcomingPayments.map((item, index) => (
          <Tr key={index}>
            <Td>{item.description}</Td>
            <Td>{formatAmount(item.amount, currency)}</Td>
            <Td>{item.expirateDate}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};
