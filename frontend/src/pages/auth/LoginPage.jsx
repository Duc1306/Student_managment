
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Gọi API /auth/login, trả về { token, role }
      const res = await api.post("/auth/login", { username, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      alert("Đăng nhập thành công!");
      if (res.data.role === "admin") navigate("/admin");
      else if (res.data.role === "teacher") navigate("/teacher");
      else if (res.data.role === "student") navigate("/student");
    } catch (err) {
      alert(err.response?.data?.error || "Login thất bại");
    }
  };

  return (
    <div className="container my-5" style={{ maxWidth: "400px" }}>
      <div className="card p-4 shadow-sm">
        <h3 className="mb-3 text-center">Đăng nhập HUST</h3>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="btn btn-hust w-100">
            <i className="bi bi-box-arrow-in-left me-1"></i>Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
