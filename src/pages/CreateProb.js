import React from "react";
import { Formik, Field, Form, FieldArray } from "formik";
import { CreateProbSchema } from "../validate/validation";

function CreateProb() {
  return (
    <>
      <div className="flex flex-col items-center bg-white px-5 py-9 border border-gray-primary mb-3 rounded">
        <h1 className="flex justify-center w-full">1</h1>
        <p className="text-gray-400 text-center font-semibold mb-5">
          Sign up to see photos and videos from your friends.
        </p>

        <Formik
          validationSchema={CreateProbSchema}
          initialValues={{
            Title: "",
            Description: "",
            testInput: [""],
            testOutput: [""],
            isPrivate: false,
            realInput: [""],
            realOutput: [""],
          }}
          onSubmit={async (values, { resetForm, setSubmitting }) => {
            await new Promise((r) => setTimeout(r, 500));
            alert(JSON.stringify(values, null, 2));
            console.log(values);
          }}
        >
          {({ isSubmitting, isValid, errors, remove, values, touched }) => (
            <>
              {console.log(errors)}
              <Form className="w-full grid grid-cols-1 gap-4">
                <label htmlFor="Title">Title</label>
                <Field name="Title" placeholder="Title" />
                <label htmlFor="Description">Description</label>
                <Field name="Description" placeholder="Description" />
                <FieldArray name="testInput">
                  {({ insert, remove, push }) => (
                    <>
                      <div>
                        {values.testInput.length > 0 &&
                          values.testInput.map((testInput, index) => (
                            <>
                              <div key={index}>
                                <Field
                                  name={`testInput.${index}`}
                                  placeholder="Test Input"
                                  type="text"
                                />
                              </div>
                            </>
                          ))}
                        <button
                          type="button"
                          className="secondary"
                          onClick={() => push("")}
                        >
                          Add Visible Input Testcase
                        </button>
                      </div>
                    </>
                  )}
                </FieldArray>
                <FieldArray name="testOutput">
                  {({ insert, remove, push }) => (
                    <>
                      <div>
                        {values.testOutput.length > 0 &&
                          values.testOutput.map((testOutput, index) => (
                            <>
                              <div key={index}>
                                <Field
                                  name={`testOutput.${index}`}
                                  placeholder="Test Output"
                                  type="text"
                                />
                              </div>
                            </>
                          ))}
                        <button
                          type="button"
                          className="secondary"
                          onClick={() => push("")}
                        >
                          Add Visible Out Testcase
                        </button>
                      </div>
                    </>
                  )}
                </FieldArray>
                <FieldArray name="realInput">
                  {({ insert, remove, push }) => (
                    <>
                      <div>
                        {values.realInput.length > 0 &&
                          values.realInput.map((realInput, index) => (
                            <>
                              <div key={index}>
                                <Field
                                  name={`realInput.${index}`}
                                  placeholder="Real Input"
                                  type="text"
                                />
                              </div>
                            </>
                          ))}
                        <button
                          type="button"
                          className="secondary"
                          onClick={() => push("")}
                        >
                          Add Unvisible Input Testcase
                        </button>
                      </div>
                    </>
                  )}
                </FieldArray>
                <FieldArray name="realOutput">
                  {({ insert, remove, push }) => (
                    <>
                      <div>
                        {values.realOutput.length > 0 &&
                          values.realOutput.map((realOutput, index) => (
                            <>
                              <div key={index}>
                                <Field
                                  name={`realOutput.${index}`}
                                  placeholder="Real Output"
                                  type="text"
                                />
                              </div>
                            </>
                          ))}
                        <button
                          type="button"
                          className="secondary"
                          onClick={() => push("")}
                        >
                          Add Unvisible Output Testcase
                        </button>
                      </div>
                    </>
                  )}
                </FieldArray>
                <label>
                  <Field type="checkbox" name="isPrivate" />
                  {`${values.isPrivate}`}
                </label>
                <button type="submit">Invite</button>
              </Form>
            </>
          )}
        </Formik>
      </div>
    </>
  );
}

export default CreateProb;
