import React, { useEffect, useState } from "react";
import { Formik, Field, Form, FieldArray } from "formik";
import { CreateContestSchema, CreateProbSchema } from "../validate/validation";
import axios from "axios";
import { compareAsc, format, parseISO, getUnixTime } from "date-fns";
function CreateContest() {
  const [success, setSuccess] = useState(null);
  const [getAll, setgetAll] = useState(null);
  const [getUser, setUserAll] = useState(null);
  const [MonthStarted, setMonthStarted] = useState(0);
  const [yearStarted, setYearStarted] = useState(0);
  const [DayStarted, setDayStarted] = useState(0);
  const [HourStarted, setHourStarted] = useState(0);
  const [MinutesStarted, setMinutesStarted] = useState(0);
  const [SecondsStarted, setSecondsStarted] = useState(0);
  const [Timezone, setTimezone] = useState(0);
  const getProb = axios.create({
    withCredentials: true,
  });

  const handleSubmit = async (values) => {
    let probList = [];
    let user = [];
    let title = [];
    let Description = [];
    let isPrivated = [];
    let dateStarted = [];
    let gradebyProblem = [];
    const result = getUnixTime(
      new Date(
        values.yearStarted,
        values.MonthStarted - 1,
        values.DayStarted,
        values.HourStarted,
        values.MinutesStarted,
        values.SecondsStarted
      )
    );
    console.log(result)
  };
  useEffect(() => {
    const getAllProb = async () => {
      await getProb
        .get("http://localhost:3001/contest/getAllProblem")
        .then((res) => {
          setgetAll(res.data);
        });
      await getProb
        .get("http://localhost:3001/contest/getAllUser")
        .then((res) => {
          setUserAll(res.data);
        });
      var time = format(new Date(), "yyyy-MM-dd''HH:mm:ss");
      setYearStarted(format(new Date(), "yyyy"));
      setMonthStarted(format(new Date(), "MM"));
      setDayStarted(format(new Date(), "dd"));
      setHourStarted(format(new Date(), "HH"));
      setMinutesStarted(format(new Date(), "mm"));
      setSecondsStarted(format(new Date(), "ss"));
      console.log(format(new Date(), "X"));
      let word_With_Numbers = format(new Date(), "X");
      let word_Without_Numbers = word_With_Numbers.replace(/\D/g, "");
      setTimezone(parseInt(word_Without_Numbers));
    };
    getAllProb();
  }, []);
  console.log(yearStarted);
  return (
    <>
      <div className="flex flex-col width-screen items-center bg-white px-5 py-9 border border-gray-primary mb-3 rounded">
        <h1 className="flex justify-center w-full text-center text-xl font-bold mb-5">
          {" "}
          Create Contest
        </h1>

        <Formik
          validationSchema={CreateContestSchema}
          enableReinitialize={true}
          initialValues={{
            Title: "",
            getUser,
            Description: "",
            yearStarted,
            MonthStarted,
            DayStarted,
            HourStarted,
            MinutesStarted,
            SecondsStarted,
            YearEnded: 2022,
            MonthEnded: 0,
            DayEnded: 0,
            HourEnded: 0,
            MinutesEnded: 0,
            SecondsEnded: 0,
            checked: [],
            grade: [],
            checkedUser: [],
            isPrivate: false,
            getAll,
            dateTime: "",
          }}
          onSubmit={async (values, { resetForm, setSubmitting }) => {
            console.log(values);
            try {
              await handleSubmit(values);
            } finally {
              setSubmitting(false);
              resetForm();
            }
          }}
        >
          {({ isSubmitting, isValid, errors, remove, values, touched }) => (
            <>
              {console.log(values.yearStarted)}
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
                  name="Description"
                  placeholder="Description"
                  className="text-sm focus:ring-gray-700 focus:border-gray-400 text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
                />
                {errors?.Description !== undefined && touched?.Description ? (
                  <>
                    <div className="p-4 mt-2 text-red-700  border rounded border-red-900/10 bg-red-50">
                      {" "}
                      <p>{errors.Description}</p>
                    </div>
                  </>
                ) : null}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <FieldArray name="getAll">
                      {({ insert, remove, push }) => (
                        <>
                          <div>
                            <div className="flex justify-center">
                              <p className="flex justify-center w-full text-center text-xl font-bold mb-5">
                                Selected Problem
                              </p>
                            </div>
                            {values.getAll !== null &&
                              values.getAll.map((probValue, index) => (
                                <>
                                  <div key={index} className="my-3">
                                    <div className="flex justify-start">
                                      <div>
                                        <Field
                                          name="checked"
                                          type="checkbox"
                                          value={probValue.id}
                                          className="mr-3"
                                        />
                                      </div>
                                      <div className="mr-3">
                                        {probValue.title}
                                      </div>
                                    </div>
                                  </div>
                                </>
                              ))}
                          </div>
                        </>
                      )}
                    </FieldArray>
                    {errors?.checked !== undefined && touched?.checked ? (
                      <>
                        <div className="p-4 mt-2 text-red-700  border rounded border-red-900/10 bg-red-50">
                          {" "}
                          <p>{errors.checked}</p>
                        </div>
                      </>
                    ) : null}
                  </div>
                  <div>
                    <FieldArray name="getUser">
                      {({ insert, remove, push }) => (
                        <>
                          <div>
                            <div className="flex justify-center">
                              <p className="flex justify-center w-full text-center text-xl font-bold mb-5">
                                Selected User
                              </p>
                            </div>
                            <div className="flex justify-between font-bold ">
                              <div>
                                <p>Name</p>
                              </div>

                              <div className="pr-20 font-bold">
                                <p>id</p>
                              </div>
                            </div>
                            {values.getUser !== null &&
                              values.getUser.map((probValue, index) => (
                                <>
                                  <div key={index} className="my-3">
                                    <div className="flex  justify-between">
                                      <div className="flex justify-start">
                                        <div>
                                          <Field
                                            name="checkedUser"
                                            type="checkbox"
                                            value={probValue.id}
                                            className="mr-3"
                                          />
                                        </div>
                                        <div className="mr-3">
                                          {probValue.name}
                                        </div>
                                      </div>
                                      <div className="mr-3">{probValue.id}</div>
                                    </div>
                                  </div>
                                </>
                              ))}
                          </div>
                        </>
                      )}
                    </FieldArray>
                    {errors?.checkedUser !== undefined &&
                    touched?.checkedUser ? (
                      <>
                        <div className="p-4 mt-2 text-red-700  border rounded border-red-900/10 bg-red-50">
                          {" "}
                          <p>{errors.checkedUser}</p>
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>

                <FieldArray name="checked">
                  {({ insert, remove, push }) => (
                    <>
                      <div>
                        <p className="font-bold">Grade by problem</p>
                        {values.checked !== null &&
                          values.checked.length !== 0 &&
                          values.checked.map((probValue, index) => (
                            <>
                              <div key={index} className="my-3">
                                <div className="flex justify-start">
                                  <div>
                                    <p>{`Problem  ${index + 1} : `}</p>
                                    <Field
                                      name={`grade.${index}`}
                                      type="text"
                                      value={probValue.id}
                                      className="text-sm focus:ring-gray-700 focus:border-gray-400 text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
                                    />
                                  </div>
                                </div>
                                <div className="">
                                  <div className=" ">{probValue.title}</div>
                                  <div>
                                    {errors?.grade !== undefined &&
                                    touched?.grade ? (
                                      errors?.grade[index] ? (
                                        <>
                                          <div className="p-4 mt-2 text-red-700  border rounded border-red-900/10 bg-red-50">
                                            {" "}
                                            <p>The Field must be a number</p>
                                          </div>
                                        </>
                                      ) : null
                                    ) : null}
                                  </div>
                                </div>
                              </div>
                            </>
                          ))}
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
                <div className="grid gap-x-8 gap-y-4 grid-cols-6 justify-items-end">
                  <div>
                    <p>Year Started</p>

                    <Field
                      type="number"
                      name="yearStarted"
                      className="focus:ring-gray-700 focus:border-gray-400 text-gray-base  mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
                    ></Field>
                  </div>
                  <div>
                    <p>Month Started</p>
                    <Field
                      type="number"
                      name="MonthStarted"
                      className="focus:ring-gray-700 focus:border-gray-400 text-gray-base  mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
                    ></Field>
                  </div>
                  <div>
                    <p>Day Started</p>

                    <Field
                      type="number"
                      name="DayStarted"
                      className="focus:ring-gray-700 focus:border-gray-400 text-gray-base  mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
                    ></Field>
                  </div>

                  <div>
                    {" "}
                    <p>Hour Started</p>
                    <Field
                      type="number"
                      name="HourStarted"
                      className="focus:ring-gray-700 focus:border-gray-400 text-gray-base  mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
                    ></Field>
                  </div>
                  <div>
                    {" "}
                    <p>Minutes Started</p>
                    <Field
                      type="number"
                      name="MinutesStarted"
                      className="focus:ring-gray-700 focus:border-gray-400 text-gray-base  mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
                    ></Field>
                  </div>
                  <div>
                    {" "}
                    <p>Seconds Started</p>
                    <Field
                      type="number"
                      name="SecondsStarted"
                      className="focus:ring-gray-700 focus:border-gray-400 text-gray-base  mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
                    ></Field>
                  </div>
                </div>
                <div className="grid gap-x-8 gap-y-4 grid-cols-6 justify-items-end">
                  <div>
                    <p>Year Ended</p>

                    <Field
                      type="number"
                      name="YearEnded"
                      className="focus:ring-gray-700 focus:border-gray-400 text-gray-base  mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
                    ></Field>
                  </div>
                  <div>
                    <p>Month Ended</p>
                    <Field
                      type="number"
                      name="MonthEnded"
                      className="focus:ring-gray-700 focus:border-gray-400 text-gray-base  mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
                    ></Field>
                  </div>
                  <div>
                    <p>Day Ended</p>

                    <Field
                      type="number"
                      name="DayEnded"
                      className="focus:ring-gray-700 focus:border-gray-400 text-gray-base  mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
                    ></Field>
                  </div>

                  <div>
                    {" "}
                    <p>Hour Ended</p>
                    <Field
                      type="number"
                      name="HourEnded"
                      className="focus:ring-gray-700 focus:border-gray-400 text-gray-base  mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
                    ></Field>
                  </div>
                  <div>
                    {" "}
                    <p>Minutes Ended</p>
                    <Field
                      type="number"
                      name="MinutesStarted"
                      className="focus:ring-gray-700 focus:border-gray-400 text-gray-base  mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
                    ></Field>
                  </div>
                  <div>
                    {" "}
                    <p>Seconds Ended</p>
                    <Field
                      type="number"
                      name="SecondsStarted"
                      className="focus:ring-gray-700 focus:border-gray-400 text-gray-base  mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
                    ></Field>
                  </div>
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

export default CreateContest;
