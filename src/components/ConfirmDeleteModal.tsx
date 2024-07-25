import React, { useRef } from 'react';
import { LuAlertTriangle } from "react-icons/lu"
import CustomButton from './CustomButton';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Text,
  Stack,
  HStack,
  Box,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next'
import { Transaction } from '../hooks/useTransactions';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  type?: 'transaction' | 'category';
  transactions?: Transaction[];
  selectedCategory?: string
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  type,
  transactions = [],
  selectedCategory,
}) => {
  const { t } = useTranslation()
  const cancelRef = useRef<any>(null);

  const getCategoryTransactionCount = (categoryName: string) => {
    return transactions
      .filter(transaction => transaction.category_name === categoryName).length;
  }
  const transactionCount = 
    type === 'category' && selectedCategory
      ? getCategoryTransactionCount(selectedCategory)
      : 0;

  return (
    <AlertDialog
      isOpen={isOpen}
      onClose={onClose}
      leastDestructiveRef={cancelRef}
      isCentered
    >
      <AlertDialogOverlay
        bg='blackAlpha.300'
        backdropFilter='blur(5px) hue-rotate(30deg)'
      >
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            <HStack gap={4}>
              <LuAlertTriangle color='orange' size={30} />
              <Box>
                {type === 'transaction' ? t('deleteTransaction') : t('deleteCategory')}
              </Box>
            </HStack>
          </AlertDialogHeader>

          <AlertDialogBody>
            {type === 'category' ? (
              transactionCount > 0 ? (
                <Stack gap={3}>
                  <Text>{t('there(p)')}
                    <Text as="span" fontWeight='bolder' mx={2}>{transactionCount}</Text>
                    {t('transações vinculado à categoria')}
                    <Text as="span" fontWeight='bolder' mx={2}>"{selectedCategory}"</Text>
                  </Text>
                  <Text>{t('areYouSureYouWantToDeleteThisCategory')}</Text>
                </Stack>
              ) : (
                t('areYouSureYouWantToDeleteThisCategory')
              )
            ) : (
              t('areYouSureYouWantToDeleteThisTransaction')
            )}
          </AlertDialogBody>

          <AlertDialogFooter gap={6}>
            <CustomButton title={t('cancel')} variant='outline' ref={cancelRef} onClick={onClose} />
            <CustomButton title={t('delete')} onClick={onConfirm} />
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}

export default ConfirmDeleteModal