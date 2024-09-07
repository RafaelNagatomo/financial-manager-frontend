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
import GoalSelect from './GoalsSelect';
import { useTransactions, Transaction } from '../contexts/TransactionContext';
import { useGoals, Goal } from '../contexts/GoalContext';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction?: Transaction;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  transaction,
}) => {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    register,
    setValue,
    reset,
    watch,
    getValues
  } = useForm<Transaction>();
  const { fetchTransactions, addTransaction, editTransaction } = useTransactions()
  const { goals, editGoal } = useGoals()
  const watchedFields = watch();
  const isRequiredFieldsEmpty =
    !watchedFields.transaction_type
    || !watchedFields.transaction_name
    || !watchedFields.transaction_amount
  const transactionType = watch('transaction_type');
  const isGoalTransaction = watchedFields.category_name === 'goals'

  const handleTransactionSubmit = async(data: Transaction) => {
    if (isGoalTransaction) {
      data.transaction_type = 'expense';
      const selectedGoal = goals.find(goal => Number(getValues('goal_id')) === goal.id);
      data.transaction_name = selectedGoal?.goal_name ?? "";
  
      const editingGoalData: Goal = {
        id: data.goal_id,
        amount_raised: data.transaction_amount,
        goal_name: selectedGoal?.goal_name
      };
      await editGoal(editingGoalData);
    } else if (transactionType === 'income') {
      data.category_name = 'income';
    }
  
    if (transaction) {
      await editTransaction({ ...transaction, ...data });
    } else {
      await addTransaction(data);
    }

    reset()
    onClose();
    fetchTransactions();
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
        <ModalHeader>
          {transaction ? t('editTransaction') : t('createNewTransaction')}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form
            id="add-transaction-form"
            onSubmit={handleSubmit(handleTransactionSubmit)}
          >

            <FormControl
              my={5}
              as="fieldset"
              isRequired={(
                !transaction || transaction?.categoryExists
              ) && !isGoalTransaction
              }
            >
              <FormLabel as="legend">{t('type')}</FormLabel>
              <RadioGroup
                defaultValue={
                  isGoalTransaction
                  ? "expense"
                  : transaction?.transaction_type
                  || undefined
                }
                isDisabled={(
                  transaction && !transaction?.categoryExists
                ) || isGoalTransaction
                }
              >
                <Stack spacing={4} direction="row">
                  <Radio value="expense" {...register("transaction_type")}>
                    {t('expense')}
                  </Radio>
                  <Radio value="income" {...register("transaction_type")}>
                    {t('income')}
                  </Radio>
                </Stack>
              </RadioGroup>
            </FormControl>

            {isGoalTransaction ? (
              <FormControl
                my={5}
                isRequired={isGoalTransaction}
              >
                <FormLabel>{t('goal')}</FormLabel>
                <Controller
                  name="goal_id"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <GoalSelect
                      value={value}
                      onChange={onChange}
                      placeholder={t('selectGoal')}
                    />
                  )}
                />
              </FormControl>
            ) : (
              <FormControl
                my={5}
                isRequired={(!transaction || transaction?.categoryExists) && !isGoalTransaction}
              >
                <FormLabel>{t('title')}</FormLabel>
                <Input
                  placeholder={t('insertTitle')}
                  {...register("transaction_name")}
                  isDisabled={transaction && !transaction?.categoryExists}
                />
              </FormControl>
            )}

            <FormControl
              my={5}
              isRequired={transaction && !transaction?.categoryExists}
            >
              <FormLabel>{t('category')}</FormLabel>
              <Controller
                name="category_name"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <CategorySelect
                    value={value}
                    onChange={onChange}
                    placeholder={t('selectCategory')}
                    isDisabled={transactionType === 'income'}
                  />
                )}
              />
            </FormControl>

            <FormControl
              my={5}
              isRequired={!transaction || transaction?.categoryExists}
            >
              <FormLabel>{t('amount')}</FormLabel>
              <Controller
                name="transaction_amount"
                control={control}
                render={({ field }) => (
                  <NumberInput
                    min={0}
                    value={field.value || undefined}
                    onChange={(value) => field.onChange(Number(value))}
                    isDisabled={transaction && !transaction?.categoryExists}
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

            <FormControl my={5}>
              <FormLabel>{t('expirationDate')}</FormLabel>
              <Input
                type="date" {...register("expiration_date")}
                isDisabled={transaction && !transaction?.categoryExists}
              />
            </FormControl>

            <FormControl my={5}>
              <FormLabel>{t('paid')}</FormLabel>
              <LightMode>
                <Switch
                  size="md"
                  {...register("paid")}
                  onChange={(e) => setValue("paid", e.target.checked)}
                  isDisabled={transaction && !transaction?.categoryExists}
                />
              </LightMode>
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
            form='add-transaction-form'
            isDisabled={
              (transaction && !transaction?.categoryExists) || isGoalTransaction
              ? !watchedFields.category_name
              : isRequiredFieldsEmpty
            }
            tooltipDisabled={
              isRequiredFieldsEmpty || !watchedFields.category_name
            }
            tooltipLabel={
              transaction && !transaction?.categoryExists
              ? t('Preencha uma categoria')
              : t('fillInAllMandatoryFields')
            }
          />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddTransactionModal;
