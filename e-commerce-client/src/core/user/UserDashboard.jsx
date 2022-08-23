import React from "react";
import { Link } from "react-router-dom";
import Layout from "../Layout";
import { isAuthenticated } from "../../helperMethods/functions";

const UserDashboard = () => {
  const {
    user: { name, email, role, history },
  } = isAuthenticated();

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
            <div className="card mb-3">
              <h3 className="card-header">Purchase History</h3>
              <ul className="list-group">
                <li className="list-group-item">History: {history}</li>
              </ul>
            </div>
          </div>
          {userLinks()}
        </div>
      </Layout>
    </>
  );
};

export default UserDashboard;
