import React, { Suspense, useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { userContext } from "./context/userContext";
import axios from "axios";
import Search from "./pages/Search";
import CreateProb from "./pages/CreateProb";
import CreateContest from "./pages/CreateContest";
import Contest from "./pages/Contest";
import ContestProblem from "./pages/ContestProblem";
import SubmitContest from "./pages/SubmitContest";
import UserProfile from "./pages/UserProfile";
import WrongPage from "./pages/404";
const App = () => {
  const [user, setUser] = useState(null);
  const [isuserAdmin, setUserAdmin] = useState(null);
  const [isAuth, setIsAuth] = React.useState(null);
  const serverUrl = "http://localhost:3001/auth/login/success";

  useEffect(() => {
    const getUser = async () => {
      const transport = axios.create({
        withCredentials: true,
      });
      transport.get(serverUrl).then((res) => {});
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
          setUserAdmin(resObject.user.isAdmin);
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
                path="/search"
                element={
                  isAuth !== null ? (
                    <>
                      {" "}
                      {isAuth === true ? (
                        <Search />
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
              <Route
                path="/Contest"
                element={
                  isAuth !== null ? (
                    <>
                      {" "}
                      {isAuth === true ? (
                        <Contest />
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
              <Route
                path="/Contest/:id"
                element={
                  isAuth !== null ? (
                    <>
                      {" "}
                      {isAuth === true ? (
                        <ContestProblem />
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
              <Route
                path="/SubmitContest/:probId/:contestId"
                element={
                  isAuth !== null ? (
                    <>
                      {" "}
                      {isAuth === true ? (
                        <SubmitContest />
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
              <Route
                path="/createProb"
                element={
                  isAuth !== null ? (
                    <>
                      {" "}
                      {isAuth === true ? (
                        isuserAdmin ? (
                          <CreateProb />
                        ) : (
                          <Navigate to="/login" />
                        )
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
              <Route
                path="/UserProfile"
                element={
                  isAuth !== null ? (
                    <>
                      {" "}
                      {isAuth === true ? (
                        isuserAdmin ? (
                          <UserProfile />
                        ) : (
                          <Navigate to="/login" />
                        )
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
              <Route
                path="/createContest"
                element={
                  isAuth !== null ? (
                    <>
                      {" "}
                      {isAuth === true ? (
                        isuserAdmin ? (
                          <CreateContest />
                        ) : (
                          <Navigate to="/login" />
                        )
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
              <Route path="*" element={<WrongPage />} />
            </Routes>
          </Suspense>
        </userContext.Provider>
      </BrowserRouter>
    </>
  );
};

export default App;
