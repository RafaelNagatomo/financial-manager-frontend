import { useToast, UseToastOptions } from '@chakra-ui/react';

const useCustomToast = () => {
  const toast = useToast();

  type Position = 'top-right' | 'bottom-right' | 'bottom-left' | 'top-left';
  type Status = 'success' | 'error' | 'warning' | 'info';

  const shortToast = (
    description: string,
    status: Status = 'info',
    duration: number = 5000,
    position: Position = 'bottom-right'
  ) => {
    toast({
      description,
      status,
      duration,
      isClosable: true,
      position,
    } as UseToastOptions);
  };

  const noticeToast = (
    title: string,
    description: string,
    status: Status = 'warning',
    duration: number = 10000,
    position: Position = 'top-right'
  ) => {
    toast({
      title,
      description,
      status,
      duration,
      isClosable: true,
      position,
    } as UseToastOptions);
  };

  return { shortToast, noticeToast };
};

export default useCustomToast;