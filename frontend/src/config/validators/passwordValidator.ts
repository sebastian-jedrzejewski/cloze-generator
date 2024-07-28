import * as Yup from "yup";

import passwordValidLength from "./passwordValidLength";
import MESSAGES from "../../constants/messages";

const passwordValidator = () => {
  return Yup.string()
    .required(MESSAGES.FIELD_REQUIRED)
    .min(
      passwordValidLength.min,
      `Your password must have at least ${passwordValidLength.min} characters`,
    )
    .max(
      passwordValidLength.max,
      `Your password must not have more than ${passwordValidLength.max} characters`,
    )
    .matches(
      /[a-z]/,
      "Your password must must have at least 1 lowercase letter",
    )
    .matches(
      /[A-Z]/,
      "Your password must must have at least 1 uppercase letter",
    )
    .matches(/[0-9]/, "Your password must must have at least 1 digit")
    .matches(
      /^(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~\\/-])/,
      "Your password must must have at least 1 special character",
    );
};

export default passwordValidator;
