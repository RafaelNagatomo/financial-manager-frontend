import { useEffect } from 'react';
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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { Controller, useForm } from 'react-hook-form'
import CustomButton from './CustomButton';
import { useTranslation } from 'react-i18next';
import { Category } from '../hooks/useCategories'

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryAdded?: (category: Category) => void;
  onCategoryUpdated?: (category: Category) => void;
  category?: Category;
  fetchCategories?: () => Promise<void>;
}

  const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
    isOpen,
    onClose,
    onCategoryAdded,
    onCategoryUpdated,
    category,
    fetchCategories,
  }) => {
    const { t } = useTranslation();
    const { control, handleSubmit, register, reset } = useForm<Category>();

    const handleCategorySubmit = (data: Category) => {
      if (category && onCategoryUpdated) {
        onCategoryUpdated({ ...category, ...data });
      } else if (onCategoryAdded) {
        onCategoryAdded(data);
      }
      reset()
      onClose();
      fetchCategories?.();
    };
  
    useEffect(() => {
      if (category) {
        reset(category);
      }
    }, [category, isOpen, reset]);

  return (
    <Modal
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
          <form id="add-category-form" onSubmit={handleSubmit(handleCategorySubmit)}>

            <FormControl isRequired my={5}>
              <FormLabel>{t('title')}</FormLabel>
              <Input placeholder={t('insertTitle')} {...register("category_name", { required: true })} />
            </FormControl>
            
            <FormControl isRequired my={5}>
              <FormLabel>{t('maxAmount')}</FormLabel>
              <Controller
                name="max_amount"
                control={control}
                rules={{
                  validate: value => {
                    if (value === 0) { return t('thisFieldIsRequired') }
                    return true;
                  }
                }}
                render={({ field }) => (
                  <NumberInput
                    min={0}
                    value={field.value || 0}
                    onChange={(value) => field.onChange(Number(value))}
                  >
                    <NumberInputField type="number" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                )}
              />
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
