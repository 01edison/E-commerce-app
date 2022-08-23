import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./core/Login";
import Register from "./core/Register";
import Home from "./core/Home";
import Shop from "./core/Shop";
import UserDashboard from "./core/user/UserDashboard";
import Cart from "./core/Cart";
import ProtectedUserRoute from "./core/user/ProtectedUserRoute";
import ProtectedAdminDashboard from "./core/admin/ProtectedAdminDashboard";
import ProtectedAdminRoute from "./core/admin/ProtectedAdminRoute";
import AddCategory from "./core/admin/AddCategory";
import AddProduct from "./core/admin/AddProduct";
import Product from "./core/components/Product";

function AppRoutes() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" exact>
            <Route index element={<Home />} />
            <Route path="login" exact element={<Login />} />
            <Route path="register" exact element={<Register />} />
            <Route path="shop" element={<Shop />} />
            <Route
              path="user/dashboard"
              exact
              element={
                <ProtectedUserRoute>
                  <UserDashboard />
                </ProtectedUserRoute>
              }
            />
            <Route
              path="admin/dashboard"
              exact
              element={<ProtectedAdminDashboard />}
            />
            <Route
              path="category/create"
              exact
              element={
                <ProtectedAdminRoute>
                  <AddCategory />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="product/create"
              exact
              element={
                <ProtectedAdminRoute>
                  <AddProduct />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="user/cart"
              element={
                <ProtectedUserRoute>
                  <Cart />
                </ProtectedUserRoute>
              }
            />
          </Route>
          <Route path="/product/:productId" element={<Product />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default AppRoutes;
