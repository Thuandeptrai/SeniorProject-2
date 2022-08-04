import React, { useState } from "react";
import { Formik, Field, Form, FieldArray } from "formik";
import { CreateProbSchema } from "../validate/validation";
import axios from "axios";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function CreateProb() {
  const CustomInputComponent = ({
    field, // { name, value, onChange, onBlur }
    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
    ...props
  }) => (<>
    {console.log(field)}
    <div>
      <ReactQuill theme="snow" className="h-80 mb-10"  value={field.value} d  onChange={field.onChange(field.name)}/>
    { console.log(field.value.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim()
)}
     
    </div>
  </>
  );
  const [success, setSuccess] = useState(null);
  const hanldeSubmit = async (values) => {
    let testOutput = [];
    let testInput = [];
    let realInput = [];
    let realOutput = [];
    for (let i = 0; i < values.realtInputAndOutPut.length; i++) {
      realInput.push(values.realtInputAndOutPut[i].realInput);
      realOutput.push(values.realtInputAndOutPut[i].realOutput);
    }
    for (let i = 0; i < values.testInputAndOutPut.length; i++) {
      testInput.push(values.testInputAndOutPut[i].testInput);
      testOutput.push(values.testInputAndOutPut[i].testOutput);
    }
    const creatProb = axios.create({
      withCredentials: true,
    });
    await creatProb
      .post("http://localhost:3001/createProblem", {
        title: values.Title,
        desc: values.Description,
        testInput,
        testOutput,
        realInput,
        realOutput,
        isPrivate: values.isPrivate,
      })
      .then((data) => {
        setSuccess(true);
      })
      .catch((err) => {
        setSuccess(false);
      });
  };
  return (
    <>
      <div className="flex flex-col width-screen items-center bg-white px-5 py-9 border border-gray-primary mb-3 rounded">
        <h1 className="flex justify-center w-full text-center font-bold mb-5">
          {" "}
          Create Problem
        </h1>

        <Formik
          validationSchema={CreateProbSchema}
          initialValues={{
            Title: "",
            Description: "",
            testInputAndOutPut: [
              {
                testOutput: "",
                testInput: "",
              },
            ],

            isPrivate: false,
            realtInputAndOutPut: [
              {
                realInput: "",
                realOutput: "",
              },
            ],
          }}
          onSubmit={async (values, { resetForm, setSubmitting }) => {
            console.log(values);
            try {
              await hanldeSubmit(values);
            } finally {
              setSubmitting(false);
              resetForm();
            }
          }}
        >
          {({ isSubmitting, isValid, errors, remove, values, touched }) => (
            <>
              <Form className="w-full grid grid-cols-1 gap-4 place-items-stretch">
                <Field
                  name="Title"
                  placeholder="Title"
                  className="text-sm focus:ring-gray-700 focus:border-gray-400 text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
                />
                {errors?.Title !== undefined && touched?.Title ? (
                  <>
                    <div className="p-4 mt-2 text-red-700  border rounded border-red-900/10 bg-red-50">
                      {" "}
                      <p>{errors.Title}</p>
                    </div>
                  </>
                ) : null}

                <Field
                  component={CustomInputComponent}
                  name="Description"
                  placeholder="Description"
                  className="text-sm focus:ring-gray-700 focus:border-gray-400 text-gray-base w-full  mr-3 py-5 px-4 h-80 border border-gray-primary rounded mb-2"
                />
                {errors?.Description !== undefined && touched?.Description ? (
                  <>
                    <div className="p-4 mt-2 text-red-700  border rounded border-red-900/10 bg-red-50">
                      {" "}
                      <p>{errors.Description}</p>
                    </div>
                  </>
                ) : null}
                <FieldArray name="testInputAndOutPut">
                  {({ insert, remove, push }) => (
                    <>
                      <div>
                        {values.testInputAndOutPut.length > 0 &&
                          values.testInputAndOutPut.map(
                            (testInputAndOutPut, index) => (
                              <>
                                <div key={index} className="my-3">
                                  <Field
                                  component={CustomInputComponent}
                                    name={`testInputAndOutPut.${index}.testInput`}
                                    placeholder="Test Input"
                                    type="text"
                                    className="text-sm focus:ring-gray-700 focus:border-gray-400 text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
                                  />

                                  <Field
                                    name={`testInputAndOutPut.${index}.testOutput`}
                                  component={CustomInputComponent}

                                    placeholder="Test Output"
                                    type="text"
                                    className="text-sm  focus:ring-gray-700 focus:border-gray-400 text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mt-3 mb-2"
                                  />
                                  {errors?.testInputAndOutPut !== undefined &&
                                  touched?.testInputAndOutPut ? (
                                    <>
                                      {touched.testInputAndOutPut[index] ? (
                                        <div className="p-4 mt-2 text-red-700  border rounded border-red-900/10 bg-red-50">
                                          {touched.testInputAndOutPut[index] ? (
                                            <p className="my-3">
                                              {
                                                errors.testInputAndOutPut[index]
                                                  ?.testOutput
                                              }
                                            </p>
                                          ) : null}

                                          {touched.testInputAndOutPut[index] ? (
                                            <p className="my-3">
                                              {
                                                errors.testInputAndOutPut[index]
                                                  ?.testInput
                                              }
                                            </p>
                                          ) : null}
                                        </div>
                                      ) : null}
                                    </>
                                  ) : null}
                                </div>
                              </>
                            )
                          )}
                        <div className="flex justify-center">
                          <div>
                            <button
                              type="button"
                              className={`bg-blue-500	 text-white px-10   rounded h-8 mt-1 font-semibold 
                          `}
                              onClick={() => {
                                push({ testOutput: "", testInput: "" });
                              }}
                            >
                              Add Visible Input Testcase
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </FieldArray>
                <FieldArray name="realtInputAndOutPut">
                  {({ insert, remove, push }) => (
                    <>
                      <div>
                        {values.realtInputAndOutPut.length > 0 &&
                          values.realtInputAndOutPut.map(
                            (realtInputAndOutPut, index) => (
                              <>
                                <div key={index}>
                                  <Field
                                    name={`realtInputAndOutPut.${index}.realInput`}
                                    placeholder="Test Input"
                                    type="text"
                                    className="text-sm focus:ring-gray-700 focus:border-gray-400 text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
                                  />

                                  <Field
                                    name={`realtInputAndOutPut.${index}.realOutput`}
                                    placeholder="Test Output"
                                    type="text"
                                    className="text-sm focus:ring-gray-700 focus:border-gray-400 text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2 mt-3"
                                  />
                                </div>
                                {errors?.realtInputAndOutPut !== undefined &&
                                touched?.realtInputAndOutPut ? (
                                  <>
                                    {touched.realtInputAndOutPut[index] ? (
                                      <div className="p-4 mt-2 text-red-700  my-5 border rounded border-red-900/10 bg-red-50">
                                        {touched.realtInputAndOutPut[index] ? (
                                          <p className="my-3">
                                            {
                                              errors.realtInputAndOutPut[index]
                                                ?.realOutput
                                            }
                                          </p>
                                        ) : null}

                                        {touched.realtInputAndOutPut[index] ? (
                                          <p className="my-3">
                                            {
                                              errors.realtInputAndOutPut[index]
                                                ?.realInput
                                            }
                                          </p>
                                        ) : null}
                                      </div>
                                    ) : null}
                                  </>
                                ) : null}
                                {/* {errors.realtInputAndOutPut !== undefined  ? (
                                  <>
                                    <p className="mb-3 pl-1 text-xs text-red-primary">
                                      {
                                        errors.realtInputAndOutPut[index]
                                          .realInput
                                      }
                                    </p>
                                    <p className="mb-3 pl-1 text-xs text-red-primary">
                                      {
                                        errors.realtInputAndOutPut[index]
                                          .realOutput
                                      }
                                    </p>
                                  </>
                                ) : null} */}
                              </>
                            )
                          )}
                        <div className="flex justify-center">
                          <div>
                            <button
                              type="button"
                              className={`bg-blue-500	 w-full px-10 text-white w-full rounded h-8 mt-1 font-semibold 
                            `}
                              onClick={() => {
                                push({ realInput: "", realOutput: "" });
                              }}
                            >
                              Add Real Testcase
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </FieldArray>
                <div className="flex justify-start">
                  <div className="mr-3">
                    <p>Private:</p>
                  </div>
                  <div>
                    <Field
                      type="checkbox"
                      name="isPrivate"
                      className=" text-sm font-medium text-gray-400 dark:text-gray-500"
                    />
                  </div>

                  <div className="mx-2">{`${values.isPrivate}`}</div>
                </div>
                <div className="flex justify-center">
                  <div>
                    <button
                      type="submit"
                      disabled={!isValid}
                      className={`bg-blue-500 px-20	 text-white w-full rounded h-8 mt-1 font-semibold ${
                        (!isValid || isSubmitting) &&
                        "opacity-50 cursor-not-allowed"
                      }`}
                    >
                      {" "}
                      {isSubmitting ? "Creating..." : "Create"}
                    </button>
                  </div>
                </div>
              </Form>
            </>
          )}
        </Formik>
        {success !== null ? (
          <div
            className={`p-4 mt-2  ${
              success === true
                ? "text-green-700  border-green-900/10 bg-green-50"
                : "text-red-700  border-red-900/10 bg-red-50"
            }  border rounded`}
          >
            <strong className="text-sm font-medium">
              {success === true ? "Success" : "Something went wrong"}
            </strong>
          </div>
        ) : null}
      </div>
    </>
  );
}

export default CreateProb;
