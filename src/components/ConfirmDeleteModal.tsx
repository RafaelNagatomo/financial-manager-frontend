import React, { useRef } from 'react';
import CustomButton from './CustomButton';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next'

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type: 'transaction' | 'category';
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  type,
}) => {
  const { t } = useTranslation()
  const cancelRef = useRef<any>(null);

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
            {
              type === 'transaction'
              ? t('deleteTransaction')
              : t('deleteCategory')
            }
          </AlertDialogHeader>

          <AlertDialogBody>
            {
              type === 'transaction'
              ? t('areYouSureYouWantToDeleteThisTransaction')
              : t('areYouSureYouWantToDeleteThisCategory')
            }
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