import { IconButton, LightMode } from '@chakra-ui/react'
import { MdFilterAlt } from "react-icons/md"

const FilterButton = () => {
  return (
    <LightMode>
      <IconButton
        aria-label='Filter'
        icon={<MdFilterAlt size={20} />}
      />
    </LightMode>
  )
}

export default FilterButton