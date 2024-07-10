import { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  InputProps,
} from '@chakra-ui/react';

interface CustomInputProps extends InputProps {
  marginBottom?: number;
  spacing?: number;
  label?: string;
  labelPosition?:
      'top'
    | 'topStart'
    | 'topEnd'
    | 'bottom'
    | 'bottomStart'
    | 'bottomEnd'
    | 'right'
    | 'left';
  placeholder?: string
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

const CustomInput: React.FC<CustomInputProps> = ({
  marginBottom = 5,
  label,
  labelPosition = 'left',
  spacing = 2,
  placeholder,
  ...props
}) => {
  const [value, setValue] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const StackComponent = isVerticalLabel(labelPosition) ? VStack : HStack;
  const labelText = <Text fontSize={18}>{label}</Text>;

  return (
    <Box marginBottom={marginBottom}>
      <StackComponent spacing={spacing} alignItems={getAlignment(labelPosition)}>
        {isVerticalLabel(labelPosition) && labelPosition.startsWith('top') && labelText}
        {labelPosition === 'left' && labelText}
        <Input
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          size="md"
          {...props}
        />
        {isVerticalLabel(labelPosition) && labelPosition.startsWith('bottom') && labelText}
        {labelPosition === 'right' && labelText}
      </StackComponent>
    </Box>
  );
};

export default CustomInput;
