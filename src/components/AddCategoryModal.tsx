import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import CustomButton from './CustomButton';
import { useTranslation } from 'react-i18next';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation()
  const initialRef = useRef(null);
  const finalRef = useRef(null);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (formData: any) => {
    const data = {
      ...formData,
      user_id: "3695f015-9880-4d70-98dc-3610c328357f"
    }
    try {
      const response = await fetch('http://localhost:3001/categories/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log('Category added successfully');
        onClose();
        window.location.reload()
      } else {
        console.error('Failed to add category');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Modal
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      isOpen={isOpen}
      onClose={onClose}
      isCentered
    >
      <ModalOverlay
        bg='blackAlpha.300'
        backdropFilter='blur(5px) hue-rotate(30deg)'
      />
      <ModalContent>
        <ModalHeader>{t('createNewCategory')}</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <form id="add-category-form" onSubmit={handleSubmit(onSubmit)}>

            <FormControl isRequired my={5}>
              <FormLabel>{t('title')}</FormLabel>
              <Input placeholder={t('title')} {...register("category_name", { required: true })} />
              {errors.name && <span>{t('thisFieldIsRequired')}</span>}
            </FormControl>
            
            <FormControl isRequired my={5}>
              <FormLabel>{t('maxAmount')}</FormLabel>
              <Input placeholder={t('maxAmount')} {...register("max_amount", { required: true })} />
              {errors.name && <span>{t('thisFieldIsRequired')}</span>}
            </FormControl>

          </form>
        </ModalBody>

        <ModalFooter gap={6}>
          <CustomButton title={t('cancel')} variant='outline' onClick={onClose} />
          <CustomButton title={t('save')} type='submit' form='add-category-form' />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddCategoryModal;
