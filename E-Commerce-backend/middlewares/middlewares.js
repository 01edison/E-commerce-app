const { User } = require("../models/models");
const { verify } = require("jsonwebtoken");
// to ensure use is logged in before accessing the route

// exports.userById = function (req, res, next) {
//   const userId = req.params.userId;
//   User.findById(userId).exec(function (err, foundUser) {
//     if (!foundUser) {
//       return res.json({ error: "User not found" });
//     }
//     req.profile = foundUser;
//     next();
//   });
// };
exports.requireSignIn = (req, res, next) => {
  try {
    const authorization = req.headers.authorization; //check the headers for the authorization property

    if (!authorization) {
      return res.json({ error: "Not authenticated. Please log in." });
    }

    const token = authorization.split(" ")[1]; //strip the token from the authorization property

    const { id } = verify(token, process.env.JWT_SECRET);  //verify who the user is and get the id

    User.findById(id).exec((err, foundUser) => {
      if (!err) {
        req.profile = foundUser;
        next();
      }
    });
  } catch (error) {
    return res.json({
      error: error.message + ". Please log in",
    });
  }
};

exports.isAuthenticatedUser = function (req, res, next) {
  let isUser = req.profile._id == req.params.userId;
  if (isUser) {
    next();
  } else {
    return res.status(400).json({ error: "Access denied. Not your profile" });
  }
};

exports.isAdmin = function (req, res, next) {
  let isAdmin = req.profile.role === 1;
  if (isAdmin) {
    next();
  } else {
    return res.status(400).json({ error: "Access denied. Admin resource" });
  }
};
