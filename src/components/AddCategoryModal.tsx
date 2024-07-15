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

  const onSubmit = (data: any) => {
    console.log(data);
    onClose();
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
          <form onSubmit={handleSubmit(onSubmit)}>

            <FormControl isRequired my={5}>
              <FormLabel>{t('title')}</FormLabel>
              <Input placeholder={t('title')} {...register("name", { required: true })} />
              {errors.name && <span>{t('thisFieldIsRequired')}</span>}
            </FormControl>
            
            <FormControl isRequired my={5}>
              <FormLabel>{t('maxAmount')}</FormLabel>
              <Input placeholder={t('maxAmount')} {...register("name", { required: true })} />
              {errors.name && <span>{t('thisFieldIsRequired')}</span>}
            </FormControl>

          </form>
        </ModalBody>

        <ModalFooter gap={6}>
          <CustomButton title={t('save')} type='submit' form='add-category-form' />
          <CustomButton title={t('cancel')} variant='outline' onClick={onClose} />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddCategoryModal;
