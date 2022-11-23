import moment from "moment";
import "./card.css";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Image from "../Image";
import { useCart } from "react-use-cart";
import {
  isAuthenticated,
  showStock,
  addToCartInDB,
  deleteFromCart,
} from "../../../helperMethods/functions";

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
}) => {
  const { user } = isAuthenticated();
  const [error, setError] = useState(false);
  const [product, setProduct] = useState({
    id,
    name,
    description,
    price,
    category,
    quantity,
    createdAt,
  });
  const { updateItemQuantity, addItem, removeItem } = useCart();
  const handleChange = (e) => {
    setError(false);
    if (isAuthenticated() !== false) {
      if (e.target.value > 0) {
        updateItemQuantity(id, e.target.value);
      }
      if (e.target.value > quantity) {
        setError(true);
      }
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
      <div className="product-card mb-3 mx-3">
        <div className="card-header d-flex justify-content-between">
          {name}
          {showStock(quantity)}
          {showErrorMsg()}
        </div>
        <div className="card-body d-md-flex">
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
            <p className="lead ">{description}</p>
            <p className="black-9">₦{price}</p>
            <div className="d-none d-md-block">
              <p>{category ? `Category: ${category}` : ""}</p>
              <p>Added {moment(createdAt).fromNow()}</p>
            </div>

            <span className="">
              {showViewProductButton && (
                <Link
                  to={`/product/${id}`}
                  className="btn btn-outline-primary mr-2"
                >
                  View Product
                </Link>
              )}
              {showAddToCartButton && quantity > 0 && user?.role === 0 && (
                <button
                  onClick={() => {
                    addToCartInDB(id);
                    addItem(product);
                  }}
                  className="btn btn-outline-success mt-2 add-to-cart-btn"
                >
                  Add to Cart
                </button>
              )}
              {showDeleteFromCartButton && (
                <button
                style={{width: "8.5rem", marginRight:"1rem"}}
                  className="btn btn-danger mt-2"
                  onClick={() => {
                    deleteFromCart(id);
                    removeItem(id);
                  }}
                >
                  Remove Product
                </button>
              )}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;
