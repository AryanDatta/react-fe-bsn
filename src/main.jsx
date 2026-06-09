import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import App from "./App.jsx";
import Dashboard from "./Dashboard.jsx";

const path = window.location.pathname.replace(/\/$/, "");
const isDashboard = path === "/dashboard" || path.endsWith("/dashboard");

createRoot(document.getElementById("root")).render(
  isDashboard ? <Dashboard /> : <App />
);
