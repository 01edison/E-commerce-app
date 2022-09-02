import axios from "axios";
import { Url } from "../config.js";

export const isAuthenticated = () => {
  if (typeof window == "undefined") {
    return false;
  }
  if (localStorage.getItem("jwt")) {
    return JSON.parse(localStorage.getItem("jwt"));
  } else {
    return false;
  }
};

export const authenticate = (data) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("jwt", JSON.stringify(data)); //store the user and token in the local storage
  }
};

export const setCartInLocalStorage = (cart) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("cart", cart);
  }
};

export const showStock = (quantity) => {
  return quantity > 0 ? (
    <span className="badge badge-primary badge-pill mb-2">In Stock</span>
  ) : (
    <span className="badge badge-danger badge-pill mb-2">Out of Stock</span>
  );
};

export const addToCart = async (id) => {
  if (isAuthenticated() != false) {
    const { token } = isAuthenticated();
    const productId = id;
    try {
      const res = await axios.post(`${Url}/user/cart/${productId}`, undefined, {
        headers: {
          Authorization: token,
        },
      });
      alert(res.data.message || res.data.error);
    } catch (error) {
      console.log(error);
    }
  }
};

export const deleteFromCart = async (id) => {
  if (isAuthenticated() != false) {
    const { token } = isAuthenticated();
    const productId = id;

    try {
      const res = await axios({
        url: `${Url}/user/cart/${productId}`,
        method: "DELETE",
        headers: {
          Authorization: token,
        },
      });

      alert(res.data.message || res.data.error);
    } catch (error) {
      console.log(error);
    }
  }
};