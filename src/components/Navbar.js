import { Link, Navigate, useNavigate } from "react-router-dom";
import React, { Component, useContext, useState } from "react";
import { userContext } from "../context/userContext";
const Navbar = () => {
  const history = useNavigate();
  const logout = () => {
    window.open("http://localhost:3001/auth/logout", "_self");
  };
  let arr = [true, false, false, false, false, false];
  const [style, setStyle] = useState(arr);
  const [dropDown, setDropDown] = useState(true);
  const [text, setText] = useState("");

  const selected = (props) => {
    let newArr = [...arr];
    for (let i = 0; i < newArr.length; i++) {
      newArr[i] = false;
    }
    newArr[props] = true;
    setStyle(newArr);
  };

  const setSelectedText = (txt) => {
    setText(txt);
    setDropDown(true);
  };
  const user = useContext(userContext);

  return (
    <div className="2xl:container 2xl:mx-auto ">
      <div className="bg-white rounded shadow-lg py-5 px-7">
        <nav className="flex justify-between">
          <div
            className="flex items-center space-x-3 lg:pr-16 pr-6 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              history("/");
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#000000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <h2 className="font-normal text-2xl leading-6 text-gray-800 ">
              Home
            </h2>
          </div>
          {/* For medium and plus sized devices */}
          {user !== null ? (
            <ul className="hidden md:flex flex-auto space-x-2">
              <li
                className={`${
                  style[0]
                    ? "text-white bg-indigo-600"
                    : "text-gray-600 border border-white bg-gray-50"
                }  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800  cursor-pointer px-3 py-2.5 font-normal text-xs leading-3 shadow-md rounded`}
              >
                Contest
              </li>
            </ul>
          ) : null}
          {user !== null ? (
            <div className=" flex space-x-5 justify-center items-center pl-2 cursor-pointer" onClick={logout}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#000000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10 3H6a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h4M16 17l5-5-5-5M19.8 12H9" />
              </svg>
            </div>
          ) : null}
        </nav>
        {/* for smaller devcies */}
        {user !== null ? (
          <div className="block md:hidden w-full mt-5 "></div>
        ) : null}
      </div>
    </div>
  );
};

export default Navbar;
