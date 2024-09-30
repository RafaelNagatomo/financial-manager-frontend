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
import { Controller, useForm } from 'react-hook-form';
import useCustomToast from '../hooks/useCustomToast';
import CustomButton from './CustomButton';
import { useGoals, Goal } from '../contexts/GoalContext';
import { useTransactions } from '../contexts/TransactionContext';
import FileUpload from './FileUpload';

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal?: Goal;
}

const AddGoalModal: React.FC<AddGoalModalProps> = ({
  isOpen,
  onClose,
  goal,
}) => {
  const { t } = useTranslation();
  const { control, handleSubmit, register, reset, watch } = useForm<Goal>();
  const { fetchGoals, addGoal, editGoal } = useGoals();
  const { refetchTransactions } = useTransactions();
  const { noticeToast } = useCustomToast();
  const watchedFields = watch();
  const isRequiredFieldsEmpty = !watchedFields.goal_name || !watchedFields.goal_amount;

  const handleGoalSubmit: (data: Goal) => Promise<void> = async (data) => {
    if (goal) {
      await editGoal({ ...goal, ...data });
      if (goal.goal_name !== data.goal_name) {
        noticeToast(
          t('modifiedGoalName'),
          `${t('transactionsLinkedToTheGoalWillBeCalled')} "${data.goal_name}".`
        );
      }
      refetchTransactions()
    } else {
      await addGoal(data);
    }
    reset();
    onClose();
    fetchGoals();
  };

  useEffect(() => {
    if (goal) {
      reset(goal);
    }
  }, [goal, isOpen, reset]);

  return (
    <Modal
      size='lg'
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
          {goal ? t('editGoal') : t('createNewGoal')}
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <form id="add-goal-form" onSubmit={handleSubmit(handleGoalSubmit)}>
            <Controller
              name="goal_image"
              control={control}
              render={({ field }) => (
                <FileUpload
                  name={field.name}
                  control={control}
                  acceptedFileTypes="image/*"
                  placeholder={t('selectAnImage')}
                />
              )}
            />

            <FormControl isRequired my={5}>
              <FormLabel>{t('title')}</FormLabel>
              <Input
                placeholder={t('insertTitle')}
                {...register("goal_name", { required: true })}
              />
            </FormControl>

            <FormControl my={5}>
              <FormLabel>{t('description')}</FormLabel>
              <Input
                placeholder={t('insertDescription')}
                {...register("goal_description")}
              />
            </FormControl>
            
            <FormControl isRequired my={5}>
              <FormLabel>{t('goalAmount')}</FormLabel>
              <Controller
                name="goal_amount"
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

            <FormControl my={5}>
              <FormLabel>{t('goalDate')}</FormLabel>
              <Input
                type="date" {...register("goal_date")}
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
            form='add-goal-form'
            isDisabled={isRequiredFieldsEmpty}
            tooltipDisabled={isRequiredFieldsEmpty}
            tooltipLabel={t('fillInAllMandatoryFields')}
          />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddGoalModal;
