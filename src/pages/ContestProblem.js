import React, { useEffect, useState } from "react";
import axios from "axios";
import { Routes, Route, useParams, useNavigate } from "react-router-dom";
function ContestProblem() {
  let { id } = useParams();
  const history = useNavigate();

  const getContestProblem = axios.create({
    withCredentials: true,
  });
  const [getSingleProb, setgetSingleProb] = useState([]);
  const [probDetail, setProbDetail] = useState([]);
  const [userTicket, setUserTicket] = useState([]);
  const [passed, setPassed] = useState(null);
  useEffect(() => {
    const handleGetSingleContest = async () => {
      await getContestProblem
        .get(`http://localhost:3001/contest/singleContest/${id}`)
        .then((res) => {
          setgetSingleProb(res.data.getContest);
          setProbDetail(res.data.probDetail);
          setUserTicket(res.data.grade);
          setPassed(res.data.passed);
        });
    };
    handleGetSingleContest();
  }, []);
  console.log(passed);
  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <table className="min-w-full">
              <thead className="border-b">
                <tr>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    id
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    Who answered
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    View
                  </th>
                </tr>
              </thead>
              <tbody>
                {getSingleProb?.probList?.length !== 0 ? (
                  <>
                    {getSingleProb[0]?.probList.map((data, index) => (
                      <>
                        <tr
                          className={` bg-white border-b
                           `}
                          key={index}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {index + 1}
                          </td>
                          <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            {probDetail[index].others.title}
                          </td>
                          <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            {probDetail[index].others.ans.length}
                          </td>
                          <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            {passed[index] === index ? "Passed" : "Not Passed"}
                          </td>

                          <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            <button
                              className="text-sm leading-none text-gray-600 py-3 px-5 bg-gray-100 rounded hover:bg-gray-200 focus:outline-none"
                              onClick={(e) => {
                                e.preventDefault();
                                history(
                                  `/SubmitContest/${probDetail[index].others.id}/${getSingleProb[0].id}`
                                );
                              }}
                            >
                              View
                            </button>
                          </td>
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
  );
}

export default ContestProblem;
