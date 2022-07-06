
import React, { Component }  from 'react';
const Login = () => {
  const google = () => {
    window.open("http://localhost:3001/auth/google", "_self");
  };


  return (
    <div className="login">
      <h1 className="loginTitle">Login</h1>
      <div className="wrapper">
        <div className="left">
          <div className="loginButton google" onClick={google}>
           
            Google
          </div>
     
        
        </div>
       
      </div>
    </div>
  );
};

export default Login;