// attendance-frontend/src/App.js
import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import UserManagerPage from "./pages/UserManagerPage";
import SubjectManagerPage from "./pages/SubjectManagerPage";
import ClassManagerPage from "./pages/ClassManagerPage";
import TeacherDashboardPage from "./pages/TeacherDashboardPage";
import TeacherClassDetailPage from "./pages/TeacherClassDetailPage";
import StudentDashboardPage from "./pages/StudentDashboardPage";
import AttendancePage from "./pages/AttendancePage";
import ReportPage from "./pages/ReportPage";

function App() {
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  return (
    <BrowserRouter>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand">
            BK Attendance
          </Link>
          <div className="collapse navbar-collapse d-flex justify-content-end">
            <ul className="navbar-nav">
              {role ? (
                <>
                  {/* Hiển thị theo role nếu cần các liên kết khác */}
                  {role === "admin" && (
                    <li className="nav-item">
                      <Link to="/admin" className="nav-link">
                        Dashboard Admin
                      </Link>
                    </li>
                  )}
                  {role === "teacher" && (
                    <>
                      <li className="nav-item">
                        <Link to="/teacher" className="nav-link">
                          Dashboard Giáo viên
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/attendance" className="nav-link">
                          Điểm danh
                        </Link>
                      </li>
                    </>
                  )}
                  {role === "student" && (
                    <>
                      <li className="nav-item">
                        <Link to="/student" className="nav-link">
                          Dashboard Sinh viên
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/report" className="nav-link">
                          Báo cáo
                        </Link>
                      </li>
                    </>
                  )}
                  <li className="nav-item">
                    <button
                      onClick={handleLogout}
                      className="btn btn-link nav-link"
                    >
                      Đăng xuất
                    </button>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  <Link to="/login" className="nav-link">
                    <button onClick={handleLogout} className="btn btn-danger">
                      Đăng xuất
                    </button>
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <div className="container">
              <h1>Trang chủ</h1>
            </div>
          }
        />
        <Route path="/login" element={<LoginPage />} />

        {/* Dashboard dành cho Admin */}
        <Route path="/admin" element={<AdminDashboardPage />}>
          <Route path="users" element={<UserManagerPage />} />
          <Route path="subjects" element={<SubjectManagerPage />} />
          <Route path="classes" element={<ClassManagerPage />} />
        </Route>

        {/* Dashboard dành cho Giáo viên */}
        <Route path="/teacher" element={<TeacherDashboardPage />} />
        <Route path="/teacher/class/:id" element={<TeacherClassDetailPage />} />

        {/* Dashboard dành cho Sinh viên */}
        <Route path="/student" element={<StudentDashboardPage />} />
        <Route path="/report" element={<ReportPage />} />

        <Route path="/attendance" element={<AttendancePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
