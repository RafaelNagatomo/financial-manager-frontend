import { Button } from '@chakra-ui/react'
import { FaPlus } from 'react-icons/fa6';

interface AddButtonProps {
  title?: string;
}

const AddButton: React.FC<AddButtonProps> = ({ title }) => {
  return (
    <Button
      colorScheme="purple"
      size="sm"
      _hover={{ bg: 'purple.400' }}
      leftIcon={<FaPlus size={18} />}
    >
      {title}
    </Button>
  )
}

export default AddButton