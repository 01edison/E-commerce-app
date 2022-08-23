import axios from "axios";
import moment from "moment";
import React from "react";
import { Link } from "react-router-dom";
import Image from "./Image";
import { Url } from "../../config";
import { isAuthenticated } from "../../helperMethods/functions";
// import { addCartItem } from "../../helperMethods/functions";

const Card = ({
  id,
  name,
  description,
  price,
  category,
  quantity,
  showViewProductButton = true,
  createdAt,
}) => {
  const showStock = (quantity) => {
    return quantity > 0 ? (
      <span className="badge badge-primary badge-pill mb-2">In Stock</span>
    ) : (
      <span className="badge badge-danger badge-pill mb-2">Out of Stock</span>
    );
  };

  const addToCart = async () => {
    if (isAuthenticated() != false) {
      const {
        user: { _id },
        token,
      } = isAuthenticated();
      const productId = id;
      try {
        const res = await axios.post(
          `${Url}/user/cart/${productId}`,
          undefined,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <div className="card product-card mb-3 mx-3">
        <div className="card-header">{name}</div>
        <div className="card-body">
          <Image id={id} />
          {showStock(quantity)}
          <p className="lead mt-2">{description}</p>
          <p className="black-9">${price}</p>
          <p>Category: {category}</p>
          <p>Added {moment(createdAt).fromNow()}</p>

          {showViewProductButton && (
            <Link
              to={`/product/${id}`}
              className="btn btn-outline-primary mr-2"
            >
              View Product
            </Link>
          )}
          <button onClick={addToCart} className="btn btn-outline-success">
            Add to Cart
          </button>
        </div>
      </div>
    </>
  );
};

export default Card;
