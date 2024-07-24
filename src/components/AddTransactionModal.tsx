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
  RadioGroup,
  Stack,
  Radio,
  LightMode,
  Switch,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { Controller, useForm } from 'react-hook-form';
import CustomButton from './CustomButton';
import { useTranslation } from 'react-i18next';
import CategorySelect from './CategorySelect';
import { Transaction } from '../hooks/useTransactions';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransactionAdded?: (transaction: Transaction) => void;
  onTransactionUpdated?: (transaction: Transaction) => void;
  transaction?: Transaction;
  fetchTransactions?: () => Promise<void>;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  onTransactionAdded,
  onTransactionUpdated,
  transaction,
  fetchTransactions,
}) => {
  const { t } = useTranslation();
  const { control, handleSubmit, register, setValue, reset } = useForm<Transaction>();

  const handleTransactionSubmit = (data: Transaction) => {
    if (transaction && onTransactionUpdated) {
      onTransactionUpdated({ ...transaction, ...data });
    } else if (onTransactionAdded) {
      onTransactionAdded(data);
    }
    reset()
    onClose();
    fetchTransactions?.();
  };

  useEffect(() => {
    if (transaction) {
      reset(transaction);
    }
  }, [transaction, isOpen, reset]);

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
        <ModalHeader>{t('createNewTransaction')}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form id="add-transaction-form" onSubmit={handleSubmit(handleTransactionSubmit)}>
            <FormControl as="fieldset" my={5}>
              <FormLabel as="legend">{t('type')}</FormLabel>
              <RadioGroup defaultValue="expense">
                <Stack spacing={4} direction="row">
                  <Radio value="expense" {...register("transaction_type", { required: true })}>
                    {t('expense')}
                  </Radio>
                  <Radio value="income" {...register("transaction_type", { required: true })}>
                    {t('income')}
                  </Radio>
                </Stack>
              </RadioGroup>
            </FormControl>

            <FormControl isRequired my={5}>
              <FormLabel>{t('title')}</FormLabel>
              <Input placeholder={t('insertTitle')} {...register("transaction_name", { required: true })} />
            </FormControl>

            <FormControl my={5}>
              <FormLabel>{t('category')}</FormLabel>
              <Controller
                name="category_name"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <CategorySelect
                    value={value}
                    onChange={onChange}
                    placeholder={t('selectCategory')}
                  />
                )}
              />
            </FormControl>

            <FormControl isRequired my={5}>
              <FormLabel>{t('amount')}</FormLabel>
              <Controller
                name="transaction_amount"
                control={control}
                rules={{ required: t('thisFieldIsRequired') }}
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

            <FormControl my={5}>
              <FormLabel>{t('expirationDate')}</FormLabel>
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
