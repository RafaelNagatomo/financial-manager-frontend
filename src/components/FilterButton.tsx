import { Button } from '@chakra-ui/react'
import { MdFilterAlt } from "react-icons/md"

const FilterButton = () => {
  return (
    <Button
    colorScheme="purple"
    w={6}
    pl={5}
    size="sm"
    _hover={{ bg: 'purple.400' }}
    leftIcon={<MdFilterAlt size={20} />}
  />
  )
}

export default FilterButton