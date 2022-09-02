import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import Card from "./components/Card";
import { Url } from "../config";
import axios from "axios";
function Home() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    axios
      .get(`${Url}/products`, {
        params: {
          arrival: "desc",
          limit: 5,
        },
      })
      .then((response) => {
        if (!response.data.error) {
          setProducts(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <>
      <Layout
        title="Home Page"
        description="Node React E-commerce App"
        className="container-fluid"
      >
        <h1>Newest arrivals!</h1>
        <div className="d-flex flex-wrap">
          {products.map((product, i) => {
            return (
              <Card
                key={i}
                id={product._id}
                name={product.name}
                description={product.description}
                category={product.category?.name}
                createdAt={product.createdAt}
                quantity={product.quantity}
                price={product.price}
                showDeleteFromCartButton={false}
              />
            );
          })}
        </div>
      </Layout>
    </>
  );
}

export default Home;
