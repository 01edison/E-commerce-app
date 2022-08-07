import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../Layout";
import Card from "./Card";
import axios from "axios";

const Product = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:4000/product/${productId}`)
      .then((response) => {
        console.log(response.data);
        setProduct(response.data.product);
      })
      .catch((error) => console.log(error));
  }, [productId]);

  return (
    <>
      <Layout
        title={product.name}
        description={product.description}
        className="container-fluid"
      >
        <div className="row">
          <Card
            key={product._id}
            id={product._id}
            name={product.name}
            description={product.description}
            price={product.price}
          />
        </div>
      </Layout>
    </>
  );
};

export default Product;
