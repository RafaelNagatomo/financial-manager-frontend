import { IconButton } from '@chakra-ui/react'
import { MdFilterAlt } from "react-icons/md"

const FilterButton = () => {
  return (
    <IconButton
      colorScheme="purple"
      aria-label='Filter'
      size="sm"
      _hover={{ bg: 'purple.400' }}
      icon={<MdFilterAlt size={20} />}
    />
  )
}

export default FilterButton