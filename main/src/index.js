import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.css";
import "assets/scss/paper-dashboard.scss?v=1.3.0";
import "assets/demo/demo.css";
import "perfect-scrollbar/css/perfect-scrollbar.css";

import AdminLayout from "layouts/Admin.js";
import Login from "views/Login.jsx";
import Signup from "views/Signup.jsx";
import CreateUser from "views/CreateUser";
import UpdateUser from "views/UpdateUser"; 
import UpdateStocks from "views/UpdateStocks"; 
import AddStocks from "views/AddStocks";


const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/admin/*" element={<AdminLayout />} />
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/create" element={<CreateUser />} />
      <Route path="/addstock" element={<AddStocks />} />
      <Route path="/updatestock/:id/" element={<UpdateStocks />} />
      <Route path='/edit/:id' element={<UpdateUser/>}></Route>
    </Routes>
  </BrowserRouter>
);
