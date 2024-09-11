import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  Text,
  Stack,
  Input,
  IconButton,
  FormControl,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@chakra-ui/react';
import { useAuth } from '../../contexts/AuthContext';
import CustomButton from '../../components/CustomButton';

interface FormInputs {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

const Settings: React.FC = () =>  {
  const { t } = useTranslation()
  const { logout, changePassword } = useAuth();
  const { handleSubmit, register, watch, formState: { errors, isSubmitting } } = useForm<FormInputs>();
  const [showPassword, setShowPassword] = useState(false);
  const newPassword = watch('newPassword');
  const navigate = useNavigate()
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const handlePasswordChange = async (data: FormInputs) => {
    try {
      await changePassword(data.currentPassword, data.newPassword);
      onClose()
      logout()
      navigate('/auth')
    } catch (error) {
      onClose()
      console.error(error);
    }
  };

  const onSubmit = (data: FormInputs) => {
    onOpen();
  };

  return (
    <Stack gap={4} w={{ base: 330, md: 440, lg: 550 }}>
      <form id="change-password-form" onSubmit={handleSubmit(handlePasswordChange)}>
        <FormControl isRequired my={5} isInvalid={!!errors.currentPassword}>
          <Text fontSize={16}>{t('currentPassword')}</Text>
          <InputGroup>
            <Input
              placeholder={t('enterPassword')}
              type={showPassword ? 'text' : 'password'}
              {...register('currentPassword', { required: t('passwordRequired') })}
            />
            <InputRightElement width='4.5rem'>
              <IconButton
                aria-label='show'
                border='none'
                variant='outline'
                icon={showPassword ? <FaEye /> : <FaEyeSlash />}
                onClick={() => setShowPassword(!showPassword)}
              />
            </InputRightElement>
          </InputGroup>
          <FormErrorMessage>
            {errors.currentPassword && errors.currentPassword.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isRequired my={5} isInvalid={!!errors.newPassword}>
          <Text fontSize={16}>{t('newPassword')}</Text>
          <InputGroup>
            <Input
              placeholder={t('enterPassword')}
              type={showPassword ? 'text' : 'password'}
              {...register('newPassword', { required: t('passwordRequired') })}
            />
            <InputRightElement width='4.5rem'>
              <IconButton
                aria-label='show'
                border='none'
                variant='outline'
                icon={showPassword ? <FaEye /> : <FaEyeSlash />}
                onClick={() => setShowPassword(!showPassword)}
              />
            </InputRightElement>
          </InputGroup>
          <FormErrorMessage>
            {errors.newPassword && errors.newPassword.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isRequired my={5} isInvalid={!!errors.confirmNewPassword}>
          <Text fontSize={16}>{t('confirmNewPassword')}</Text>
          <InputGroup>
            <Input
              placeholder={t('enterPassword')}
              type={showPassword ? 'text' : 'password'}
              {...register('confirmNewPassword', {
                required: t('passwordRequired'),
                validate: value => value === newPassword || t('passwordsDoNotMatch')
              })}
            />
            <InputRightElement width='4.5rem'>
              <IconButton
                aria-label='show'
                border='none'
                variant='outline'
                icon={showPassword ? <FaEye /> : <FaEyeSlash />}
                onClick={() => setShowPassword(!showPassword)}
              />
            </InputRightElement>
          </InputGroup>
          <FormErrorMessage>
            {errors.confirmNewPassword && errors.confirmNewPassword.message}
          </FormErrorMessage>
        </FormControl>

        <CustomButton
          title={t('save')}
          w='100%'
          mt={5}
          isLoading={isSubmitting}
          type='button'
          form='change-password-form'
          onClick={handleSubmit(onSubmit)}
        />
      </form>

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
          <ModalHeader>{t('confirmChangePassword')}</ModalHeader>
          <ModalBody>
            <Text>{t('areYouSureChangePassword')}</Text>
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
              onClick={handleSubmit(handlePasswordChange)}
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  )
}

export default Settings
