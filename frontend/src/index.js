// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { ConfigProvider } from "antd";
import viVN from "antd/locale/vi_VN";

import "antd/dist/reset.css"; // Reset AntD
import "./theme.css"; // Theme overrides
import "./index.css"; // Tailwind

import App from "./App";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
     <ConfigProvider
      locale={viVN}
      theme={{
        token: { colorPrimary: "#AF1E2D" }, // màu HUST ‑ đồng bộ với Tailwind
      }}
    >
 
      <App />
    </ConfigProvider>
 
);

reportWebVitals();
