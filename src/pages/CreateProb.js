import React, { useState } from "react";
import { Formik, Field, Form, FieldArray } from "formik";
import { CreateProbSchema } from "../validate/validation";
import axios from "axios";

function CreateProb() {
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
        console.log(data.data);
      });
  };
  return (
    <>
      <div className="container flex mx-auto max-w-screen-lg items-center justify-center h-screen">
        <div className="flex flex-col width-screen items-center bg-white px-5 py-9 border border-gray-primary mb-3 rounded">
          <h1 className="flex justify-center w-full text-gray-400 text-center font-semibold mb-5">
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
                      {" "}
                      <p>{errors.Title}</p>
                    </>
                  ) : null}

                  <Field
                    name="Description"
                    placeholder="Description"
                    className="text-sm focus:ring-gray-700 focus:border-gray-400 text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
                  />
                  {errors?.Description !== undefined && touched?.Description ? (
                    <>
                      {" "}
                      <p>{errors.Description}</p>
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
                                  <div key={index}>
                                    <Field
                                      name={`testInputAndOutPut.${index}.testInput`}
                                      placeholder="Test Input"
                                      type="text"
                                      className="text-sm focus:ring-gray-700 focus:border-gray-400 text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
                                    />

                                    <Field
                                      name={`testInputAndOutPut.${index}.testOutput`}
                                      placeholder="Test Output"
                                      type="text"
                                      className="text-sm focus:ring-gray-700 focus:border-gray-400 text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
                                    />
                                    {errors?.testInputAndOutPut !== undefined &&
                                    touched?.testInputAndOutPut ? (
                                      <>
                                        {touched.testInputAndOutPut[index] ? (
                                          <p>
                                            {
                                              errors.testInputAndOutPut[index]
                                                ?.testOutput
                                            }
                                          </p>
                                        ) : null}

                                        {touched.testInputAndOutPut[index] ? (
                                          <p>
                                            {
                                              errors.testInputAndOutPut[index]
                                                ?.testInput
                                            }
                                          </p>
                                        ) : null}
                                      </>
                                    ) : null}
                                  </div>
                                </>
                              )
                            )}
                          <button
                            type="button"
                            className="secondary"
                            onClick={() => {
                              push({ testOutput: "", testInput: "" });
                            }}
                          >
                            Add Visible Input Testcase
                          </button>
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
                                      className="text-sm focus:ring-gray-700 focus:border-gray-400 text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
                                    />
                                  </div>
                                  {errors?.realtInputAndOutPut !== undefined &&
                                  touched?.realtInputAndOutPut ? (
                                    <>
                                      {touched.realtInputAndOutPut[index] ? (
                                        <p>
                                          {
                                            errors.realtInputAndOutPut[index]
                                              ?.realInput
                                          }
                                        </p>
                                      ) : null}

                                      {touched.realtInputAndOutPut[index] ? (
                                        <p>
                                          {
                                            errors.realtInputAndOutPut[index]
                                              ?.realOutput
                                          }
                                        </p>
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
                          <button
                            type="button"
                            className="secondary"
                            onClick={() => {
                              push({ realInput: "", realOutput: "" });
                            }}
                          >
                            Add UnVisible Input Testcase
                          </button>
                        </div>
                      </>
                    )}
                  </FieldArray>
                  <p>Is Private</p>
                  <label htmlFor="isPrivate">
                    <Field type="checkbox" name="isPrivate" />
                    {`${values.isPrivate}`}
                  </label>
                  <button type="submit">Invite</button>
                </Form>
              </>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}

export default CreateProb;
