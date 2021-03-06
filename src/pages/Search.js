import React, { useContext, useEffect, useState } from "react";
import { userContext } from "../context/userContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Moment from "react-moment";

function Search() {
    const user = useContext(userContext);
  const [show, setShow] = useState(null);
  const [prob, setProb] = useState([]);
  const [mode, setMode] = useState("desc");
  const [hide, setHide] = useState(false);
  const [query, setQuery] = useState("")
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
      .post(`http://localhost:3001/problem/finds/${mode}/${probsize}`,{
        query
      })
      .then((newProb) => {
        if (newProb.data.totalLength > prob.length ) {
          for (let i = 0; i < newProb.data.getProb.length; i++) {
            setProb((oldArray) => [...oldArray, newProb.data.getProb[i]]);
            
          }
          setHide(false)
        }
        if (newProb.data.hasMore === false) {
          setHide(true);
        }
        if (newProb.data === "Not Found") {
          setHide(true);
        }
      });
  };
  useEffect(() => {
    const getProb = async () => {
      await getProblem
        .post(`http://localhost:3001/problem/find/${mode}/${prob.length}`,{
            query
        })
        .then((prob) => {
          
          if(prob.data === "Not Found")
          {
            setHide(true)
            setProb([])
            
          }else
          {
            setProb(prob.data.getProb);

          }

        });
    };
    setHide(false);
    getProb();
  }, [mode,query]);
  return (
    <>
     <div className="flex px-10 my-3 items-center justify-between">
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-normal text-gray-800">
                Problems
              </p>
              <div className="py-3 px-4 flex items-center text-sm font-medium leading-none text-gray-600 bg-gray-200 hover:bg-gray-300 cursor-pointer rounded">
                <p>Sort By:</p>
                <select
                  className="focus:outline-none bg-transparent ml-1"
                  onChange={(e) => {
                    setMode(e.target.value)
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
            <div className="bg-white py-4 md:py-4 px-4 md:px-8 xl:px-10">
            <div className="sm:flex items-center justify-between ">
             
              <div className=" flex justify-start  items-center  relative">
                <input
                  className="text-sm leading-none  text-left text-gray-600 px-4 py-3 w-full border rounded border-gray-300  outline-none"
                  type="text"
                  placeholder="Search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
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
              
            </div>
            <div className="mt-7 overflow-x-auto">
              <table className="w-full whitespace-nowrap table-auto">
                <tbody>
                {prob &&
                    prob.map((data, index) => (
                      <>
                        {data.ans.includes(user.id) ? (
                          <>
                            <tr
                              className="h-16 border bg-green-500 border-gray-100  rounded "
                              key={index}
                            >
                              <td>
                                <div className="flex bg-green-500 items-center pl-5">
                                  <p className="text-base font-medium leading-none text-gray-700 mr-2">
                                    {data.title}
                                  </p>
                                </div>
                              </td>

                              <td className="pl-5 bg-green-500 "></td>
                              <td className="pl-5 bg-green-500  "></td>
                              <td className="pl-5 bg-green-500  ">
                                <Moment
                                  date={data.createdAt}
                                  format="DD-MM-YYYY"
                                />
                              </td>
                              <td className="pl-5  bg-green-500 ">
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
                            </tr>
                          </>
                        ) : (
                          <>
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
                            </tr>
                          </>
                        )}

                        <tr className="h-3" />
                      </>
                    ))}
                </tbody>
              </table>
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
    </>
  );
}

export default Search;
