require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const { sign } = require("jsonwebtoken");
const { User, Category, Product } = require("./models/models");
const {
  requireSignIn,
  isAuthenticatedUser,
  isAdmin,
} = require("./middlewares/middlewares");
const { captureRejectionSymbol } = require("events");
const adminOnly = [requireSignIn, isAdmin];
const isUser = [requireSignIn, isAuthenticatedUser];
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(cors());

app.get("/", (req, res) => {
  res.send("Home Page");
});

app.get("/logout", (req, res) => {
  // log the user out easily

  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
});

app.get("/hello", requireSignIn, (req, res) => {
  console.log(req.auth);
});

app.get("/secret/:userId", adminOnly, (req, res) => {
  res.json({ profile: req.profile });
});

app.post(
  "/register",
  body("name").notEmpty().withMessage("Name is required"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Must be a valid email"),
  body("password")
    .notEmpty()
    .withMessage("Password must be provided")
    .isLength({ min: 6 })
    .withMessage("Password must contain 6 characters or more"),
  function (req, res) {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      try {
        const { name, email, password } = req.body;
        User.findOne({ email }, (err, foundUser) => {
          if (!foundUser) {
            if (email === "cmgbeokwere6@gmail.com") {
              const user = {
                name,
                email,
                role: 1,
                password: bcrypt.hashSync(password, 10),
              };
              User.create(user, (err, result) => {
                if (!err) {
                  return res.json({ messsage: "User created successfully!" });
                } else {
                  return res.json({ error: err });
                }
              });
            } else {
              const user = {
                name,
                email,
                password: bcrypt.hashSync(password, 10),
              };

              User.create(user, (err, result) => {
                if (!err) {
                  return res.json({ messsage: "User created successfully!" });
                } else {
                  return res.status(400).json({ error: err });
                }
              });
            }
          } else {
            return res.status(400).json({
              error: "User already exists",
            });
          }
        });
      } catch (error) {
        return res.status(400).json({ error: error });
      }
    } else {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
  }
);

app.post("/login", (req, res) => {
  // take in the user's details
  const { email, password } = req.body;

  User.findOne({ email }, (err, foundUser) => {
    if (!foundUser) {
      return res.status(400).json({ error: "User doesn't exist." });
    }
    //if user is found, make sure passwords match
    bcrypt.compare(password, foundUser.password, (err, match) => {
      if (match) {
        const token = sign({ id: foundUser._id }, process.env.JWT_SECRET);
        res.cookie("token", token, { expiresIn: "2h" });
        const { _id, name, email, history, role, cart } = foundUser;

        return res.json({
          token: "Bearer " + token,
          user: { _id, name, email, history, role, cart },
        });
      } else {
        return res.status(400).json({ error: "Password is incorrect" });
      }
    });
  });
});

// User Routes

app.get("/user/:userId", isUser, (req, res) => {
  //getting user profile
  return res.json({
    profile: req.profile,
  });
});

app.post("/user/cart/:productId", requireSignIn, (req, res) => {
  const userId = req.profile._id;
  const productId = req.params.productId;
  Product.findById(productId).exec((err, foundProduct) => {
    if (!err) {
      User.findById(userId).exec((err, foundUser) => {
        if (!err) {
          const alreadyInCart = foundUser.cart.some(
            (item) => item.name == foundProduct.name
          );
          if (!alreadyInCart) {
            foundUser.cart.push(foundProduct);
            foundUser.save();
            return res.json({
              message: `${foundProduct.name} added to ${foundUser.name}'s cart`,
            });
          } else {
            return res.json({ error: "Product already in cart!" });
          }
        } else {
          return res.json({ error: err });
        }
      });
    } else {
      return res.json({ error: err });
    }
  });
});

// not in use yet!
app.post("/user/cart/", requireSignIn, (req, res) => {
  console.log(req.body.newCartItem);
  const userId = req.profile._id;
  const newCartItems = req.body.newCartItem;
  User.findById(userId).exec((err, foundUser) => {
    if (!err) {
      foundUser.cart = newCartItems; // this is where we update the user's cart
      foundUser.save();
      return res.json({ message: `${foundUser.name}'s cart updated!` });
    } else {
      return res.json({ error: err });
    }
  });
});

app.delete("/user/cart/:productId", requireSignIn, (req, res) => {
  const userId = req.profile._id;
  const productId = req.params.productId;

  Product.findById(productId).exec((err, foundProduct) => {
    if (!err) {
      User.findById(userId).exec((err, foundUser) => {
        if (!err) {
          for (let i = 0; i < foundUser.cart.length; i++) {
            const cartItemName = foundUser.cart[i].name;
            if (foundProduct?.name == cartItemName) {
              const newCartItems = foundUser.cart.filter(
                (product) => product.name != foundProduct.name
              );
              foundUser.cart = newCartItems;
              foundUser.save();
              return res.status(200).json({
                message: `${foundProduct.name} removed successfully from ${foundUser.name}'s cart`,
              });
            }
          }
          return res.json({ error: "Product not in cart" });
        } else {
          return res.json({ error: err });
        }
      });
    } else {
      return res.json({ error: err });
    }
  });
});

app.put("/user/:userId", isUser, (req, res) => {
  //updating user profile

  const userId = req.params.userId;
  User.findById(userId).exec(function (err, foundUser) {
    if (err) {
      return res.json({ error: "Error updating user" });
    }

    const updatedUser = _.extend(foundUser, req.body); // extends the values of fields into the foundProduct object

    updatedUser.save(function (err) {
      if (err) {
        return res.json({ error: "Error updating user" + err });
      }
      return res.json({ user: updatedUser });
    });
  });
});

// Product route
app.get("/products", (req, res) => {
  let { limit, arrival } = req.query;

  // if they want to sort by sales (using the sold field)
  Product.find()
    .select("-photo")
    .populate("category") // populate (expand) the category field in the product schema
    .sort({
      createdAt: arrival,
    })
    .limit(limit ? limit : "")
    .then((products) => {
      return res.send(products);
    })
    .catch((err) => {
      return res
        .status(400)
        .json({ error: "Error getting products: " + err.message });
    });
});

app.get("/product/:productId", (req, res) => {
  let productId = req.params.productId;

  Product.findById(productId)
    .populate("category", "_id name")
    .exec(function (err, foundProduct) {
      if (err || !foundProduct) {
        return res.status(400).json({ error: "Product not found." });
      }
      foundProduct.photo = undefined;
      return res.json({ product: foundProduct });
    });
});

app.get("/products/related/:productId", (req, res) => {
  let limit = req.query.limit;
  const productId = req.params.productId;

  Product.findById(productId).exec((err, foundProduct) => {
    if (!err && foundProduct) {
      //find the product by its id in the database
      const category = foundProduct.category;
      Product.find({ category: category, name: { $ne: foundProduct.name } }) //find all products with the same category and exempt the found product with "$ne"
        .select("-photo")
        .populate("category", "_id name")
        .limit(limit ? limit : "")
        .exec((err, foundProducts) => {
          if (!err && foundProducts) {
            return res.json({ products: foundProducts });
          } else {
            return res
              .status(400)
              .json({ error: "No products in this category!" });
          }
        });
    } else {
      return res.status(400).json({ error: "No found Product" });
    }
  });
});

app.get("/products/categories", (req, res) => {
  Product.distinct("category").exec((err, categories) => {
    //get the distinct or unique categories present in the products collection
    if (!err && categories) {
      return res.json({ categories: categories });
    }
    res.status(400).json({ error: "No categories found!" });
  });
});

app.get("/product/photo/:productId", (req, res) => {
  //send the product image to client
  const productId = req.params.productId;

  Product.findById(productId).exec((err, foundProduct) => {
    if (!err && foundProduct) {
      if (foundProduct.photo.data) {
        res.set("Content-Type", foundProduct.photo.contentType);
        return res.send(foundProduct.photo.data);
      }
    } else {
      return res.status(400).json({ error: "Product not found!" });
    }
  });
});

app.post("/products/search", (req, res) => {
  //for when the client makes a random product search
  let { q, sales, limit, min, max } = req.query;

  Product.find({
    $text: { $search: q },
    price: { $gte: min ? min : 0, $lte: max ? max : 10000 },
  })
    .select("-photo")
    .sort({ sold: sales ? sales : "desc" })
    .populate("category", "_id name")
    .limit(limit ? limit : "")
    .exec((err, products) => {
      if (!err && products.length !== 0) {
        return res.json({
          size: products.length,
          products,
        });
      } else {
        return res.status(400).json({ error: "No products found" });
      }
    });
});

app.post("/product/create", adminOnly, (req, res) => {
  let form = new formidable.IncomingForm(); //use the IncomingForm() constructor
  form.keepExtensions = true;
  form.parse(req, function (err, fields, files) {
    // parse the incoming data
    if (err) {
      return res.status(400).json({ message: err });
    }

    const { name, price, category, shipping, quantity, description } = fields;

    if (
      !name ||
      !price ||
      !category ||
      !shipping ||
      !quantity ||
      !description
    ) {
      return res.json({
        error: "Missing fields. Please fill all required fields.",
      });
    }
    const product = new Product(fields); // create the product

    if (files.photo) {
      if (files.photo.size > 1000000) {
        return res
          .status(400)
          .json({ message: "Image should be less than 1mb in size." });
      } // check if a photo is being sent
      // console.log("the fields: ", fields); // fields like name, description, quantity
      // console.log("the files: ", files); // files like images. videos etc
      product.photo.data = fs.readFileSync(files.photo.filepath); // store the photo
      product.photo.contentType = files.photo.mimetype; //store the type of the photo
    }

    product.save((err) => {
      if (err) {
        return res.json({ error: "Error uploading image: " + err.message });
      }
      return res.json({ message: "Product uploaded successfully." });
    });
  });
});

app.patch("/product/:productId", adminOnly, (req, res) => {
  //updating a product

  let productId = req.params.productId;
  let form = new formidable.IncomingForm(); //use the IncomingForm() constructor
  form.keepExtensions = true;
  form.parse(req, function (err, fields, files) {
    // parse the incoming data
    if (err) {
      return res.status(400).json({ message: err });
    }

    const { name, price, category, shipping, quantity, description } = fields;

    if (
      !name ||
      !price ||
      !category ||
      !shipping ||
      !quantity ||
      !description
    ) {
      return res.json({
        error: "Missing fields. Please fill all required fields.",
      });
    }

    Product.findById(productId).exec(function (err, foundProduct) {
      if (err) {
        return res.json({ error: "Error updating product" });
      }

      const updatedProduct = _.extend(foundProduct, fields); // extends the values of fields into the foundProduct object

      if (files.photo) {
        if (files.photo.size > 1000000) {
          return res
            .status(400)
            .json({ message: "Image should be less than 1mb in size." });
        }
        updatedProduct.photo.data = fs.readFileSync(files.photo.filepath);
        updatedProduct.photo.contentType = files.photo.mimetype;
      }
      updatedProduct.save(function (err) {
        if (err) {
          return res.json({ error: "Error updating product" + err });
        }
        res.json({ message: "Updated product successfully." });
      });
    });
  });
});

app.delete("/product/:productId", adminOnly, (req, res) => {
  let productId = req.params.productId;
  Product.deleteOne({ _id: productId }, function (err, result) {
    if (err) {
      return res.json({ error: "Error deleting product." });
    }
    res.json(result);
  });
});

//Category routes
app.get("/categories", (req, res) => {
  // getting all categories
  Category.find().exec(function (err, foundCategories) {
    if (err || !foundCategories) {
      return res.status(400).json({ error: "No category found" });
    }

    return res.json({ categories: foundCategories });
  });
});
app.get("/category/:categoryId", (req, res) => {
  //getting a particular category
  const categoryId = req.params.categoryId;

  Category.findById(categoryId).exec(function (err, foundCategory) {
    if (err || !foundCategory) {
      return res.status(400).json({ error: "Category not found." });
    }

    res.json({ Category: foundCategory });
  });
});

app.post("/category/create", adminOnly, (req, res) => {
  // creating new categories
  const category = {
    name: req.body.category,
  };
  Category.create(category, (err, result) => {
    if (!err) {
      return res.json({ messsage: "Category created successfully!" });
    } else {
      return res.json({ error: err });
    }
  });
});

app.patch("/category/:categoryId", adminOnly, (req, res) => {
  //updating an existing category

  const categoryId = req.params.categoryId;

  Category.updateOne(
    { _id: categoryId },
    { name: req.body.name },
    function (err, result) {
      if (err) {
        return res.json({ error: "Error updating category." });
      }

      res.json({ message: "Successfully updated category." });
    }
  );
});

app.delete("/category/:categoryId", adminOnly, (req, res) => {
  // deleting a category

  const categoryId = req.params.categoryId;

  Category.deleteOne({ _id: categoryId }, function (err, result) {
    if (err) {
      return res.json({ error: "Error deleting category." });
    }

    res.json({ message: "Deleted category successfully." });
  });
});
////////////////////////////////////////////////////////////////
app.listen(4000, () => {
  console.log("listening on port 4000");
});
