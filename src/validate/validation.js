import * as yup from 'yup';


export const CreateProbSchema = yup.object().shape({
  Title: yup.string()
    .min(3, "Username must be at least 3 characters long!")
    .max(30, "Username must be 30 characters at most!")
    .required("Username is a required field!")
    .strict(),
  Description: yup.string()
    .min(3, "Full name must be at least 3 characters long!")
    .max(256, "Full name must be 34 characters at most!")
    .required("Full name is a required field!"),
  testInput: yup.array().required("Test Input is a required field!"),
  testOutput: yup.array().required("Test Output is a required field!"),
  isPrivate: yup.boolean().required("You must set the privacy"),
  realInput: yup.array().required("Real Input is a required field!"),
  realOutput: yup.array().required("Real Output is a required field!"),
  
});
