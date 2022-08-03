import * as yup from "yup";

export const CreateProbSchema = yup.object().shape({
  Title: yup
    .string()
    .min(3, "Username must be at least 3 characters long!")
    .max(30, "Username must be 30 characters at most!")
    .required("Username is a required field!")
    .strict(),
  Description: yup
    .string()
    .min(3, "Description must be at least 3 characters long!")
    .required("Description is a required field!"),
  testInputAndOutPut: yup.array().of(
    yup.object().shape({
      testOutput: yup.string().required("Test Output is a required field!"),
      testInput: yup.string().required("Test Input is a required field!"),
    })
  ),
  isPrivate: yup.boolean().required("You must set the privacy"),
  realtInputAndOutPut: yup.array().of(
    yup.object().shape({
      realInput: yup.string().required("Real Input is a required field!"),
      realOutput: yup.string().required("Real Output is a required field!"),
    })
  ),
});

export const CreateContestSchema = yup.object().shape({
  Title: yup
    .string()
    .min(3, "Username must be at least 3 characters long!")
    .max(30, "Username must be 30 characters at most!")
    .required("Username is a required field!")
    .strict(),
  Description: yup
    .string()
    .min(3, "Full name must be at least 3 characters long!")
    .max(256, "Full name must be 34 characters at most!")
    .required("Full name is a required field!"),
    grade: yup.array().of(yup.number().min(2).required("Username is a required field!")).required("This field must be a number"),
    checked: yup.array().of(yup.string()).min(1, 'The error message if length === 0 | 1').required("This field must be a number"),
    checkedUser: yup.array().of(yup.string()).min(1, 'The error message if length === 0 | 1').required("This field must be a number")

  });
