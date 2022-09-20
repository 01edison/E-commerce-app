import moment from "moment";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Image from "./Image";
import { useCart } from "react-use-cart";
import {
  isAuthenticated,
  showStock,
  addToCartInDB,
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
  setQuantityAlert,
}) => {
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
  const { updateItemQuantity, addItem, items, removeItem } = useCart();
  const handleChange = (e) => {
    setQuantityAlert(false);
    setError(false);

    if (isAuthenticated() != false) {
      console.log(e.target.value);
      updateItemQuantity(id, e.target.value);
      console.log(items)
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
                className="btn btn-outline-primary mr-2 mb-2"
              >
                View Product
              </Link>
            )}
            {showAddToCartButton && quantity > 0 && (
              <button
                onClick={() => {
                  addToCartInDB(id);
                  addItem(product);
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
                  removeItem(id);
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
