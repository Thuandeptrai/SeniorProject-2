import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { userContext } from "./context/userContext";
const App = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const getUser = () => {
      fetch("http://localhost:3001/auth/login/success", {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
        },
      })
        .then((response) => {
          if (response.status === 200) return response.json();
          throw new Error("authentication has been failed!");
        })
        .then((resObject) => {
          setUser(resObject.user);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getUser();
  }, []);
  return (
    <userContext.Provider value={user}>

    <BrowserRouter>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <Login />}
            />
          <Route
            path="/post/:id"
            element={user ? <Home /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </BrowserRouter>
            </userContext.Provider>
  );
};

export default App;