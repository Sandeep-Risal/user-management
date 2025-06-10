import { emailRegex } from "./regex.js";

const validateRequiredFields = (requiredFields) => {
  return Object.values(requiredFields).some((field) => !field);
};

const validatePassword = (password, confirmPassword) => {
  return password !== confirmPassword;
};

const validateEmail = (email) => {
  return emailRegex.test(email);
};

export { validateRequiredFields, validatePassword, validateEmail };
