import React, { useEffect, useState } from "react";
import axios from "axios";
import { Url } from "../config";
import {
  isAuthenticated,
  clearCartAfterPayment,
  createOrder,
} from "../helperMethods/functions";
import { usePaystackPayment } from "react-paystack";

export default function Checkout({
  cart,
  checkOutTotal,
  quantityAlert,
  setQuantityAlert,
}) {
  const [success, setSuccess] = useState(false);
  const [address, setAddress] = useState("");

  const { user, token } = isAuthenticated();
  const config = {
    reference: new Date().getTime().toString(),
    email: user.email,
    amount: checkOutTotal * 100,
    publicKey: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
  };

  const handleAddress = (e) => {
    setAddress(e.target.value);
  };

  const onSuccess = (reference) => {
    setSuccess(true);
    // Implementation for whatever you want to do with reference and after success call.
    console.log(reference);
    const cartAtPurchase = JSON.parse(localStorage.getItem("cart"));
    const body = {
      order: [],
      amount: `₦${checkOutTotal}`,
      address,
      reference,
    };
    cartAtPurchase.forEach((item) => {
      const orderedItem = {
        name: item.name,
        price: item.price,
        decription: item.description,
        category: item.category,
        quantity: item.cartCount,
      };
      body.order.push(orderedItem);
    });
    // console.log(body);
    localStorage.removeItem("cart");
    createOrder(user._id, token, body);
    clearCartAfterPayment(user._id, token);
    alert("Cart Cleared!");
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
          Payment successful. Your order is being processed!
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
      <textarea
        className="mb-3"
        cols={50}
        placeholder="Enter your address.."
        onChange={handleAddress}
      />
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
