import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

// 最終渲染頁面
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <div className="background1">
    <App />
  </div>
);

// reportWebVitals();