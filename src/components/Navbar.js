import { Link } from "react-router-dom";
import React, { Component }  from 'react';
const Navbar = ({ user }) => {
  const logout = () => {
    window.open("http://localhost:3001/auth/logout", "_self");
  };
  return (
    <div className="navbar">
      <span className="logo">
       
      </span>
      {user ? (
        <ul className="list">
          <li className="listItem">
        
          </li>
          <li className="listItem">{user.name}</li>
          <li className="listItem" onClick={logout}>
            Logout
          </li>
        </ul>
      ) : (
        <Link className="link" to="login">
          Login
        </Link>
      )}
    </div>
  );
};

export default Navbar;