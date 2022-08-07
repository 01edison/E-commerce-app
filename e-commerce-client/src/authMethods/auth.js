import axios from "axios";
import qs from "qs";


exports.signup = () => {
  const { username, password } = user;
  const params = {
    username: username,
    password: password,
  };

  axios
    .post(`${Url}/register`, qs.stringify(params)) //the qs module allows for easy parsing of inputdata using axios
    .then((response) => {
      //if no error, send success message
      setSuccessMessage(response.data.message);
      setError("");
      setUser((prevItems) => {
        return { ...prevItems, username: "", password: "" };
      });
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    })
    .catch((error) => {
      //handle any errors
      setError(error.response.data.error);
    });
};
