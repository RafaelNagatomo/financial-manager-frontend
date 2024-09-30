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
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form'
import useCustomToast from '../hooks/useCustomToast'
import CustomButton from './CustomButton';
import { useCategories, Category } from '../contexts/CategoryContext'
import { useTransactions } from '../contexts/TransactionContext';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category
}

  const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
    isOpen,
    onClose,
    category,
  }) => {
    const { t } = useTranslation();
    const { control, handleSubmit, register, reset, watch } = useForm<Category>();
    const { fetchCategories, addCategory, editCategory } = useCategories();
    const { refetchTransactions } = useTransactions();
    const { noticeToast } = useCustomToast();
    const watchedFields = watch();
    const isRequiredFieldsEmpty = !watchedFields.category_name || !watchedFields.max_amount;

    const handleCategorySubmit = async (data: Category) => {
      if (category) {
        await editCategory({ ...category, ...data });
        if (category.category_name !== data.category_name) {
          noticeToast(
            t('modifiedCategoryName'),
            `${t('transactionsLinkedToTheCategoryWillBeCalled')} "${data.category_name}".`
          );
        }
        refetchTransactions()
      } else {
        await addCategory(data);
      }
      
      reset();
      onClose();
      fetchCategories();
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
        <ModalHeader>
          {category ? t('editCategory') : t('createNewCategory')}
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <form id="add-category-form" onSubmit={handleSubmit(handleCategorySubmit)}>

            <FormControl isRequired my={5}>
              <FormLabel>{t('title')}</FormLabel>
              <Input
                placeholder={t('insertTitle')}
                {...register("category_name", { required: true })}
              />
            </FormControl>
            
            <FormControl isRequired my={5}>
              <FormLabel>{t('maxAmount')}</FormLabel>
              <Controller
                name="max_amount"
                control={control}
                render={({ field }) => (
                  <NumberInput
                    min={0}
                    value={field.value || undefined}
                    onChange={(value) => field.onChange(Number(value))}
                  >
                    <NumberInputField type="tel" />
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
          <CustomButton
            title={t('cancel')}
            variant='outline'
            onClick={onClose}
          />
          <CustomButton
            title={t('save')}
            type='submit'
            form='add-category-form'
            isDisabled={isRequiredFieldsEmpty}
            tooltipDisabled={isRequiredFieldsEmpty}
            tooltipLabel={t('fillInAllMandatoryFields')}
          />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddCategoryModal;
