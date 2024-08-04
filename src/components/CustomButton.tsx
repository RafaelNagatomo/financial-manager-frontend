import React, { ReactElement, forwardRef } from 'react';
import {
  Button,
  LightMode,
  ButtonProps,
  Tooltip,
  useColorMode
} from '@chakra-ui/react';

interface CustomButtonProps extends ButtonProps {
  title?: string;
  leftIcon?: ReactElement;
  rightIcon?: ReactElement;
  tooltipDisabled?: boolean;
  tooltipLabel?: React.ReactNode;
}

const defaultIconSize = 18;

const getIconWithDefaultSize = (icon?: ReactElement): ReactElement | undefined => {
  return icon ? React.cloneElement(icon, { size: icon.props.size || defaultIconSize }) : undefined;
};

const CustomButton = forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({
    title,
    leftIcon,
    rightIcon,
    tooltipDisabled,
    tooltipLabel,
    ...props
  }, ref) => {
    const leftIconWithSize = getIconWithDefaultSize(leftIcon);
    const rightIconWithSize = getIconWithDefaultSize(rightIcon);
    const { colorMode } = useColorMode();

    return (
      <LightMode>
        <Tooltip
          bg={colorMode === 'dark' ? 'gray.100' : 'gray.700'}
          color={colorMode === 'dark' ? 'gray.700' : 'gray.100'}
          layerStyle={colorMode}
          hasArrow
          placement='top'
          label={tooltipLabel}
          isDisabled={!tooltipDisabled}
        >
          <Button
            leftIcon={leftIconWithSize}
            rightIcon={rightIconWithSize}
            ref={ref}
            {...props}
          >
            {title}
          </Button>
        </Tooltip>
      </LightMode>
    );
  }
);

export default CustomButton;
