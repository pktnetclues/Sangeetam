import Yup from "yup";

const registerSchema = Yup.object().shape({
  name: Yup.string().required("name is required"),
  email: Yup.string().email("invalid email").required("email is required"),
  password: Yup.string().min(6).required("password is required"),
});

const loginSchema = Yup.object().shape({
  email: Yup.string().email("invalid email").required("email is required"),
  password: Yup.string().min(6).required("password is required"),
});

const updatePassSchema = Yup.object().shape({
  email: Yup.string().email("invalid email").required("email is required"),
  token: Yup.number().required("token is required"),
  password: Yup.string().min(6).required("password is required"),
});

const emailSchema = Yup.object().shape({
  email: Yup.string().email("invalid email").required("email is required"),
});

export { registerSchema, loginSchema, emailSchema, updatePassSchema };
