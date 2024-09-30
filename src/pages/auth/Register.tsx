import { useTranslation } from 'react-i18next';
import { IoIosArrowBack } from "react-icons/io"
import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  Input,
  Stack,
  FormControl,
  FormErrorMessage,
  IconButton,
} from '@chakra-ui/react';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import CustomButton from '../../components/CustomButton';
import { AnimatePresence, motion } from 'framer-motion'

const MotionCard = motion(Card)

const animationVariants = {
  initial: { opacity: 0, x: -300 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 300, transition: { duration: 0.5, ease: "easeInOut" } }
}

interface LoginFormInputs {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

const Register: React.FC<{onSwitch: () => void}> = ({ onSwitch }) =>  {
  const { t } = useTranslation()
  const { handleSubmit, register, formState: { errors, isSubmitting } } = useForm<LoginFormInputs>();
  const { registerUser } = useAuth();

  const handleRegisterSubmit = async (data: LoginFormInputs) => {
    try {
      await registerUser(data.first_name, data.last_name, data.email, data.password);
      onSwitch()
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AnimatePresence>
      <MotionCard
        w={500}
        h={550}
        p={8}
        m={5}
        zIndex={3}
        align='center'
        bg='rgba(255, 255, 255, 0.075)'
        backdropFilter="blur(7px)"
        position='relative'
        variants={animationVariants}
        initial='initial'
        animate='animate'
        exit='exit'
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <IconButton
          aria-label="Back to Login"
          icon={<IoIosArrowBack size={30}/>}
          onClick={onSwitch}
          variant="ghost"
          position='absolute'
          top={0}
          left={0}
          m='10px 0 0 10px'
          py={10}
        />
        <CardHeader display="flex" alignItems="center">
          <Heading as="h2" size={{ base: "xl", md: "xl"}}>
            {t('register')}
          </Heading>
        </CardHeader>

        <CardBody alignContent='center' w='100%'>
          <form id="register-form" onSubmit={handleSubmit(handleRegisterSubmit)}>
            <Stack gap={4}>
              <FormControl isRequired isInvalid={!!errors.first_name}>
                <Text>{t('firstName')}</Text>
                <Input
                  placeholder={t('firstName')}
                  type='text'
                  {...register('first_name', { required: t('firstNameRequired') })}
                />
                <FormErrorMessage>
                  {errors.first_name && errors.first_name.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isRequired isInvalid={!!errors.last_name}>
                <Text>{t('lastName')}</Text>
                <Input
                  placeholder={t('lastName')}
                  type='text'
                  {...register('last_name', { required: t('lastNameRequired') })}
                />
                <FormErrorMessage>
                  {errors.last_name && errors.last_name.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isRequired isInvalid={!!errors.email}>
                <Text>{t('email')}</Text>
                <Input
                  placeholder={t('email')}
                  type='email'
                  {...register('email', { required: t('emailRequired') })}
                />
                <FormErrorMessage>
                  {errors.email && errors.email.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isRequired isInvalid={!!errors.password}>
                <Text>{t('Password')}</Text>
                <Input
                  placeholder={t('enterPassword')}
                  type='password'
                  {...register('password', { required: t('passwordRequired') })}
                />
                <FormErrorMessage>
                  {errors.password && errors.password.message}
                </FormErrorMessage>
              </FormControl>
            </Stack>
          </form>

          <CustomButton
            title={t('Ok')}
            mt={10}
            w='100%'
            type='submit'
            form='register-form'
            isLoading={isSubmitting}
            onClick={onSwitch}
          />
        </CardBody>
      </MotionCard>
    </AnimatePresence>
  );
};

export default Register;
