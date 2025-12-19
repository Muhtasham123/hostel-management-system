import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import {ToastContainer} from "react-toastify"

import RtlLayout from "layouts/rtl";
import AdminLayout from "layouts/admin";
import AuthLayout from "layouts/auth";
const App = () => {
  return (
  <>
    <ToastContainer/>
    <Routes>
      <Route path="auth/*" element={<AuthLayout />} />
      <Route path="admin/*" element={<AdminLayout />}/>
      <Route path="rtl/*" element={<RtlLayout />} />
      <Route path="/" element={<Navigate to="/admin" replace />} />
    </Routes>
  </>
  );
};

export default App;
