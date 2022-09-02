import { useEffect } from "react";

/**
 * This Hook is not in use yet!
 * The purpose of this hook is to update the user's cart in the database with the exact state of the cart in the local storage when the user leaves the cart page
 */
const useCartUpdate = () => {
  useEffect(() => {
    const cartInLocalStorage = JSON.parse(localStorage.getItem("cart"));

    const body = {
      newCartItem: cartInLocalStorage,
    };
    axios
      .post(`${Url}/user/cart/`, qs.stringify(body), {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
  }, []);
};
