import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import React, { useState } from "react";

import ErrorMessage from "../../UI/ErrorMessage";

type Props = {
  id: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formik: any;
  defaultOutlineColor?: string;
  hoverOutlineColor?: string;
  focusedOutlineColor?: string;
};

const PasswordInput: React.FC<Props> = (props) => {
  const {
    id,
    label,
    formik,
    defaultOutlineColor,
    hoverOutlineColor,
    focusedOutlineColor,
  } = props;
  const { touched, errors } = formik;

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const errorMessage = touched[id] && errors[id] ? errors[id].toString() : null;

  return (
    <FormControl
      sx={{
        width: "80%",
        mt: !errorMessage ? "0.5rem" : 0,
        mb: !errorMessage ? "0.5rem" : 0,
      }}
      variant="outlined"
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
        type={showPassword ? "text" : "password"}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
        label={label}
        error={!!errorMessage}
        {...formik.getFieldProps(id)}
        sx={{
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: errorMessage ? "red" : defaultOutlineColor || "grey",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: errorMessage ? "red" : hoverOutlineColor || "darkgrey",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: errorMessage
              ? "red"
              : focusedOutlineColor || "darkgrey",
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

export default PasswordInput;
