import { Link } from "react-router-dom";
import { Box, Button } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";

import AuthCard from "../../UI/AuthCard";
import Input from "../common/Input";
import PasswordInput from "./PasswordInput";
import passwordValidator from "../../../config/validators/passwordValidator";

const RegisterForm = () => {
  const formik = useFormik({
    initialValues: { newEmail: "", password1: "", password2: "" },
    validationSchema: Yup.object({
      newEmail: Yup.string()
        .email("Enter a valid email address")
        .required("This field is required"),
      password1: passwordValidator(),
      password2: Yup.string()
        .required("This field is required")
        .oneOf([Yup.ref("password1")], "Passwords don't match"),
    }),
    onSubmit: (values) => {
      console.log(values);
    },
  });

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
        <Button
          sx={{ mt: "0.5rem", width: "80%", mb: "1rem" }}
          variant="contained"
          color="secondary"
          type="submit"
        >
          {"Register"}
        </Button>
      </Box>
      <Box sx={{ color: "#242424", py: "0.5rem" }}>
        Already have an account? <Link to="/login">Login here</Link>
      </Box>
    </AuthCard>
  );
};

export default RegisterForm;
