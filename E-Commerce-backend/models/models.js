const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

mongoose.connect(
  "mongodb://localhost:27017/e-commerceDB",
  {
    useNewUrlParser: true,
  },
  () => console.log("DB Connection established")
);

const { ObjectId } = Schema;

const productSchema = Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
      maxlength: 32,
    },
    category: {
      type: ObjectId, // the id of that category
      ref: "Category", // refers to the Category collection in the database
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    sold: {
      type: Number,
      default: 0,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
    shipping: {
      required: false,
      type: Boolean,
    },
    cartCount: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  { timestamps: true }
);

productSchema.index({ "$**": "text" }); //set the index to text so you can make powerful queries

exports.Product = new model("Product", productSchema);

const userSchema = Schema(
  {
    name: String,
    email: String,
    password: String,
    history: {
      type: Array,
      default: [],
    },
    role: {
      type: Number,
      default: 0,
    },
    cart: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

exports.User = new model("User", userSchema);

const categorySchema = Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 32,
      unique: true,
    },
  },
  { timestamps: true }
);

exports.Category = new model("Category", categorySchema);

const orderSchema = Schema(
  {
    products: {
      type: Array,
    },
    reference: Object,
    amount: String,
    address: String,
    status: {
      type: String,
      default: "Not Processed",
      enum: [
        "Not Processed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],
    },
    user: {
      type: ObjectId,
      ref: "User",
    },
    email: String,
  },
  { timestamps: true }
);

exports.Order = new model("Order", orderSchema);
