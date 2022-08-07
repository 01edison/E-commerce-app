import React from "react";
import { Link } from "react-router-dom";
import Image from "./Image";
const Card = ({ id, name, description, price }) => {
  return (
    <>
      <div className="card product-card mb-3 mx-3">
        <div className="card-header">{name}</div>
        <div className="card-body">
          <Image id={id} />
          <p>{description}</p>
          <p>${price}</p>
          <Link to={`/product/${id}`} className="btn btn-outline-primary mr-2">
            View Product
          </Link>
          <Link to="/" className="btn btn-outline-success">
            Add to Cart
          </Link>
        </div>
      </div>
    </>
  );
};

export default Card;
