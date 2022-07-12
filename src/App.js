import React, { Suspense, useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { userContext } from "./context/userContext";
import axios from "axios";

const App = () => {
  const [user, setUser] = useState(null);
  let [isAuth, setIsAuth] = React.useState(null);
  const serverUrl = "https://seniorproject234.herokuapp.com/auth/login/success";

  useEffect(() => {
    const getUser = async () => {
      axios.get(serverUrl, { withCredentials: true }).then((res) => {
        console.log(res.data)
      });
      await fetch(serverUrl, {
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
          setIsAuth(true);
        })
        .catch((err) => {
          setIsAuth(false);
        });
    };
    getUser();
  }, []);
  const Home = React.lazy(() => import("./pages/Home"));
  const Login = React.lazy(() => import("./pages/Login"));
  const Prob = React.lazy(() => import("./components/Prob"));
  const Loading = React.lazy(() => import("./pages/Loading"));
  const Navbar = React.lazy(() => import("./components/Navbar"));
  return (
    <>
      <BrowserRouter>
        <userContext.Provider value={user}>
          <Suspense fallback={<p> Loading...</p>}>
            <Navbar />
            <Routes>
              <Route
                path="/"
                element={user ? <Home /> : <Navigate to="/login" />}
              />
              <Route
                path="/login"
                element={user ? <Navigate to="/" /> : <Login />}
              />
              <Route
                path="/prob/:id"
                element={
                  isAuth !== null ? (
                    <>
                      {" "}
                      {isAuth === true ? (
                        <Prob />
                      ) : (
                        <Navigate to="/login" />
                      )}{" "}
                    </>
                  ) : (
                    <>
                      {isAuth === false ? (
                        <Navigate to="/login" />
                      ) : (
                        <Loading />
                      )}
                    </>
                  )
                }
              />
            </Routes>
          </Suspense>
        </userContext.Provider>
      </BrowserRouter>
    </>
  );
};

export default App;
