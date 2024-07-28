import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";

import AuthCard from "../../UI/AuthCard";
import Input from "../common/Input";
import PasswordInput from "./PasswordInput";
import passwordValidator from "../../../config/validators/passwordValidator";
import { AuthContext } from "../../../store/AuthContext/AuthContext";
import LoadingSpinner from "../../UI/LoadingSpinner";
import ErrorMessage from "../../UI/ErrorMessage";
import COLORS from "../../../constants/colors";
import MESSAGES from "../../../constants/messages";

const RegisterForm = () => {
  const { register, registerQueryData, resetRegisterQueryData } =
    useContext(AuthContext);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { newEmail: "", password1: "", password2: "" },
    validationSchema: Yup.object({
      newEmail: Yup.string()
        .email("Enter a valid email address")
        .required(MESSAGES.FIELD_REQUIRED),
      password1: passwordValidator(),
      password2: Yup.string()
        .required(MESSAGES.FIELD_REQUIRED)
        .oneOf([Yup.ref("password1")], "Passwords don't match"),
    }),
    onSubmit: (values) => {
      const credentials = {
        email: values.newEmail,
        password: values.password1,
      };
      register(credentials);
    },
  });

  const { isSuccess, error, isLoading } = registerQueryData;

  useEffect(() => {
    if (isSuccess) {
      navigate("/account-created");
      resetRegisterQueryData();
    }
  }, [isSuccess]);

  const errorMessage =
    error?.response?.status === 400
      ? "User with this email already exists"
      : MESSAGES.SOMETHING_WENT_WRONG;

  return (
    <AuthCard>
      <Box component="form" onSubmit={formik.handleSubmit}>
        <Input id="newEmail" label={"Email"} formik={formik} />
        <PasswordInput id="password1" label={"Password"} formik={formik} />
        <PasswordInput
          id="password2"
          label={"Repeat password"}
          formik={formik}
        />
        {!isLoading && (
          <Button
            sx={{ mt: "0.5rem", width: "80%", mb: "1rem" }}
            variant="contained"
            color="secondary"
            type="submit"
          >
            {"Register"}
          </Button>
        )}
        {isLoading && <LoadingSpinner />}
        {error && <ErrorMessage message={errorMessage} sx={{ mt: 0 }} />}
      </Box>
      <Box sx={{ color: COLORS.black200, py: "0.5rem" }}>
        Already have an account? <Link to="/login">Login here</Link>
      </Box>
    </AuthCard>
  );
};

export default RegisterForm;
