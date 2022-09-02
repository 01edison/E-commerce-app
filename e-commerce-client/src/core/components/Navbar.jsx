import axios from "axios";
import React, { useEffect, useState } from "react";
import { Url } from "../../config";
import { NavLink, useNavigate } from "react-router-dom";
import { isAuthenticated } from "../../helperMethods/functions";

function Navbar() {
  const [numCartItems, setNumCartItems] = useState(0);

  // if (isAuthenticated() !== false) {
  //   // get user details from local storage

  //   setInterval(async () => {
  //     try {
  //       const res = await axios.get(`${Url}/user/${_id}`, {
  //         headers: {
  //           Authorization: token,
  //         },
  //       });
  //       // get the number of cart items directly from the database
  //     } catch (error) {}
  //   }, 1000);
  // }

  const { user = "", token } = isAuthenticated(); // default value of user will be empty string unless the user is actually logged in 
  useEffect(() => {
    axios
      .get(`${Url}/user/${user._id ? user._id : ""}`, {
        headers: {
          Authorization: token ? token : "",
        },
      })
      .then((res) => {
        setNumCartItems(res.data?.profile?.cart.length);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

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
        {isAuthenticated() && (
          <li className="nav-item">
            <NavLink
              className="nav-link"
              to="/user/cart"
              style={({ isActive }) => {
                return isActive ? { color: "#ff9900" } : { color: "#fff" };
              }}
            >
              My Cart{" "}
              <sup>
                <small className="badge badge-danger badge-pill mb-2">
                  {numCartItems}
                </small>
              </sup>
            </NavLink>
          </li>
        )}

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
