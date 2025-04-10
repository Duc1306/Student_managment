
import React from "react";
import { Link, useNavigate } from "react-router-dom";

function HustNavbar({ darkMode, setDarkMode }) {
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-hust navbar-dark">
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center" to="/login">
          <img
            src="/hust.jpg"
            alt="HUST"
            height="40"
            className="me-2"
            style={{ objectFit: "contain" }}
          />
          <span>Đại học Bách Khoa Hà Nội</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarHust"
          aria-controls="navbarHust"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarHust">
          <ul className="navbar-nav ms-auto">
            {/* Nếu là admin */}
            {role === "admin" && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin">
                  <i className="bi bi-speedometer2 me-1"></i>Admin Dashboard
                </Link>
              </li>
            )}

            {/* Nếu là teacher */}
            {role === "teacher" && (
              <li className="nav-item">
                <Link className="nav-link" to="/teacher">
                  <i className="bi bi-person-workspace me-1"></i>Teacher
                  Dashboard
                </Link>
              </li>
            )}

            {/* Nếu là student */}
            {role === "student" && (
              <li className="nav-item">
                <Link className="nav-link" to="/student">
                  <i className="bi bi-mortarboard me-1"></i>Student Dashboard
                </Link>
              </li>
            )}

            {/* Nếu chưa đăng nhập */}
            {!role && (
              <li className="nav-item">
                <Link className="btn btn-danger" to="/login">
                  <i className="bi bi-box-arrow-in-left me-1"></i>Đăng nhập
                </Link>
              </li>
            )}

            {/* Nếu đã đăng nhập */}
            {role && (
              <li className="nav-item">
                <div className="mb-3 text-end">
                  <button onClick={handleLogout} className="btn btn-danger">
                    <i className="bi bi-box-arrow-right me-1"></i>Đăng xuất
                  </button>
                </div>
              </li>
            )}

            <li className="nav-item d-flex align-items-center ms-2">
              <div className="form-check form-switch text-light">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="darkModeSwitch"
                  checked={darkMode}
                  onChange={toggleDarkMode}
                />
                <label
                  className="form-check-label ms-1"
                  htmlFor="darkModeSwitch"
                >
                  {darkMode ? (
                    <>
                      <i className="bi bi-moon-stars me-1"></i>Dark
                    </>
                  ) : (
                    <>
                      <i className="bi bi-brightness-high me-1"></i>Light
                    </>
                  )}
                </label>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default HustNavbar;
