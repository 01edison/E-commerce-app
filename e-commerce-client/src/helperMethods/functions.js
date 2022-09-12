import axios from "axios";
import qs from "qs";
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
  if (isAuthenticated() !== false) {
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
  if (isAuthenticated() !== false) {
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

export const clearCartAfterPayment = async (id, token) => {
  try {
    const res = await axios.get(`${Url}/user/clear-cart/${id}`, {
      headers: {
        Authorization: token,
      },
    });
    console.log(res);
  } catch (e) {
    console.log(e);
  }
};

export const createOrder = async (id, token, data) => {
  try {
    const res = await axios.post(
      `${Url}/order/create/${id}`,
      qs.stringify(data),
      {
        headers: {
          Authorization: token,
        },
      }
    );
    console.log(res);
  } catch (e) {
    console.log(e);
  }
};
