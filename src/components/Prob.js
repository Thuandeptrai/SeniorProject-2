import React, { useEffect, useRef, useState } from "react";
import CodeEditor from "@uiw/react-textarea-code-editor";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import Navbar from "./Navbar";
import { useContext } from "react";
import { userContext } from "../context/userContext";
import { Navigate, useParams } from "react-router-dom";
import Reaptcha from "reaptcha";

function Prob() {
  const user = useContext(userContext);
  const [code, setCode] = React.useState(`var a=1;`);
  const [stdin, setStdin] = React.useState(null);
  const [lang, setLang] = React.useState("cpp");
  const [token, setToken] = React.useState(false);
  const [singleProb, setsingleProb] = React.useState(null);
  const [capchaRes, getcapchaRes] = React.useState(null)
  const id = useParams();
  let refContainer = useRef(null);

  const onButtonClick = () => {
    // `current` points to the mounted text input element
    refContainer.reset();
    handleClick()
  };

  const transport = axios.create({
    withCredentials: true,
  });
  useEffect(() => {
    const getProbSingle = async ({ id }) => {
      const transport = axios.create({
        withCredentials: true,
      });

      transport.get(`http://localhost:3001/singleproblem/${id}`).then((res) => {
        setsingleProb(res.data);
      });
    };
    getProbSingle(id);
  }, []);
  const handleClick = async () => {
 
    await transport
      .post("http://localhost:3001/Testcompiler", {
        code,
        lang,
        problemId:id.id
      })
      .then((res) => console.log(res.data))
      .catch((err) => {
        /* not hit since no 401 */
      });
  };
  const [show, setShow] = useState(false);
  const [product, setProduct] = useState(false);
  const [deliverables, setDeliverables] = useState(false);
  const [profile, setProfile] = useState(false);
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
                <h4 className="text-2xl font-bold leading-tight text-gray-800">
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
                    <span>Active</span>
                  </li>
                  <li className="flex items-center mr-3 mt-3 md:mt-0">
                    <span className="mr-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon icon-tabler icon-tabler-trending-up"
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
                        <polyline points="3 17 9 11 13 15 21 7" />
                        <polyline points="14 7 21 7 21 14" />
                      </svg>
                    </span>
                    <span> Trending</span>
                  </li>
                  <li className="flex items-center mt-3 md:mt-0">
                    <span className="mr-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon icon-tabler icon-tabler-plane-departure"
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
                        <path
                          d="M15 12h5a2 2 0 0 1 0 4h-15l-3 -6h3l2 2h3l-2 -7h3z"
                          transform="rotate(-15 12 12) translate(0 -1)"
                        />
                        <line x1={3} y1={21} x2={21} y2={21} />
                      </svg>
                    </span>
                    <span>Started on 29 Jan 2020</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 lg:mt-0">
                <button className="mx-2 my-2 bg-white transition duration-150 ease-in-out focus:outline-none hover:bg-gray-100 rounded text-indigo-700 px-6 py-2 text-sm">
                  Back
                </button>
                <button className="transition duration-150 ease-in-out hover:bg-sky-500 focus:outline-none border bg-sky-700 rounded text-white px-8 py-2 text-sm">
                  Edit Profile
                </button>
                <button
                  className={`transition duration-150  mx-8 ease-in-out ${
                    token !== true ? `opacity-50 cursor-not-allowed` : null
                  } focus:outline-none border bg-indigo-700 rounded text-white px-8 py-2 text-sm`}
                  onClick={onButtonClick}
                >
                  Submit
                </button>
              </div>
            </div>
            {/* Page title ends */}
            <div className="container mx-auto px-6">
              {/* Remove class [ h-64 ] when adding a card block */}
              {/* Remove class [ border-dashed border-2 border-gray-300 ] to remove dotted border */}
              <div className="w-full h-64 rounded ">
                <p>{singleProb.title}</p>
                <select
                  onChange={(e) => {
                    setLang(e.target.value);
                  }}
                  value={lang}
                >
                  <option value="cpp17">C/C++</option>
                  <option value="Python">Python</option>
                  <option value="Java">Java</option>
                  <option value="Javascript">Javascript</option>
                </select>
                <CodeEditor
                  value={code}
                  language={lang}
                  placeholder="Please enter JS code."
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
                    getcapchaRes(recaptchaResponse)
                    setToken(true);
                  }}
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
