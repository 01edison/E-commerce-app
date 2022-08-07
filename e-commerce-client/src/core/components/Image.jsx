import React from "react";

const Image = ({ id }) => {
  return <>
    <div >
        <img src={`http://localhost:4000/product/photo/${id}`} alt="" className="product-img"/>
    </div>
  </>;
};

export default Image;
