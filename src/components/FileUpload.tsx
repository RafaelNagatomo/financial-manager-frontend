import {
  Input,
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
  FormErrorMessage,
  Icon
} from "@chakra-ui/react";
import { FiFile } from "react-icons/fi";
import { useController, Control, FieldValues, Path, FieldError } from "react-hook-form";
import { useRef, ReactNode } from "react";

interface FileUploadProps<T extends FieldValues> {
  name:  Path<T>;
  placeholder?: string;
  acceptedFileTypes?: string;
  control: Control<T>;
  children?: ReactNode;
  isRequired?: boolean;
}

export const FileUpload = <T extends Record<string, any>>({
  name,
  placeholder,
  acceptedFileTypes,
  control,
  children,
  isRequired = false
}: FileUploadProps<T>) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    field: { ref, onChange, value, ...inputProps },
    fieldState: { invalid, error }
  } = useController({
    name,
    control,
    rules: { required: isRequired },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onChange(e.target.files[0]);
    }
  };

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <FormControl isInvalid={invalid} isRequired={isRequired}>
      <FormLabel htmlFor={name}>{children}</FormLabel>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <Icon as={FiFile} />
        </InputLeftElement>
        <input
          type="file"
          accept={acceptedFileTypes}
          name={name}
          ref={inputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <Input
          style={{ cursor: 'pointer' }}
          placeholder={placeholder || "Your file ..."}
          onClick={handleClick}
          readOnly
          value={value ? (value as File).name : ""}
          {...inputProps}
        />
      </InputGroup>
      <FormErrorMessage>
        {error && (error as FieldError).message}
      </FormErrorMessage>
    </FormControl>
  );
};

export default FileUpload;
