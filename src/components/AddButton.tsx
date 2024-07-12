import { Button, LightMode } from '@chakra-ui/react'
import { FaPlus } from 'react-icons/fa6';

interface AddButtonProps {
  title?: string;
}

const AddButton: React.FC<AddButtonProps> = ({ title }) => {
  return (
    <LightMode>
      <Button
        leftIcon={<FaPlus size={18} />}
      >
        {title}
      </Button>
    </LightMode>
  )
}

export default AddButton