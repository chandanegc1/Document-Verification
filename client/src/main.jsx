import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="991761897451-bdngni8ehv4ac928bblgn3mvj8o8nc4e.apps.googleusercontent.com">
      <App /> 
    </GoogleOAuthProvider>
    <ToastContainer position="top-center" />
  </React.StrictMode>
);
