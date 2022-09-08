import React, { useEffect, useState, useRef } from "react";

import {
  isAuthenticated,
  setCartInLocalStorage,
} from "../helperMethods/functions";
import axios from "axios";
import { Url } from "../config";
import { Link } from "react-router-dom";
import Card from "./components/Card";
import Checkout from "./Checkout";
import Layout from "./Layout";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [checkOutTotal, setCheckOutTotal] = useState(0);
  const [quantityAlert, setQuantityAlert] = useState(false);
  const cartArr = useRef();
  const { token, user = "" } = isAuthenticated(); //incase you're not logged in

  useEffect(() => {
    axios
      .get(`${Url}/user/${user._id ? user._id : ""}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        cartArr.current = response.data.profile.cart;
        setCart(response.data?.profile.cart);
        localStorage.setItem("cart", JSON.stringify(cartArr.current));
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const noItemsMessage = () => {
    return (
      <h2>
        No items in your cart. <Link to="/shop"> Continue shopping</Link>
      </h2>
    );
  };
  const showCartItems = () => {
    return (
      <>
        <h2>Your cart has {cart.length} items</h2>

        <div className="d-flex flex-wrap">
          {cart.map((product, i) => {
            return (
              <>
                <Card
                  key={i}
                  id={product._id}
                  name={product.name}
                  description={product.description}
                  price={product.price}
                  quantity={product.quantity}
                  createdAt={product.createdAt}
                  showAddToCartButton={false}
                  showDeleteFromCartButton={true}
                  showCheckoutButton={true}
                  cartUpdate={true}
                  setCheckOutTotal={setCheckOutTotal}
                  setQuantityAlert={setQuantityAlert}
                />
              </>
            );
          })}
        </div>
      </>
    );
  };
  return (
    <>
      <Layout
        title="Your cart"
        description="Checkout items added to cart!"
        className="container-fluid"
      >
        <div className="row">
          <div className="col-6">
            {cart.length > 0 ? showCartItems() : noItemsMessage()}
          </div>
          <div className="col-6">
            <h2>Your Cart summary</h2>

            <Checkout
              cart={cart}
              checkOutTotal={checkOutTotal}
              setQuantityAlert={setQuantityAlert}
              quantityAlert={quantityAlert}
            />
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Cart;
