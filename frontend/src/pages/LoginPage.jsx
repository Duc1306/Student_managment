// attendance-frontend/src/pages/LoginPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { username, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      alert("Đăng nhập thành công!");
      // Chuyển hướng theo role
      if (res.data.role === "admin") {
        navigate("/admin");
      } else if (res.data.role === "teacher") {
        navigate("/teacher");
      } else if (res.data.role === "student") {
        navigate("/student");
      }
    } catch (error) {
      alert(error.response?.data?.error || "Login thất bại");
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "400px" }}>
      <h2>Đăng nhập</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label>Username</label>
          <input
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            className="form-control"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="btn btn-primary">Đăng nhập</button>
      </form>
    </div>
  );
}

export default LoginPage;
