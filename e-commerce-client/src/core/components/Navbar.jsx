import axios from "axios";
import React, { useState } from "react";

import { NavLink, useNavigate } from "react-router-dom";
import { isAuthenticated } from "../../helperMethods/functions";

function Navbar() {
  

  const navigate = useNavigate();
  return (
    <>
      <ul className="nav nav-tabs bg-primary">
        <li className="nav-item">
          <NavLink
            className="nav-link"
            to="/"
            style={({ isActive }) => {
              return isActive ? { color: "#ff9900" } : { color: "#fff" };
            }}
          >
            Home
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            className="nav-link"
            to="/shop"
            style={({ isActive }) => {
              return isActive ? { color: "#ff9900" } : { color: "#fff" };
            }}
          >
            Shop
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink
            className="nav-link"
            to="/admin/dashboard"
            style={({ isActive }) => {
              return isActive ? { color: "#ff9900" } : { color: "#fff" };
            }}
          >
            Dashboard
          </NavLink>
        </li>

        {!isAuthenticated() && (
          <li className="nav-item">
            <NavLink
              className="nav-link"
              to="/login"
              style={({ isActive }) => {
                return isActive ? { color: "#ff9900" } : { color: "#fff" };
              }}
            >
              Login
            </NavLink>
          </li>
        )}
        {!isAuthenticated() && (
          <li className="nav-item">
            <NavLink
              className="nav-link"
              to="/register"
              style={({ isActive }) => {
                return isActive ? { color: "#ff9900" } : { color: "#fff" };
              }}
            >
              Register
            </NavLink>
          </li>
        )}
        {isAuthenticated() && (
          <li className="nav-item">
            <a
              className="nav-link"
              href=""
              style={{ color: "#fff", cursor: "pointer" }}
              onClick={() => {
                if (typeof window !== "undefined") {
                  localStorage.removeItem("jwt");
                  axios
                    .get("http://localhost:4000/logout")
                    .then((response) => {
                      console.log("signout", response);
                    })
                    .catch((error) => console.log(error));
                  navigate("/");
                }
              }}
            >
              Logout
            </a>
          </li>
        )}
      </ul>
    </>
  );
}

export default Navbar;
