import CodeEditor from "@uiw/react-textarea-code-editor";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import Reaptcha from "reaptcha";
import Editor from "@monaco-editor/react";
import { defineTheme } from "../lib/defineTheme";
import ThemeDropdown from "../components/themeDropDown";

function SubmitContest() {
  const [code, setCode] = React.useState("");
  const [lang, setLang] = React.useState({ value: "cpp", label: "C/C++" });
  const [token, setToken] = React.useState(false);
  const [singleProb, setsingleProb] = React.useState(null);
  const [capchaRes, getcapchaRes] = React.useState(null);
  const [wrongAns, setwrongAns] = React.useState(null);
  const [answer, setAnswer] = React.useState(null);
  const [author, setAuthor] = React.useState(null);
  const [show, setShow] = useState(false);
  const [langsubmit, setLangsubmit] = useState(null);
  const [testInput, setTestInput] = useState([]);
  const [testOutput, setTestOutput] = useState([]);
  const [processing, setProcessing] = useState(null);
  const [theme, setTheme] = useState("cobalt");
  const { contestId, probId } = useParams();
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
    setProcessing(true);
    setwrongAns(null);
    setToken(false);
    refContainer.reset();
    await transport
      .post(`http://localhost:3001/contest/submit/${probId}/${contestId}`, {
        code,
        lang: langsubmit,

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
    setProcessing(false);
  };
  useEffect(() => {
    const getProbSingle = async () => {
      const transport = axios.create({
        withCredentials: true,
      });

      transport
        .get(`http://localhost:3001/contest/problem/${probId}/${contestId}`)
        .then(async (res) => {
          const Arry = res.data.testInput;
          const ArryOutput = res.data.testOutput;
          setTestOutput(ArryOutput);
          setTestInput(Arry);
          setsingleProb(res.data);
          await transport
            .get(`http://localhost:3001/user/${res.data.userCreated}`)
            .then((response) => {
              setAuthor(response.data[0]);
            });
        });
    };
    getProbSingle();
  }, [wrongAns]);
  useEffect(() => {
    if (lang.value === "python") {
      setLangsubmit("python3");
    }

    if (lang.value === "java") {
      setLangsubmit("java");
    }
    if (lang.value === "cpp") {
      setLangsubmit("cpp");
    }
  }, [lang]);
  const handleClick = async () => {
    setwrongAns(null);
    setProcessing(true);
    await transport
      .post(`http://localhost:3001/contest/testCompiler/${probId}/${contestId}`, {
        code,
        lang: langsubmit,
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
    setProcessing(false);
  };
  function handleEditorChange(value, event) {
    setCode(value);
  }
  function handleThemeChange(th) {
    const theme = th;

    if (["light", "vs-dark"].includes(theme.value)) {
      setTheme(theme);
    } else {
      defineTheme(theme.value).then((_) => setTheme(theme.value));
    }
  }
  useEffect(() => {
    defineTheme("oceanic-next").then((_) =>
      setTheme({ value: "oceanic-next", label: "Oceanic Next" })
    );
  }, []);
  const options = [
    { value: "cpp", label: "C/C++" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
  ];

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
                    history(`/contest/${contestId}`);
                  }}
                >
                  Back
                </button>
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
                <div className="mb-5   ">
                  <div className="my-5  p-8 border border-gray-100 shadow-xl rounded-xl">
                    <div className="mt-4 text-gray-500 sm:pr-8 ">
                      <h5 className="mt-4 text-xl font-bold text-gray-900 ">
                        Input:
                      </h5>
                      {testInput.map((data, index) => (
                        <>
                          <p key={index} className="subpixel-antialiased">
                            {"Testcase"} {index + 1}
                            {": "} {data}
                          </p>
                        </>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mb-5   ">
                  <div className="my-5  p-8 border border-gray-100 shadow-xl rounded-xl">
                    <div className="mt-4 text-gray-500 sm:pr-8 ">
                      <h5 className="mt-4 text-xl font-bold text-gray-900 ">
                        Output:
                      </h5>
                      {testOutput.map((data, index) => (
                        <>
                          <p key={index} className="subpixel-antialiased">
                            {"Testcase"} {index + 1}
                            {": "} {data}
                          </p>
                        </>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="container px-3 mx-auto flex flex-row items-start lg:items-center justify-between pb-4 border-b border-gray-300">
                  <div>
                    <Select
                      onChange={setLang}
                      options={options}
                      value={lang}
                      defaultValue={lang}
                      className="focus:outline-none bg-transparent ml-1"
                      isSearchable={false}
                    />
                  </div>

                  <div>
                    <ThemeDropdown
                      handleThemeChange={handleThemeChange}
                      theme={theme}
                    />
                  </div>
                </div>
                <Editor
                  height="65vh"
                  width={`100%`}
                  language={lang.value || "javascript"}
                  value={code}
                  theme={theme}
                  defaultValue="// some comment"
                  onChange={handleEditorChange}
                />
                <div className=" container px-3 mx-auto flex  flex-col items-center lg:flex-row items-start lg:items-center justify-between pb-4 border-b border-gray-300">
                  <Reaptcha
                    ref={(e) => (refContainer = e)}
                    sitekey="6LemUxAUAAAAANmEr4N1jZRIw3xQmfNuHZCd7dqa"
                    onVerify={(recaptchaResponse) => {
                      getcapchaRes(recaptchaResponse);
                      setToken(true);
                    }}
                    className="mt-5"
                  />
                  <div>
                    {wrongAns !== null ? (
                      <div
                        className={`p-4 mt-2  ${
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
                  <div>
                    <button
                      className={`transition duration-150 mt-5 mx-8 ease-in-out ${
                        token !== false ? `opacity-50 cursor-not-allowed` : null
                      } focus:outline-none border bg-indigo-700 rounded text-white px-8 py-2 text-sm`}
                      onClick={onButtonClick}
                    >
                      {processing ? "Loading" : "Test"}
                    </button>
                    <button
                      className={`transition duration-150 ease-in-out ${
                        token !== false ? `opacity-50 cursor-not-allowed` : null
                      }   focus:outline-none border bg-sky-700 rounded text-white px-8 py-2 text-sm`}
                      onClick={onClickSubmit}
                    >
                      {processing ? "Loading" : "Submit"}
                    </button>
                  </div>
                </div>
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

export default SubmitContest;
