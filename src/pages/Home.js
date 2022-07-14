import React, { useContext, useEffect, useState } from "react";
import { userContext } from "../context/userContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home() {
  const user = useContext(userContext);
  const [show, setShow] = useState(null);
  const [prob, setProb] = useState([]);
  const [hide, setHide] = useState(false)
  const getProblem = axios.create({
    withCredentials: true,
  });
  let navigate = useNavigate();
  const routeChange = (id) => {
    let path = `/prob/${id.id}`;
    navigate(path);
  };
  const handleShowMore = async () => {
    let probsize = prob.length;
    await getProblem
      .get(`http://localhost:3001/problem/${probsize}`)
      .then((newProb) => {
        if (newProb.data !== "Full") {
          for (let i = 0; i < newProb.data.length; i++) {
            setProb((oldArray) => [...oldArray, newProb.data[i]]);
          }
       
        }
        if(newProb.data === "Full")
        {
        setHide(true)

        }
      });
  };
  useEffect(() => {
    const getProb = async () => {
      await getProblem.get("http://localhost:3001/problem/0").then((prob) => {
        setProb(prob.data);
      });
    };
    if (prob.length === 0) {
      getProb();
    }
  }, []);
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
                                class="icon icon-tabler icon-tabler-users"
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
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                <path d="M21 21v-2a4 4 0 0 0 -3 -3.85"></path>
                              </svg>
                              <p className="col-span-1"></p>
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
          { hide !== true ?
          <div className="grid grid-cols-3 lg:grid-cols-5 gap-4 mb-10">


          <button 
            type="submit"
            class="col-start-2 col-span-1 lg:col-start-3  inline-block px-5 py-3 ml-3 text-sm font-medium text-white bg-blue-500 rounded-lg"
            onClick={handleShowMore}
            >
            {" "}
            Show More{" "}
          </button>
            </div>
            :null  }
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
