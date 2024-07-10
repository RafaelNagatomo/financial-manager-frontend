import {
  Box,
  VStack,
  HStack,
  Text,
  Select,
  SelectProps,
} from '@chakra-ui/react';
import { useCurrency } from '../hooks/useCurrency'

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps extends SelectProps {
  marginTop?: number;
  marginBottom?: number;
  spacing?: number;
  label?: string;
  labelPosition?: 'top'
                | 'topStart'
                | 'topEnd'
                | 'bottom'
                | 'bottomStart'
                | 'bottomEnd'
                | 'right'
                | 'left'
  placeholder?: string
  options: Option[]
}

const isVerticalLabel = (position: string) => 
  [
    'top',
    'topStart',
    'topEnd',
    'bottom',
    'bottomStart',
    'bottomEnd'
  ].includes(position);

const getAlignment = (position: string) => {
  switch (position) {
    case 'topStart':
    case 'bottomStart':
      return 'flex-start';
    case 'topEnd':
    case 'bottomEnd':
      return 'flex-end';
    default:
      return 'center';
  }
};

const CustomSelect: React.FC<CustomSelectProps> = ({
  marginTop,
  marginBottom = 5,
  label,
  labelPosition = 'left',
  spacing = 2,
  placeholder,
  options,
  ...props
}) => {
  const { currency, setCurrency } = useCurrency()

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(event.target.value);
  };

  const StackComponent = isVerticalLabel(labelPosition) ? VStack : HStack;
  const labelText = <Text fontSize={18}>{label}</Text>;

  return (
    <Box marginBottom={marginBottom} marginTop={marginTop}>
      <StackComponent spacing={spacing} alignItems={getAlignment(labelPosition)}>
        {isVerticalLabel(labelPosition) && labelPosition.startsWith('top') && labelText}
        {labelPosition === 'left' && labelText}
        <Select
          value={currency}
          onChange={handleChange}
          placeholder={placeholder}
          size="md"
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        {isVerticalLabel(labelPosition) && labelPosition.startsWith('bottom') && labelText}
        {labelPosition === 'right' && labelText}
      </StackComponent>
    </Box>
  );
};

export default CustomSelect;
