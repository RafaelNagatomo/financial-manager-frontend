import React, { useRef } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  RadioGroup,
  Stack,
  Radio,
  Select,
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
        <ModalHeader>{t('createNewTransaction')}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            
            <FormControl as="fieldset" isRequired my={5}>
              <FormLabel as="legend">
                {t('type')}
              </FormLabel>
              <RadioGroup defaultValue="expense">
                <Stack spacing={4} direction="row">
                  <Radio
                    value="expense"
                    {...register("type", { required: true })}
                  >
                    {t('expense')}
                  </Radio>
                  <Radio
                    value="income"
                    {...register("type", { required: true })}
                  >
                    {t('income')}
                  </Radio>
                </Stack>
              </RadioGroup>
              {errors.type && <span>{t('thisFieldIsRequired')}</span>}
            </FormControl>

            <FormControl isRequired my={5}>
              <FormLabel>{t('title')}</FormLabel>
              <Input placeholder={t('title')} {...register("name", { required: true })} />
              {errors.name && <span>{t('thisFieldIsRequired')}</span>}
            </FormControl>

            <FormControl isRequired my={5}>
              <FormLabel>{t('category')}</FormLabel>
              <Select placeholder="Select category" {...register("category", { required: true })}>
                <option value="food">Food</option>
              </Select>
              {errors.category && <span>{t('thisFieldIsRequired')}</span>}
            </FormControl>

            <FormControl isRequired my={5}>
              <FormLabel>{t('date')}</FormLabel>
              <Input type="date" {...register("date", { required: true })} />
              {errors.date && <span>{t('thisFieldIsRequired')}</span>}
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

export default AddTransactionModal;
