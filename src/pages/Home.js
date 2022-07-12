import React, { useContext, useEffect, useState } from "react";
import { userContext } from "../context/userContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home() {
  const user = useContext(userContext);
  const [show, setShow] = useState(null);
  const [prob, setProb] = useState([]);
  const getProblem = axios.create({
    withCredentials: true,
  });
  let navigate = useNavigate();
  const routeChange = (id) => {
    let path = `/prob/${id.id}`;
    navigate(path);
  };
  useEffect(() => {
    const getProb = async () => {
      await getProblem.get("https://seniorproject234.herokuapp.com/problem/10").then((prob) => {
        setProb(prob.data);
      });
    };
    if (prob.length === 0) {
      getProb();
    }
  });
  return (
    <>
      <div>
        <div className="sm:px-6 w-full">
          <div className="px-4 md:px-10 py-4 md:py-7">
            <div className="flex items-center justify-between">
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-normal text-gray-800">
                Tasks
              </p>
              <div className="py-3 px-4 flex items-center text-sm font-medium leading-none text-gray-600 bg-gray-200 hover:bg-gray-300 cursor-pointer rounded">
                <p>Sort By:</p>
                <select className="focus:outline-none bg-transparent ml-1">
                  <option className="text-sm text-indigo-800">Latest</option>
                  <option className="text-sm text-indigo-800">Oldest</option>
                  <option className="text-sm text-indigo-800">Latest</option>
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
              <button
                onClick="popuphandler(true)"
                className="mt-4 sm:mt-0 inline-flex items-start justify-start px-6 py-3 bg-indigo-700 hover:bg-indigo-600 focus:outline-none rounded invisible  lg:visible"
              >
                <p className="text-sm font-medium leading-none text-white">
                  Add Task
                </p>
              </button>
            </div>
            <div className="mt-7 overflow-x-auto">
              <table className="w-full whitespace-nowrap table-auto">
                <tbody>
                  {prob &&
                    prob.map((data) => (
                      <>
                        <tr className="h-16 border border-gray-100 rounded ">
                          <td className>
                            <div className="flex items-center pl-5">
                              <p className="text-base font-medium leading-none text-gray-700 mr-2">
                                {data.title}
                              </p>
                            </div>
                          </td>

                          <td className="pl-5 invisible lg:visible"></td>
                          <td className="pl-5 invisible lg:visible"></td>
                          <td className="pl-5 invisible lg:visible"></td>
                          <td className="pl-5 invisible lg:visible">
                            <div className="flex gap-0 justify-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="icon icon-tabler icon-tabler-user"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                stroke-width="2"
                                stroke="currentColor"
                                fill="none"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              >
                                <path
                                  stroke="none"
                                  d="M0 0h24v24H0z"
                                  fill="none"
                                ></path>
                                <circle cx="12" cy="7" r="4"></circle>
                                <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
                              </svg>
                              <p className="col-span-1">
                                {data.ans.length === 0 ? 0 : data.ans.length}
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
                        </tr>
                        <tr className="h-3" />
                      </>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
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
