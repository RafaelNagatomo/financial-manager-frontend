import {
  Input,
  FormControl,
  FormLabel,
  InputGroup,
  FormErrorMessage,
  Image,
} from "@chakra-ui/react";
import { useController, Control, FieldValues, Path, FieldError } from "react-hook-form";
import { useRef, ReactNode, useState } from "react";

interface FileUploadProps<T extends FieldValues> {
  name: Path<T>;
  placeholder?: string;
  acceptedFileTypes?: string;
  control?: Control<T>;
  children?: ReactNode;
  isRequired?: boolean;
  display?: 'none' | 'block' | 'flex';
}

export const FileUpload = <T extends Record<string, any>>({
  name,
  placeholder,
  acceptedFileTypes,
  control,
  children,
  isRequired = false,
  display
}: FileUploadProps<T>) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>(undefined);
  const {
    field: { ref, onChange, value, ...inputProps },
    fieldState: { invalid, error }
  } = useController({
    name,
    control,
    rules: { required: isRequired },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
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
        <input
          type="file"
          accept={acceptedFileTypes}
          name={name}
          ref={inputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        {preview ? (
          <Image
            src={preview}
            alt="Preview"
            w='100%'
            h={250}
            style={{ cursor: 'pointer', display: display }}
            onClick={handleClick}
          />
        ) : (
          <Input
            pl={150}
            pt={10}
            h={250}
            style={{ cursor: 'pointer', display: display }}
            placeholder={placeholder || "Your file ..."}
            onClick={handleClick}
            readOnly
            value={value ? (value as File).name : ""}
            {...inputProps}
          />
        )}
      </InputGroup>
      <FormErrorMessage>
        {error && (error as FieldError).message}
      </FormErrorMessage>
    </FormControl>
  );
};

export default FileUpload;
