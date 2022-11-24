import moment from "moment";
import "./card.css";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/fontawesome-free";
import Image from "../Image";
import { useCart } from "react-use-cart";
import {
  isAuthenticated,
  showStock,
  addToCartInDB,
  deleteFromCart,
} from "../../../helperMethods/functions";
import { useEffect } from "react";

const Card = ({
  id,
  name,
  description,
  price,
  category,
  quantity,
  showAddToCartButton = true,
  createdAt,
}) => {
  const { user } = isAuthenticated();
  const [error, setError] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [cartUpdate, setCartUpdate] = useState(false);
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    id,
    name,
    description,
    price,
    category,
    quantity,
    createdAt,
  });
  const { updateItemQuantity, addItem, removeItem, inCart } = useCart();

  const handleChange = (e) => {
    setError(false);
    if (isAuthenticated() !== false) {
      if (e.target.value > 0) {
        updateItemQuantity(id, e.target.value);
        setCartUpdate(!cartUpdate); // just to cause a re-render ;)
      }
      if (e.target.value > quantity) {
        setError(true);
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated()) {
      if (inCart(id)) {
        setAddedToCart(true);
      }
    }
  }, []);
  const showErrorMsg = () => {
    if (error) {
      return (
        <>
          <span className="badge badge-danger">We don't have the many :(</span>
        </>
      );
    }
  };
  return (
    <>
      <div className="card-component">
        <span
          className="info-icon"
          data-toggle="tooltip"
          data-placement="top"
          title={`Details about ${name}`}
          onClick={() => {
            navigate(`/product/${id}`);
          }}
        >
          <i class="fa-solid fa-circle-info"></i>
        </span>
        <span className="stock-icon">{showStock(quantity)}</span>
        <div className="product-img-container">
          <Image id={id} className={"product-img"} />
        </div>

        <div className="product-info">
          <h3 className="product-name">{name}</h3>
          <p className="product-description">{description}</p>
          <p className="product-price">₦{price}</p>
          <p>Added {moment(createdAt).fromNow()}</p>
        </div>
        {showAddToCartButton ? (
          <div
            className="add-to-cart-btn"
            onClick={() => {
              if (isAuthenticated() !== false) {
                if (quantity > 0) {
                  setAddedToCart(true);
                  addToCartInDB(id);
                  addItem(product);
                }
              } else {
                navigate("/login");
              }
            }}
          >
            {addedToCart ? (
              <>
                <span>ADDED TO CART</span>
                <i class="fa-regular fa-circle-check"></i>
              </>
            ) : (
              "ADD TO CART"
            )}
          </div>
        ) : (
          <div className="update-cart">
            <button
              className="remove-from-cart-btn"
              onClick={() => {
                deleteFromCart(id);
                removeItem(id);
              }}
            >
              Remove from cart
            </button>
            <input
              onChange={handleChange}
              type="number"
              placeholder="Quantity"
              name={name}
              min="1"
              max={quantity}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Card;
