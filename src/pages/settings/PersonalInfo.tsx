import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaRegEdit } from 'react-icons/fa';
import { IoMdClose, IoMdCheckmark } from 'react-icons/io';
import {
  Flex,
  Spacer,
  Box,
  Text,
  Stack,
  useColorMode,
  LightMode,
  Input,
  ButtonGroup,
  IconButton,
  Editable,
  EditableInput,
  EditablePreview,
  useEditableControls,
} from '@chakra-ui/react';
import { useAuth } from '../../contexts/AuthContext';
import { useForm, Controller } from 'react-hook-form';
import CustomButton from '../../components/CustomButton';

interface FormValues {
  [key: string]: string;
}

const Settings: React.FC = () => {
  const { t } = useTranslation();
  const { colorMode } = useColorMode();
  const { user, editUser } = useAuth();

  const { control, handleSubmit, setValue, formState: { isSubmitting } } = useForm<FormValues>({
    defaultValues: {
      firstName: user?.first_name || '',
      lastName: user?.last_name || '',
      email: user?.email || '',
    },
  });

  const onSubmit = (data: FormValues) => {
    editUser(data.firstName, data.lastName, data.email);
  };

  function EditableControls() {
    const {
      isEditing,
      getSubmitButtonProps,
      getCancelButtonProps,
      getEditButtonProps,
    } = useEditableControls();

    return isEditing ? (
      <ButtonGroup justifyContent="end" size="sm" ml={2}>
        <LightMode>
          <IconButton
            aria-label="Submit"
            icon={<IoMdCheckmark />}
            {...getSubmitButtonProps()}
          />
        </LightMode>
        <LightMode>
          <IconButton
            aria-label="Cancel"
            icon={<IoMdClose />}
            {...getCancelButtonProps()}
          />
        </LightMode>
      </ButtonGroup>
    ) : (
      <Flex justifyContent="end">
        <LightMode>
          <IconButton
            aria-label="Edit"
            size="sm"
            icon={<FaRegEdit />}
            {...getEditButtonProps()}
          />
        </LightMode>
      </Flex>
    );
  }

  return (
    <Stack w={{ base: 330, md: 440, lg: 550 }}>
      <form id='update-info-form' onSubmit={handleSubmit(onSubmit)}>
        {['firstName', 'lastName', 'email'].map((key) => (
          <Box key={key} mb={5}>
            <Text fontSize={16}>{t(key)}</Text>
            <Controller
              name={key}
              control={control}
              render={({ field }) => (
                <Editable
                  defaultValue={field.value}
                  px="4px"
                  textAlign="start"
                  fontSize="xl"
                  isPreviewFocusable={false}
                  bg={colorMode === 'dark' ? 'gray.700' : 'whiteAlpha.500'}
                  borderRadius={6}
                  onSubmit={(value) => setValue(key, value)}
                >
                  <Flex alignItems="center">
                    <EditablePreview />
                    <Spacer />
                    <Input {...field} as={EditableInput} />
                    <EditableControls />
                  </Flex>
                </Editable>
              )}
            />
          </Box>
        ))}

        <CustomButton
          title={t('save')}
          w='100%'
          mt={5}
          isLoading={isSubmitting}
          type='submit'
          form='update-info-form'
        />
      </form>
    </Stack>
  );
};

export default Settings;
