import CodeEditor from "@uiw/react-textarea-code-editor";
import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Reaptcha from "reaptcha";
import { userContext } from "../context/userContext";

function Prob() {
  const user = useContext(userContext);
  const [code, setCode] = React.useState("");
  const [lang, setLang] = React.useState("cpp");
  const [token, setToken] = React.useState(false);
  const [singleProb, setsingleProb] = React.useState(null);
  const [capchaRes, getcapchaRes] = React.useState(null);
  const [wrongAns, setwrongAns] = React.useState(null);
  const [answer, setAnswer] = React.useState(null);
  const [author, setAuthor] = React.useState(null);
  const [show, setShow] = useState(false);
  const [langsubmit, setLangsubmit] = useState(null)
  const [testInput, setTestInput] = useState([])
  const [testOutput, setTestOutput] = useState([])
  const id = useParams();
  let refContainer = useRef(null);

  const onButtonClick = () => {
    // `current` points to the mounted text input element
    refContainer.reset();
    handleClick();
    setToken(false);
  };
  const history = useNavigate();

  const transport = axios.create({
    withCredentials: true,
  });
  const onClickSubmit = async () => {
    setwrongAns(null);
    setToken(false);
    refContainer.reset();
    await transport
      .post("http://localhost:3001/submit", {
        code,
        lang:langsubmit,
        problemId: id.id,
        captcha: capchaRes,
      })
      .then(async (response) => {
        if (response.data === "Passed") {
          setwrongAns(false);
        } else {
          setAnswer(response.data);

          setwrongAns(true);
        }
      });
  };
  useEffect(() => {
    const getProbSingle = async ({ id }) => {
      const transport = axios.create({
        withCredentials: true,
      });

      transport
        .get(`http://localhost:3001/singleproblem/${id}`)
        .then(async (res) => {
          const Arry = res.data.testInput
          const ArryOutput = res.data.testOutput
          setTestOutput(ArryOutput)
          setTestInput(Arry)
          setsingleProb(res.data);
          await transport
            .get(`http://localhost:3001/user/${res.data.userCreated}`)
            .then((response) => {
              setAuthor(response.data[0]);
            });
        });
    };
    getProbSingle(id);
  }, [wrongAns]);
  useEffect(() =>
  {
      if(lang === "Python")
      {
        setLangsubmit("python3")
      }
      
      if(lang === "Java")
      {
        setLangsubmit("java")
      }
      if(lang === "cpp")
      {
        setLangsubmit("cpp")
      }
  },[lang])
  const handleClick = async () => {
    setwrongAns(null);

    await transport
      .post("http://localhost:3001/Testcompiler", {
        code,
        lang,
        problemId: id.id,
        captcha: capchaRes,
      })
      .then((res) => {
        if (res.data === "Passed") {
          setwrongAns(false);
        } else {
          setwrongAns(true);
        }
      })
      .catch((err) => {
        /* not hit since no 401 */
      });
  };
  
  return (
    <>
      {singleProb !== null ? (
        <>
          <div className="absolute w-full h-full">
            {/* Navigation starts */}
            {/* Mobile */}
            <div
              className={
                show
                  ? "w-full h-full absolute z-40  transform  translate-x-0 "
                  : "   w-full h-full absolute z-40  transform -translate-x-full"
              }
            >
              <div
                className="bg-gray-800 opacity-50 inset-0 fixed w-full h-full"
                onClick={() => setShow(!show)}
              />
            </div>
            {/* Mobile */}
            <nav className="w-full mx-auto bg-white shadow"></nav>
            {/* Navigation ends */}
            {/* Page title starts */}
            <div className="my-6 lg:my-12 container px-6 mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between pb-4 border-b border-gray-300">
              <div>
                <h4 className="text-3xl lg:text-6xl  font-bold leading-tight text-gray-800">
                  {singleProb.title}
                </h4>
                <ul className="flex flex-col md:flex-row items-start md:items-center text-gray-600 text-sm mt-3">
                  <li className="flex items-center mr-3 mt-3 md:mt-0">
                    <span className="mr-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon icon-tabler icon-tabler-paperclip"
                        width={16}
                        height={16}
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" />
                        <path d="M15 7l-6.5 6.5a1.5 1.5 0 0 0 3 3l6.5 -6.5a3 3 0 0 0 -6 -6l-6.5 6.5a4.5 4.5 0 0 0 9 9 l6.5 -6.5" />
                      </svg>
                    </span>
                    <span>{singleProb.ans.length}</span>
                  </li>
                  {author !== null ? (
                    <li className="flex items-center mr-3 mt-3 md:mt-0">
                      <svg
                        className="mr-2"
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
                      <span>{author.name} </span>
                    </li>
                  ) : null}
                </ul>
              </div>
              <div className="mt-6 lg:mt-0">
                <button
                  className="mx-2 my-2 bg-white transition duration-150 ease-in-out focus:outline-none hover:bg-gray-100 rounded text-indigo-700 px-6 py-2 text-sm"
                  onClick={(e) => {
                    e.preventDefault();
                    history("/");
                  }}
                >
                  Back
                </button>
                <button
                  className={`transition duration-150  mx-8 ease-in-out ${
                    token !== true ? `opacity-50 cursor-not-allowed` : null
                  } focus:outline-none border bg-indigo-700 rounded text-white px-8 py-2 text-sm`}
                  onClick={onButtonClick}
                  disabled={!token}
                >
                  Test
                </button>
                <button
                  className={`transition duration-150 ease-in-out ${
                    token !== true ? `opacity-50 cursor-not-allowed` : null
                  }   focus:outline-none border bg-sky-700 rounded text-white px-8 py-2 text-sm`}
                  onClick={onClickSubmit}
                  disabled={!token}
                >
                  Submit
                </button>
                <div className="py-3 px-4 flex items-center  max-w-md text-sm font-medium leading-none text-gray-600 bg-gray-200 hover:bg-gray-300 cursor-pointer rounded">
                  <p>Selected Lang:</p>

                  <select
                    onChange={(e) => {
                      setLang(e.target.value);
                    }}
                    value={lang}
                    className="focus:outline-none bg-transparent ml-1"
                  >
                    <option value="cpp" className="text-sm text-indigo-800">
                      C/C++
                    </option>
                    <option value="Python" className="text-sm text-indigo-800">
                      Python
                    </option>
                    <option value="Java" className="text-sm text-indigo-800">
                      Java
                    </option>
                   
                  </select>
                </div>
                {wrongAns !== null ? (
                  <div
                    className={`p-4 mt-2 ${
                      wrongAns === false
                        ? "text-green-700  border-green-900/10 bg-green-50"
                        : "text-red-700  border-red-900/10 bg-red-50"
                    }  border rounded`}
                  >
                    <strong className="text-sm font-medium">
                      {" "}
                      You Are {wrongAns === true ? "Not" : null} Passed{" "}
                      {answer !== null && wrongAns === true ? answer : null}
                    </strong>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Page title ends */}
            <div className="container mx-auto px-6">
              {/* Remove class [ h-64 ] when adding a card block */}
              {/* Remove class [ border-dashed border-2 border-gray-300 ] to remove dotted border */}
              <div className="w-full h-64 rounded  ">
                <div className="mb-8">
                  <div className="mb-8">
                    <strong className="text-2xl xl:text-5xl   font-medium ">
                      {" "}
                      Description:{" "}
                    </strong>
                  </div>
                  <p>{singleProb.desc}</p>
                </div>
                <div className="mb-10   ">
                  <div className="my-10  p-8 border border-gray-100 shadow-xl rounded-xl">
                    <div className="mt-4 text-gray-500 sm:pr-8 ">
                      <h5 className="mt-4 text-xl font-bold text-gray-900 ">
                        Input:
                      </h5>
                      {
                        testInput.map(data =>(<>
                           <p className="subpixel-antialiased">
                        {data} 
                      </p></>))
                   
                      }
                      
                    </div>
                  </div>
                </div>
                <div className="mb-10   ">
                  <div className="my-20  p-8 border border-gray-100 shadow-xl rounded-xl">
                    <div className="mt-4 text-gray-500 sm:pr-8 ">
                      <h5 className="mt-4 text-xl font-bold text-gray-900 ">
                        Output:
                      </h5>
                      {
                        testOutput.map(data =>(<>
                           <p className="subpixel-antialiased">
                        {data} 
                      </p></>))
                   
                      }
                    </div>
                  </div>
                </div>

                <CodeEditor
                  value={code}
                  language={lang}
                  placeholder="Please enter the code."
                  onChange={(evn) => setCode(evn.target.value)}
                  padding={15}
                  style={{
                    fontSize: 30,
                    backgroundColor: "#f5f5f5",
                    fontFamily:
                      "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
                  }}
                />
                <Reaptcha
                  ref={(e) => (refContainer = e)}
                  sitekey="6LemUxAUAAAAANmEr4N1jZRIw3xQmfNuHZCd7dqa"
                  onVerify={(recaptchaResponse) => {
                    getcapchaRes(recaptchaResponse);
                    setToken(true);
                  }}
                  className="mt-10"
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <div>Loading</div>
      )}
    </>
  );
}

export default Prob;
