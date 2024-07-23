import { useToast } from '@chakra-ui/react';

const useCustomToast = () => {
  const toast = useToast();

  const showToast = (title: string, status: 'success' | 'error' | 'warning' | 'info') => {
    toast({
      title,
      status,
      isClosable: true,
      duration: 5000,
      position: 'bottom-right',
    });
  };

  return showToast;
};

export default useCustomToast;
