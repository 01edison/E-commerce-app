import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Layout from "../Layout";
import {
  isAuthenticated,
  purchaseHistory,
} from "../../helperMethods/functions";
import axios from "axios";
import { Url } from "../../config";
import { getUserInfo } from "../../helperMethods/functions";

const UserDashboard = () => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    role: "",
  });
  const history = useRef();
  const { name, email, role } = userInfo;
  const getPurchaseHistory = () => {
    const { token, user } = isAuthenticated();

    axios
      .get(`${Url}/order/history/${user._id}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        console.log(response);
        history.current = response.data.foundOrders;
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const userLinks = () => {
    return (
      <>
        <div className="col-lg-3">
          <div className="card">
            <h4 className="card-header">User Links</h4>
            <ul className="list-group">
              <li className="list-group-item">
                <Link className="nav-link" to="/user/cart">
                  My Cart
                </Link>
              </li>
              <li className="list-group-item">
                <Link className="nav-link" to="/profile/update">
                  Update Profile
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </>
    );
  };

  useEffect(() => {
    getUserInfo(userInfo, setUserInfo);
  }, [history]);

  useEffect(() => {
    getPurchaseHistory();
  });
  return (
    <>
      <Layout
        title="Dashboard"
        description={`Good day, ${name}`}
        className="container"
      >
        <div className="row">
          <div className="col-lg-9">
            <div className="card mb-5">
              <h3 className="card-header">User Information</h3>
              <ul className="list-group">
                <li className="list-group-item"> {name}</li>
                <li className="list-group-item"> {email}</li>
                <li className="list-group-item">
                  {role === 0 ? "Registered User" : "Administrator"}
                </li>
              </ul>
            </div>
            {}
          </div>
          {userLinks()}
        </div>
      </Layout>
    </>
  );
};

export default UserDashboard;
