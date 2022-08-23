import React, { useEffect, useState } from "react";
import { isAuthenticated } from "../helperMethods/functions";
import axios from "axios";
import { Url } from "../config";
import Card from "./components/Card";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const {
    token,
    user: { _id, name },
  } = isAuthenticated();

  useEffect(() => {
    axios
      .get(`${Url}/user/${_id}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        console.log(response.data.profile.cart);
        setCart(response.data.profile.cart);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <>
      <div>{name}'s cart</div>
      {cart.map((item) => {
        return <p key={item._id}>{item.name}</p>;
      })}
    </>
  );
};

export default Cart;
