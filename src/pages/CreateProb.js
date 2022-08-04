import React, { useMemo, useRef, useState } from "react";
import { Formik, Field, Form, FieldArray } from "formik";
import { CreateProbSchema } from "../validate/validation";
import axios from "axios";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";

function CreateProb() {
  const quillRef = useRef();
  const imageHandler = (e) => {
    const editor = quillRef.current.getEditor();
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (/^image\//.test(file.type)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "yhddnraa");

        const result = await fetch(
          "https://api.cloudinary.com/v1_1/appcuathuandeptrai/image/upload",
          {
            mode: "cors",
            method: "post",
            body: formData,
          }
        ).then((res) => res.json());
        editor.insertEmbed(editor.getSelection(), "image", result.secure_url);
      } else {
      }
    };
  };
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ["bold", "italic", "underline", "strike"],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          ["image", "link"],
          [
            {
              color: [
                "#000000",
                "#e60000",
                "#ff9900",
                "#ffff00",
                "#008a00",
                "#0066cc",
                "#9933ff",
                "#ffffff",
                "#facccc",
                "#ffebcc",
                "#ffffcc",
                "#cce8cc",
                "#cce0f5",
                "#ebd6ff",
                "#bbbbbb",
                "#f06666",
                "#ffc266",
                "#ffff66",
                "#66b966",
                "#66a3e0",
                "#c285ff",
                "#888888",
                "#a10000",
                "#b26b00",
                "#b2b200",
                "#006100",
                "#0047b2",
                "#6b24b2",
                "#444444",
                "#5c0000",
                "#663d00",
                "#666600",
                "#003700",
                "#002966",
                "#3d1466",
              ],
            },
          ],
        ],

        handlers: {
          image: imageHandler,
        },
      },
    }),
    []
  );
  const CustomInputComponent = ({
    field, // { name, value, onChange, onBlur }`
    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
    ...props
  }) => (
    <>
      <div>
        <ReactQuill
          theme="snow"
          modules={modules}
          className="h-auto mb-10"
          value={field.value}
          ref={quillRef}
          onChange={field.onChange(field.name)}
        />
   
      </div>
    </>
  );
  const CustomInputComponentForInput = ({
    field, // { name, value, onChange, onBlur }
    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
    ...props
  }) => (
    <>
      <div>
        <ReactQuill
          theme="snow"
          className="h-40 mb-20"
          value={field.value}
          d
          onChange={field.onChange(field.name)}
        />
        {field.value
          .replace(/<[^>]*>?/gm, " ")
          .replace(/\s+/g, " ")
          .trim().length === 0 ? (
          <>
            <div className="p-4 mt-2 text-red-700  border rounded border-red-900/10 bg-red-50">
              {" "}
              This is required a filed
            </div>{" "}
          </>
        ) : null}
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
                        <p className="font-bold">Visible TestCase:</p>
                        {values.testInputAndOutPut.length > 0 &&
                          values.testInputAndOutPut.map(
                            (testInputAndOutPut, index) => (
                              <>
                                <div key={index} className="my-3">
                                  <p>Test Input {index + 1} :</p>
                                  <Field
                                    component={CustomInputComponentForInput}
                                    name={`testInputAndOutPut.${index}.testInput`}
                                    placeholder="Test Input"
                                    type="text"
                                    className="text-sm focus:ring-gray-700 focus:border-gray-400 text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
                                  />
                                  <p>Test Output {index + 1} :</p>

                                  <Field
                                    name={`testInputAndOutPut.${index}.testOutput`}
                                    component={CustomInputComponentForInput}
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
                        <p className="font-bold">Invisilbe TestCase:</p>
                        {values.realtInputAndOutPut.length > 0 &&
                          values.realtInputAndOutPut.map(
                            (realtInputAndOutPut, index) => (
                              <>
                                <div key={index}>
                                  <p>Real Input {index + 1} :</p>
                                  <Field
                                    component={CustomInputComponentForInput}
                                    name={`realtInputAndOutPut.${index}.realInput`}
                                    placeholder="Test Input"
                                    type="text"
                                    className="text-sm focus:ring-gray-700 focus:border-gray-400 text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
                                  />
                                  <p>Real Output {index + 1}:</p>
                                  <Field
                                    component={CustomInputComponentForInput}
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
