import { ReactElement } from 'react';
import { Button, LightMode, ButtonProps } from '@chakra-ui/react';
import React from 'react';

interface CustomButtonProps extends ButtonProps {
  title?: string;
  leftIcon?: ReactElement;
  rightIcon?: ReactElement;
  ref?: any
}

const defaultIconSize = 18;

const getIconWithDefaultSize = (icon?: ReactElement): ReactElement | undefined => {
  return icon ? React.cloneElement(icon, { size: icon.props.size || defaultIconSize }) : undefined;
};

const CustomButton: React.FC<CustomButtonProps> = ({ title, leftIcon, rightIcon, ref, ...props }) => {
  const leftIconWithSize = getIconWithDefaultSize(leftIcon);
  const rightIconWithSize = getIconWithDefaultSize(rightIcon);

  return (
    <LightMode>
      <Button
        leftIcon={leftIconWithSize}
        rightIcon={rightIconWithSize}
        ref={ref}
        {...props}
      >
        {title}
      </Button>
    </LightMode>
  );
};

export default CustomButton;
