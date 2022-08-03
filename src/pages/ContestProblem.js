import axios from "axios";
import { format, fromUnixTime, intervalToDuration } from "date-fns";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
function ContestProblem() {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [hour, setHour] = useState(0);
  const [activate, setActivate] = useState(0)
  
  useEffect(() => {
    let myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        if (minutes === 0 && hour !== 0) {
          setHour(hour - 1);
          setSeconds(59);
          setMinutes(59);
        }
        if (minutes !== 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
        if (minutes === 0 && hour === 0) {
          if(activate !== 0)
          {
            history("/")
          }
          clearInterval(myInterval);
        }
      }
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  });
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
          const result = fromUnixTime(
            parseInt(res.data.getContest[0].dateEnded) / 1000
          );
          const Time = Date.now();
          const Test = intervalToDuration({
            start: Time,
            end: fromUnixTime(
              parseInt(res.data.getContest[0].dateEnded) / 1000
            ),
          });

          setHour(
            parseInt(Test.hours) +
              parseInt(Test.days * 24) +
              parseInt(Test.months * 30 * 24)
          );
          setActivate(activate +1)
          setSeconds(Test.seconds);
          setMinutes(Test.minutes);

        });
    };
    handleGetSingleContest();
  }, []);
  return (
    <>
      <div className="px-4 md:px-10 py-4 md:py-7">
        <div className="flex items-center justify-between">
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-normal text-gray-800">
            Problem
          </p>
          <div className="py-3 px-4 flex items-center text-sm font-bold leading-none text-gray-600  ">
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-normal text-gray-800">
              Your Grade: {userTicket?.grade}
            </p>
          </div>
        </div>
        <div>
          {minutes === 0 && seconds === 0 ? null : (
            <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-normal text-gray-800">
              {"Time Left: "}
              {hour}:{minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </h1>
          )}
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
                      className="text-sm lg:text-xl font-bold text-gray-900 px-6 py-4 text-left"
                    >
                      Id
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
                      Who answered
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
                  {getSingleProb?.probList?.length !== 0 ? (
                    <>
                      {getSingleProb[0]?.probList.map((data, index) => (
                        <>
                          <tr
                            className={` bg-white border-b
                           `}
                            key={index}
                          >
                            <td className="px-6 py-4 lg:text-xl whitespace-nowrap text-sm font-bold text-gray-900">
                              {index + 1}
                            </td>
                            <td className="text-sm lg:text-xl text-gray-900 font-semibold px-6 py-4 whitespace-nowrap">
                              {probDetail[index].others.title}
                            </td>
                            <td className="text-sm lg:text-xl text-gray-900 font-semibold px-6 py-4 whitespace-nowrap">
                              {probDetail[index].others.ans.length}
                            </td>
                            <td
                              className={`text-sm ${
                                passed[index] === index
                                  ? "text-green-500"
                                  : "text-red-500"
                              } lg:text-xl font-semibold px-6 py-4 whitespace-nowrap`}
                            >
                              {passed[index] === index
                                ? "Passed"
                                : "Not Passed"}
                            </td>

                            <td className="text-sm text-gray-900 lg:text-xl font-semibold px-6 py-4 whitespace-nowrap">
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
    </>
  );
}

export default ContestProblem;
