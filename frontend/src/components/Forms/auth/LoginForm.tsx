import { Link } from "react-router-dom";
import { Box, Button } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";

import AuthCard from "../../UI/AuthCard";
import Input from "../common/Input";
import PasswordInput from "./PasswordInput";

const LoginForm = () => {
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string().required("This field is required"),
      password: Yup.string().required("This field is required"),
    }),
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <AuthCard>
      <Box component="form" onSubmit={formik.handleSubmit}>
        <Input id="email" label={"Email"} formik={formik} />
        <PasswordInput id="password" label={"Password"} formik={formik} />
        <Button
          sx={{ mt: "0.5rem", width: "80%", mb: "1rem" }}
          variant="contained"
          color="secondary"
          type="submit"
        >
          {"Login"}
        </Button>
      </Box>
      <Box sx={{ color: "#242424", py: "0.5rem" }}>
        Don't you have an account? <Link to="/register">Register here</Link>
      </Box>
    </AuthCard>
  );
};

export default LoginForm;
