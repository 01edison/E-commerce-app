import React, { useEffect, useState } from "react";
import axios from "axios";
import { Url } from "../config";
import { isAuthenticated } from "../helperMethods/functions";
import { usePaystackPayment } from "react-paystack";

export default function Checkout({
  cart,
  checkOutTotal,
  quantityAlert,
  setQuantityAlert,
}) {
  const [success, setSuccess] = useState(false);

  const { user, token } = isAuthenticated();
  const config = {
    reference: new Date().getTime().toString(),
    email: user.email,
    amount: checkOutTotal * 100,
    publicKey: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
  };

  const onSuccess = (reference) => {
    setSuccess(true);
    // Implementation for whatever you want to do with reference and after success call.
    console.log(reference);
    localStorage.removeItem("cart");
    axios
      .get(`${Url}/user/clear-cart/${user._id}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // you can call this function anything
  const onClose = () => {
    // implementation for  whatever you want to do when the Paystack dialog closed.
    console.log("closed");
  };

  const initializePayment = usePaystackPayment(config);
  const showSuccess = () => {
    if (success) {
      return (
        <div
          className="alert alert-info"
          style={{ display: success ? "" : "none" }}
        >
          Hurray! Payment successful
        </div>
      );
    }
  };

  const showQuantityAlert = () => {
    if (quantityAlert && cart.length > 0) {
      return (
        <span className="badge badge-danger">
          Please adjust the quantity of products you want
        </span>
      );
    }
  };
  useEffect(() => {
    setQuantityAlert(true);
  }, []);
  return (
    <>
      {showSuccess()}
      <h2>
        Total: ₦{checkOutTotal} <sup>{showQuantityAlert()}</sup>
      </h2>

      <button
        className="btn btn-success btn-block"
        onClick={() => {
          initializePayment(onSuccess, onClose);
        }}
      >
        Checkout
      </button>
    </>
  );
}
