import {
  FormControl,
  InputBaseComponentProps,
  InputLabel,
  OutlinedInput,
  SxProps,
  Theme,
} from "@mui/material";
import ErrorMessage from "../../UI/ErrorMessage";
import COLORS from "../../../constants/colors";

type Props = {
  id: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formik: any;
  type?: string;
  variant?: "standard" | "outlined" | "filled";
  sx?: SxProps<Theme>;
  className?: string;
  multiline?: boolean;
  minRows?: number;
  maxRows?: number;
  maxLength?: number;
  disabled?: boolean;
  defaultOutlineColor?: string;
  hoverOutlineColor?: string;
  focusedOutlineColor?: string;
  inputProps?: InputBaseComponentProps;
};

const Input: React.FC<Props> = (props) => {
  const {
    id,
    label,
    formik,
    type,
    variant,
    sx,
    className,
    multiline,
    minRows,
    maxRows,
    maxLength,
    disabled,
    defaultOutlineColor,
    hoverOutlineColor,
    focusedOutlineColor,
    inputProps,
  } = props;
  const { touched, errors } = formik;

  const errorMessage = touched[id] && errors[id] ? errors[id].toString() : null;

  return (
    <FormControl
      className={className}
      variant={variant || "outlined"}
      sx={{
        width: "80%",
        mt: !errorMessage ? "0.5rem" : 0,
        mb: !errorMessage ? "0.5rem" : 0,
        ...sx,
      }}
    >
      <InputLabel
        htmlFor={id}
        sx={{
          "&.Mui-focused": {
            color: "dimgray",
          },
        }}
      >
        {label}
      </InputLabel>
      <OutlinedInput
        inputProps={{
          maxLength,
          style: { textAlign: "justify" },
          ...inputProps,
        }}
        id={id}
        label={label}
        type={type || "text"}
        error={!!errorMessage}
        multiline={multiline}
        minRows={minRows}
        maxRows={maxRows}
        disabled={disabled}
        {...formik.getFieldProps(id)}
        sx={{
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: errorMessage
              ? "red"
              : defaultOutlineColor || COLORS.gray100,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: errorMessage
              ? "red"
              : hoverOutlineColor || COLORS.gray500,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: errorMessage
              ? "red"
              : focusedOutlineColor || COLORS.gray500,
          },
        }}
      />
      {errorMessage && (
        <ErrorMessage
          message={errorMessage}
          sx={{ mt: "0.4rem" }}
          alertStyle={{ flex: 1 }}
        />
      )}
    </FormControl>
  );
};

export default Input;
