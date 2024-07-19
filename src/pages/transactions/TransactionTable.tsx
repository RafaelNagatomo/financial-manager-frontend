import React, { useState, useEffect, useRef } from 'react';
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
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react';
import { formatAmount } from '../../utils/formatAmount';
import { useCurrency } from '../../hooks/useCurrency';
import moment from 'moment';

export const TransactionTable: React.FC<{
  transactions: any[],
  t: (key: string) => string,
}> = ({
  transactions,
  t
}) => {
  const { currency } = useCurrency();
  const { colorMode }  = useColorMode();
  const [selectedTransaction, setSelectedTransaction] = useState<any | null>(null);
  const [transactionList, setTransactionList] = useState(transactions);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setTransactionList(transactions);
  }, [transactions]);

  const handleEdit = (transaction: any) => {
    setSelectedTransaction(transaction);
    console.log('Edit:', transaction);
  };

  const handleDelete = async () => {
    if (!selectedTransaction) return;

    try {
      const response = await fetch(`http://localhost:3001/transactions/delete/${selectedTransaction.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setTransactionList(transactionList.filter(item => item.id !== selectedTransaction.id));
        console.log('Delete successful:', selectedTransaction);
      } else {
        console.error('Failed to delete:', selectedTransaction);
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
    setIsDeleteModalOpen(false);
    setSelectedTransaction(null);
  };

  const openDeleteModal = (transaction: any) => {
    setSelectedTransaction(transaction);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedTransaction(null);
  };

  const renderType = (transaction: any) => {
    return transaction.transaction_type === 'expense' ? <FaArrowTrendDown color='#b94a4a'/> : <FaArrowTrendUp color='#3a9e64'/>;
  };

  return (
    <>
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
            <Th>{t('actions')}</Th>
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
                    onClick={() => openDeleteModal(transaction)}
                  />
                </Stack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <AlertDialog
        isOpen={isDeleteModalOpen}
        leastDestructiveRef={cancelRef}
        onClose={closeDeleteModal}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {t('deleteTransaction')}
            </AlertDialogHeader>

            <AlertDialogBody>
              {t('confirmationMessage')}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={closeDeleteModal}>
                {t('cancel')}
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                {t('delete')}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
