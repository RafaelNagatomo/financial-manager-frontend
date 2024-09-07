import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaEye, FaEyeSlash  } from "react-icons/fa";
import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  HStack,
  Text,
  Divider,
  FormControl,
  FormErrorMessage,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import CustomButton from '../../components/CustomButton';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { AnimatePresence, motion } from 'framer-motion'

const MotionCard = motion(Card)

const animationVariants = {
  initial: { opacity: 0, x: 300 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -300, transition: { duration: 0.5, ease: "easeInOut" } }
}

interface LoginFormInputs {
  email: string;
  password: string;
}

const Login: React.FC<{onSwitch: () => void}> = ({ onSwitch }) => {
  const { t } = useTranslation();
  const { handleSubmit, register, formState: { errors, isSubmitting } } = useForm<LoginFormInputs>();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false)

  const handleLoginSubmit = async (data: LoginFormInputs) => {
    try {
      await login(data.email, data.password);
      navigate('/loading');
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
        zIndex={3}
        m='auto'
        align='center'
        bg='rgba(255, 255, 255, 0.075)'
        backdropFilter="blur(7px)"
        variants={animationVariants}
        initial='initial'
        animate='animate'
        exit='exit'
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <CardHeader>
          <Heading as="h2" size="2xl">
            {t('Login')}
          </Heading>
        </CardHeader>

        <CardBody alignContent='center' w='100%'>
          <form id="login-form" onSubmit={handleSubmit(handleLoginSubmit)}>
            <FormControl isRequired my={5} isInvalid={!!errors.email}>
              <Input
                placeholder={t('email')}
                type='email'
                {...register('email', { required: t('emailRequired') })}
              />
              <FormErrorMessage>
                {errors.email && errors.email.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isRequired my={5} isInvalid={!!errors.password}>
              <InputGroup>
                <Input
                  placeholder={t('enterPassword')}
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', { required: t('passwordRequired') })}
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
                {errors.password && errors.password.message}
              </FormErrorMessage>
            </FormControl>

            <CustomButton
              title={t('Login')}
              w='100%'
              isLoading={isSubmitting}
              type='submit'
              form='login-form'
            />
          </form>

          <HStack my={6}>
            <Divider borderWidth='1.5px' borderColor='black.500'/>
            <Text p={2}>{t('or')}</Text>
            <Divider borderWidth='1.5px' borderColor='black.500'/>
          </HStack>

          <CustomButton
            title={t('register')}
            w='100%'
            onClick={onSwitch}
          />
        </CardBody>
      </MotionCard>
    </AnimatePresence>
  );
};

export default Login;
