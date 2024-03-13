import * as yup from "yup";

const emailreg = /^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i;

const numreg = /^[0-9]*$/;

const noNum = /^\D*$/;

const onlySpace = /^\S*$/;

const messageRegex = /^(?!\s*$)[\s\S]*$/;

const noSpecialCharacter = /^[A-Za-z0-9\s]+$/;

const noSpecialCharacterButDash = /^[A-Za-z0-9-\s]+$/;

const noSpecialCharacterButUnderscore = /^[A-Za-z0-9_\s]+$/;

const lowerCase = /[a-z]/;

const upperCase = /[A-Z]/;

const digit = /\d/;

const specialCharacter = /[@$!%*?&#_\-+()/]/;

const SignIn = yup.object().shape({
  email_address: yup
    .string()
    .required("Please enter a valid Email / Number / Username"),

  password: yup
    .string()
    .required("Required")
    .matches(onlySpace, "Spaces is not allowed"),
});

const EmailAddress = yup.object().shape({
  email_address: yup
    .string()
    .matches(
      emailreg,
      "Please enter a valid e-mail address e.g. example@example.com"
    )
    .required("Please enter a valid e-mail address e.g. example@example.com"),
});

const ForgotEmail = yup.object().shape({
  email_address: yup
    .string()
    .required("Please enter a valid Email / Number / Username"),
});

const ResetPasword = yup.object().shape({
  new_password: yup
    .string()
    .required("Required")
    .matches(onlySpace, "Password cannot contain spaces.")
    .min(8, "Password must be at least 8 characters long.")
    .matches(lowerCase, "Password must contain at least one lowercase letter.")
    .matches(upperCase, "Password must contain at least one uppercase letter.")
    .matches(digit, "Password must contain at least one digit.")
    .matches(
      specialCharacter,
      "Password must contain at least one special character."
    ),

  confirm_password: yup
    .string()
    .required("Required")
    .oneOf([yup.ref("new_password"), null], "Passwords must match"),
});

const Name = yup.object().shape({
  first_name: yup
    .string()
    .required("Required")
    .matches(messageRegex, "Empty space is not allowed")
    .matches(noNum, "Numbers are not allowed")
    .matches(noSpecialCharacterButDash, "Special characters are not allowed")
    .min(2, "Minimum 2 characters required"),
  last_name: yup
    .string()
    .required("Required")
    .matches(messageRegex, "Empty space is not allowed")
    .matches(noNum, "Numbers are not allowed")
    .matches(noSpecialCharacterButDash, "Special characters are not allowed")
    .min(2, "Minimum 2 characters required"),
  user_name: yup
    .string()
    .required("Required")
    .matches(onlySpace, "Space is not allowed")
    .matches(
      noSpecialCharacterButUnderscore,
      "Special characters are not allowed"
    )
    .min(5, "Minimum 5 characters required"),
});

const About = yup.object().shape({
  about_me: yup
    .string()
    .required("Required")
    .matches(messageRegex, "Empty space is not allowed")
    .min(10, "Minimum 10 characters required")
    .max(150, "Maximum 150 word limit"),
});

const IceBreakerValid = yup.object().shape({
  fav_body: yup
    .string()
    .nullable()
    .transform((curr, orig) => (orig === "" ? null : curr))
    .matches(messageRegex, "Empty space is not allowed")
    .matches(noNum, "Numbers are not allowed")
    .matches(noSpecialCharacter, "Special characters are not allowed")
    .min(2, "Minimum 2 characters required"),
  boat_name: yup
    .string()
    .nullable()
    .transform((curr, orig) => (orig === "" ? null : curr))
    .matches(messageRegex, "Empty space is not allowed")
    .matches(noNum, "Numbers are not allowed")
    .matches(noSpecialCharacter, "Special characters are not allowed")
    .min(2, "Minimum 2 characters required"),
  go_sailing: yup
    .string()
    .nullable()
    .transform((curr, orig) => (orig === "" ? null : curr))
    .matches(messageRegex, "Empty space is not allowed")
    .matches(noNum, "Numbers are not allowed")
    .matches(noSpecialCharacter, "Special characters are not allowed")
    .min(2, "Minimum 2 characters required"),
});

const Help = yup.object().shape({
  name: yup
    .string()
    .required("Required")
    .matches(messageRegex, "Empty space is not allowed")
    .min(2, "Minimum 2 characters required"),
  email_address: yup
    .string()
    .required("Required")
    .matches(
      emailreg,
      "Please enter a valid e-mail address e.g. example@example.com"
    ),
  message: yup
    .string()
    .required("Required")
    .matches(messageRegex, "Empty space is not allowed")
    .min(10, "Minimum 10 characters required"),
});

const PhoneNumber = yup.object().shape({
  phone_number: yup
    .string()
    .required("Required")
    .min(10, "Phone number must be valid")
    .matches(numreg, "Phone number must be valid"),
});

const Job = yup.object().shape({
  my_job: yup
    .string()
    .nullable()
    .transform((curr, orig) => (orig === "" ? null : curr))
    .matches(messageRegex, "Empty space is not allowed")
    .matches(noNum, "Numbers are not allowed")
    .matches(noSpecialCharacter, "Special characters are not allowed"),
});

const IssueDetail = yup.object().shape({
  issue: yup
    .string()
    .nullable()
    .required("Required")
    .transform((curr, orig) => (orig === "" ? null : curr))
    .matches(messageRegex, "Empty space is not allowed")
    .min(10, "Minimum 10 characters required")
    .max(150, "Maximum 150 word limit"),
});
export {
  SignIn,
  ForgotEmail,
  ResetPasword,
  Name,
  About,
  IceBreakerValid,
  Help,
  PhoneNumber,
  Job,
  IssueDetail,
  EmailAddress,
};
