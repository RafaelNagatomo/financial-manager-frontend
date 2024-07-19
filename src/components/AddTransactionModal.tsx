import React, { useRef } from 'react';
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
  RadioGroup,
  Stack,
  Radio,
  Select,
  Switch,
  LightMode,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import CustomButton from './CustomButton';
import { useTranslation } from 'react-i18next';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation()
  const initialRef = useRef(null);
  const finalRef = useRef(null);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  const onSubmit = async (formData: any) => {
    const data = {
      ...formData,
      user_id: "3695f015-9880-4d70-98dc-3610c328357f",
      expiration_date: formData.expiration_date ? new Date(formData.expiration_date).toISOString() : null,
    }
    try {
      const response = await fetch('http://localhost:3001/transactions/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log('Transaction added successfully');
        onClose();
        window.location.reload()
      } else {
        console.error('Failed to add transaction');
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
        <ModalHeader>{t('createNewTransaction')}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form id="add-transaction-form" onSubmit={handleSubmit(onSubmit)}>
            
            <FormControl as="fieldset" my={5}>
              <FormLabel as="legend">
                {t('type')}
              </FormLabel>
              <RadioGroup defaultValue="expense">
                <Stack spacing={4} direction="row">
                  <Radio
                    value="expense"
                    {...register("transaction_type", { required: true })}
                  >
                    {t('expense')}
                  </Radio>
                  <Radio
                    value="income"
                    {...register("transaction_type", { required: true })}
                  >
                    {t('income')}
                  </Radio>
                </Stack>
              </RadioGroup>
            </FormControl>

            <FormControl isRequired my={5}>
              <FormLabel>{t('title')}</FormLabel>
              <Input placeholder={t('title')} {...register("transaction_name", { required: true })} />
              {errors.name && <span>{t('thisFieldIsRequired')}</span>}
            </FormControl>

            <FormControl my={5}>
              <FormLabel>{t('category')}</FormLabel>
              <Select placeholder="Select category" {...register("category_name", { required: true })}>
                <option value="food">Food</option>
              </Select>
            </FormControl>

            <FormControl isRequired my={5}>
              <FormLabel>{t('amount')}</FormLabel>
              <Input placeholder={t('amount')} {...register("transaction_amount", { required: true })} />
              {errors.name && <span>{t('thisFieldIsRequired')}</span>}
            </FormControl>

            <FormControl my={5}>
              <FormLabel>{t('date')}</FormLabel>
              <Input type="date" {...register("expiration_date")} />
            </FormControl>

            <FormControl my={5}>
              <FormLabel>{t('paid')}</FormLabel>
              <LightMode>
                <Switch 
                  size="md" 
                  {...register("paid")}
                  onChange={(e) => setValue("paid", e.target.checked)}
                />
              </LightMode>
            </FormControl>

          </form>
        </ModalBody>

        <ModalFooter gap={6}>
          <CustomButton title={t('cancel')} variant='outline' onClick={onClose} />
          <CustomButton title={t('save')} type='submit' form='add-transaction-form' />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddTransactionModal;
