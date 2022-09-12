import moment from "moment";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Image from "./Image";
import {
  isAuthenticated,
  showStock,
  addToCart,
  deleteFromCart,
} from "../../helperMethods/functions";

const Card = ({
  id,
  name,
  description,
  price,
  category,
  quantity,
  showViewProductButton = true,
  showAddToCartButton = true,
  showDeleteFromCartButton = true,
  createdAt,
  cartUpdate = false,
  setCheckOutTotal,
  setQuantityAlert,
}) => {
  const [error, setError] = useState(false);
  const handleChange = (e) => {
    setQuantityAlert(false);
    setError(false);
    if (isAuthenticated != false) {
      const { name, value } = e.target;
      if (value > quantity) {
        return setError(true);
      }
      const cartInLocalStorage = JSON.parse(localStorage.getItem("cart")); // we get the cart from the localStorage
      const productInCart = cartInLocalStorage.find(
        (product) => product.name == name
      ); //find that particular product in the cart

      productInCart.cartCount =
        value === "" || value === "0" ? 1 : Number(value); //update its count

      localStorage.setItem("cart", JSON.stringify(cartInLocalStorage)); // then we resave the cart in the local storage so changes dont get cleared
      const updatedCart = JSON.parse(localStorage.getItem("cart"));

      const checkoutTotal = updatedCart.reduce((current, next) => {
        // this is where the checkout total is being computed
        return current + next.cartCount * Number(next.price);
      }, 0);
      localStorage.setItem("checkoutTotal", checkoutTotal); // create a new variable in the localstorage and store the checkout total there
      setCheckOutTotal(localStorage.getItem("checkoutTotal")); // set the state in the cart component to that checkout total in the local storage
    }
  };

  const showErrorMsg = () => {
    if (error) {
      return (
        <>
          <span className="badge badge-danger">
            Max limit exceeded. Adjust with arrows
          </span>
        </>
      );
    }
  };
  return (
    <>
      <div className="card product-card mb-3 mx-3">
        <div className="card-header">
          {name} {showErrorMsg()}
        </div>
        <div className="card-body d-flex">
          <div>
            <Image id={id} className={"product-image"} />
            {cartUpdate && (
              <div className="input-group mt-3">
                <div className="input-group-prepend">
                  <span className="input-group-text">Quantity</span>
                </div>
                <input
                  onChange={handleChange}
                  type="number"
                  className="form-control"
                  placeholder="Adjust Quantity"
                  name={name}
                  min="1"
                  max={quantity}
                />
              </div>
            )}
          </div>
          <div className="ml-2">
            {showStock(quantity)}
            <p className="lead mt-2">{description}</p>
            <p className="black-9">₦{price}</p>
            <p>{category ? `Category: ${category}` : ""}</p>
            <p>Added {moment(createdAt).fromNow()}</p>

            {showViewProductButton && (
              <Link
                to={`/product/${id}`}
                className="btn btn-outline-primary mr-2"
              >
                View Product
              </Link>
            )}
            {showAddToCartButton && quantity > 0 && (
              <button
                onClick={() => {
                  addToCart(id);
                }}
                className="btn btn-outline-success"
              >
                Add to Cart
              </button>
            )}
            {showDeleteFromCartButton && (
              <button
                className="btn btn-danger"
                onClick={() => {
                  deleteFromCart(id);
                }}
              >
                Remove Product
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;
