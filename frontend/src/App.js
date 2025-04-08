
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HustNavbar from "./components/HustNavbar";

import "./App.css";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import UserManagerPage from "./pages/admin/UserManagerPage";
import SubjectManagerPage from "./pages/admin/SubjectManagerPage";
import ClassManagerPage from "./pages/admin/ClassManagerPage";
import TeacherDashboardPage from "./pages/teacher/TeacherDashboardPage";
import TeacherClassDetailPage from "./pages/teacher/TeacherClassDetailPage";
import StudentDashboardPage from "./pages/student/StudentDashboardPage";
import LoginPage from "./pages/auth/LoginPage";

function App() {
  // Dark Mode
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.className = darkMode ? "dark-mode" : "light-mode";
  }, [darkMode]);

  return (
    <BrowserRouter>
      <HustNavbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <Routes>
        <Route
          path="/"
          element={
            <div className="container my-4">
              <h1>Trang chủ</h1>
            </div>
          }
        />
        <Route path="/login" element={<LoginPage />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminDashboardPage />}>
          <Route path="users" element={<UserManagerPage />} />
          <Route path="subjects" element={<SubjectManagerPage />} />
          <Route path="classes" element={<ClassManagerPage />} />
        </Route>

        {/* Teacher */}
        <Route path="/teacher" element={<TeacherDashboardPage />} />
        <Route path="/teacher/class/:id" element={<TeacherClassDetailPage />} />

        {/* Student */}
        <Route path="/student" element={<StudentDashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
