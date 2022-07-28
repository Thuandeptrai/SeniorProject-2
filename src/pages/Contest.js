import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userContext } from "../context/userContext";

function Contest() {
  const getContest = axios.create({
    withCredentials: true,
  });

  const user = useContext(userContext);
  const history = useNavigate();
  const [contest, setContest] = useState([]);
  const [update, setUpdate] = useState(0);

  const handleJoinContest = async (contestId) => {
    getContest
      .get(`http://localhost:3001/contest/joinContest/${contestId}`)
      .then(async () => {
        await getContest
          .get("http://localhost:3001/contest/getAll")
          .then((res) => {
            setContest(res.data);
            setUpdate(1);
          });
      });
  };
  useEffect(() => {
    const getContestaxios = async () => {
      await getContest
        .get("http://localhost:3001/contest/getAll")
        .then((res) => {
          setContest(res.data);
        });
    };
    getContestaxios();
  }, [update]);
  return (
    <>
      <div className="px-4 md:px-10 py-4 md:py-7">
        <div className="flex items-center justify-between">
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-normal text-gray-800">
            Contest
          </p>
          <div className="py-3 px-4 flex items-center text-sm font-medium leading-none text-gray-600  cursor-pointer rounded">
            {user.isAdmin === true ? (
              <>
                <button
                  className="mt-4 sm:mt-0 inline-flex items-start justify-start px-6 py-3 bg-indigo-700 hover:bg-indigo-600 focus:outline-none rounded invisible  lg:visible"
                  onClick={(e) => {
                    e.preventDefault();
                    history("/createContest");
                  }}
                >
                  <p className="text-sm font-medium leading-none text-white">
                    Create Contest
                  </p>
                </button>
              </>
            ) : null}
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th
                      scope="col"
                      className="text-sm lg:text-xl  font-bold text-gray-900 px-6 py-4 text-left"
                    >
                      id
                    </th>
                    <th
                      scope="col"
                      className="text-sm lg:text-xl  font-bold text-gray-900 px-6 py-4 text-left"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="text-sm lg:text-xl  font-bold text-gray-900 px-6 py-4 text-left"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="text-sm lg:text-xl  font-bold text-gray-900 px-6 py-4 text-left"
                    >
                      View
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {contest.length !== 0 ? (
                    <>
                      {contest.map((data, index) => (
                        <>
                          <tr className="bg-white border-b">
                            <td className="text-sm lg:text-xl  font-bold text-gray-900 px-6 py-4 text-left">
                              {index + 1}
                            </td>
                            <td className="text-sm lg:text-xl  font-bold text-gray-900 px-6 py-4 text-left">
                              {data.title}
                            </td>
                            <td className="text-sm lg:text-xl  font-bold text-gray-900 px-6 py-4 text-left">
                              {data.status}
                            </td>
                            {data.status !== "Not Start" ? (
                              <>
                                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                  {data.IsJoined === false ? (
                                    <button
                                      className="text-sm lg:text-xl  font-bold  leading-none text-gray-600 py-3 px-5 bg-gray-100 rounded hover:bg-gray-200 focus:outline-none"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleJoinContest(data.id);
                                      }}
                                    >
                                      Join the contest
                                    </button>
                                  ) : (
                                    <button
                                      className="text-sm lg:text-xl  font-bold  leading-none text-gray-600 py-3 px-5 bg-gray-100 rounded hover:bg-gray-200 focus:outline-none"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        history(`${data.id}`);
                                      }}
                                    >
                                      View
                                    </button>
                                  )}
                                </td>
                              </>
                            ) : null}
                          </tr>
                        </>
                      ))}
                    </>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Contest;
