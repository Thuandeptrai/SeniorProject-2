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
    .min(3, "Full name must be at least 3 characters long!")
    .max(256, "Full name must be 34 characters at most!")
    .required("Full name is a required field!"),
  testInputAndOutPut: yup.array().of(
    yup.object().shape({
      testOutput: yup.string().required("testOutput is a required field!"),
      testInput: yup.string().required("testInput is a required field!"),
    })
  ),
  isPrivate: yup.boolean().required("You must set the privacy"),
  realtInputAndOutPut: yup.array().of(
    yup.object().shape({
      realInput: yup.string().required("realInput is a required field!"),
      realOutput: yup.string().required("realOutput is a required field!"),
    })
  ),
});
