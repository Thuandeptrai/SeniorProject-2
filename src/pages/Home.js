import React, { useContext, useEffect, useState } from "react";
import { userContext } from "../context/userContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Moment from "react-moment";

function Home() {
  const user = useContext(userContext);
  const [show, setShow] = useState(null);
  const [prob, setProb] = useState([]);
  const [mode, setMode] = useState("desc");
  const [hide, setHide] = useState(false);
  const getProblem = axios.create({
    withCredentials: true,
  });
  let navigate = useNavigate();
  const routeChange = (id) => {
    let path = `/prob/${id.id}`;
    navigate(path);
  };
  const handleShowMore = async (e) => {
    e.preventDefault();
    let probsize = prob.length;
    await getProblem
      .get(`http://localhost:3001/problem/${mode}/${probsize}`)
      .then((newProb) => {
        if (newProb.data !== "Full") {
          for (let i = 0; i < newProb.data.length; i++) {
            setProb((oldArray) => [...oldArray, newProb.data[i]]);
          }
        }
        if (newProb.data === "Full") {
          setHide(true);
        }
      });
  };
  useEffect(() => {
    const getProb = async () => {
      await getProblem
        .get(`http://localhost:3001/problem/${mode}/0`)
        .then((prob) => {
          setProb(prob.data);
        });
    };

    getProb();
  }, [mode]);
  return (
    <>
      <div>
        <div className="sm:px-6 w-full">
          <div className="px-4 md:px-10 py-4 md:py-7">
            <div className="flex items-center justify-between">
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-normal text-gray-800">
                Problems
              </p>
              <div className="py-3 px-4 flex items-center text-sm font-medium leading-none text-gray-600 bg-gray-200 hover:bg-gray-300 cursor-pointer rounded">
                <p>Sort By:</p>
                <select
                  className="focus:outline-none bg-transparent ml-1"
                  onChange={(e) => {
                    setMode(e.target.value);
                  }}
                >
                  <option className="text-sm text-indigo-800" value="desc">
                    Latest
                  </option>
                  <option className="text-sm text-indigo-800" value="ascd">
                    Oldest
                  </option>
                  <option className="text-sm text-indigo-800" value="desc">
                    Latest
                  </option>
                </select>
              </div>
            </div>
          </div>
          <div className="bg-white py-4 md:py-7 px-4 md:px-8 xl:px-10">
            <div className="sm:flex items-center justify-between">
              <div className="flex items-center">
                <a href="/">
                  <div className="py-2 px-8 bg-indigo-100 text-indigo-700 rounded-full">
                    <p>All</p>
                  </div>
                </a>
                <a href="/">
                  <div className="py-2 px-8 text-gray-600 hover:text-indigo-700 hover:bg-indigo-100 rounded-full ml-4 sm:ml-8">
                    <p>Done</p>
                  </div>
                </a>
                <a href="/">
                  <div className="py-2 px-8 text-gray-600 hover:text-indigo-700 hover:bg-indigo-100 rounded-full ml-4 sm:ml-8">
                    <p>Pending</p>
                  </div>
                </a>
              </div>
              <div className=" flex justify-start items-center  relative">
                <input
                  className="text-sm leading-none text-left text-gray-600 px-4 py-3 w-full border rounded border-gray-300  outline-none"
                  type="text"
                  placeholder="Search"
                />
                <svg
                  className="absolute right-3 z-10 cursor-pointer"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  
                >
                  <path
                    d="M10 17C13.866 17 17 13.866 17 10C17 6.13401 13.866 3 10 3C6.13401 3 3 6.13401 3 10C3 13.866 6.13401 17 10 17Z"
                    stroke="#4B5563"
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 21L15 15"
                    stroke="#4B5563"
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              {user.isAdmin === true ? (
                <>
                  <button
                    onClick="popuphandler(true)"
                    className="mt-4 sm:mt-0 inline-flex items-start justify-start px-6 py-3 bg-indigo-700 hover:bg-indigo-600 focus:outline-none rounded invisible  lg:visible"
                  >
                    <p className="text-sm font-medium leading-none text-white">
                      Create Problem
                    </p>
                  </button>
                </>
              ) : null}
            </div>
            <div className="mt-7 overflow-x-auto">
              <table className="w-full whitespace-nowrap table-auto">
                <tbody>
                  {prob &&
                    prob.map((data, index) => (
                      <>
                        {user.problemSolved.includes(data.id) ? (
                          <>
                            {" "}
                            <tr className="h-16 border bg-green-500 border-gray-100  rounded " key={index}>
                              <td>
                                <div className="flex items-center pl-5">
                                  <p className="text-base font-medium leading-none text-gray-700 mr-2">
                                    {data.title}
                                  </p>
                                </div>
                              </td>

                              <td className="pl-5 invisible lg:visible"></td>
                              <td className="pl-5 invisible lg:visible"></td>
                              <td className="pl-5 invisible lg:visible">
                                <Moment
                                  date={data.createdAt}
                                  format="DD-MM-YYYY"
                                />
                              </td>
                              <td className="pl-5 invisible lg:visible">
                                <div className="flex gap-0 justify-center">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="icon icon-tabler icon-tabler-users"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2"
                                    stroke="currentColor"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path
                                      stroke="none"
                                      d="M0 0h24v24H0z"
                                      fill="none"
                                    ></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                    <path d="M21 21v-2a4 4 0 0 0 -3 -3.85"></path>
                                  </svg>
                                  <p className="col-span-1">
                                    {data.ans.length}
                                  </p>
                                </div>
                              </td>

                              <td className="pl-4  ">
                                <button
                                  className="text-sm leading-none bg-green-500 text-gray-600 py-3 px-5  rounded hover:bg-green-200 focus:outline-none"
                                  onClick={() => routeChange(data)}
                                >
                                  View
                                </button>
                              </td>
                            </tr>{" "}
                          </>
                        ) : (
                          <>
                            {" "}
                            <tr className="h-16 border border-gray-100  rounded ">
                              <td>
                                <div className="flex items-center pl-5">
                                  <p className="text-base font-medium leading-none text-gray-700 mr-2">
                                    {data.title}
                                  </p>
                                </div>
                              </td>

                              <td className="pl-5 invisible lg:visible"></td>
                              <td className="pl-5 invisible lg:visible"></td>
                              <td className="pl-5 invisible lg:visible">
                                <Moment
                                  date={data.createdAt}
                                  format="DD-MM-YYYY"
                                />
                              </td>
                              <td className="pl-5 invisible lg:visible">
                                <div className="flex gap-0 justify-center">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="icon icon-tabler icon-tabler-users"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2"
                                    stroke="currentColor"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path
                                      stroke="none"
                                      d="M0 0h24v24H0z"
                                      fill="none"
                                    ></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                    <path d="M21 21v-2a4 4 0 0 0 -3 -3.85"></path>
                                  </svg>
                                  <p className="col-span-1">
                                    {data.ans.length}
                                  </p>
                                </div>
                              </td>

                              <td className="pl-4  ">
                                <button
                                  className="text-sm leading-none text-gray-600 py-3 px-5 bg-gray-100 rounded hover:bg-gray-200 focus:outline-none"
                                  onClick={() => routeChange(data)}
                                >
                                  View
                                </button>
                              </td>
                            </tr>{" "}
                          </>
                        )}

                        <tr className="h-3" />
                      </>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
          {hide !== true ? (
            <div className="grid grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
              <button
                type="submit"
                class="col-start-2 col-span-1 lg:col-start-3  inline-block px-5 py-3 ml-3 text-sm font-medium text-white bg-blue-500 rounded-lg"
                onClick={(e) => {
                  handleShowMore(e);
                }}
              >
                {" "}
                Show More{" "}
              </button>
            </div>
          ) : null}
        </div>

        <style>
          {` .checkbox:checked + .check-icon {
                display: flex;
            }`}
        </style>
      </div>
    </>
  );
}

export default Home;
