
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function TeacherDashboardPage() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    // API GET /classes của teacher đã được backend trả về các lớp thuộc teacher
    api
      .get("/classes")
      .then((res) => setClasses(res.data))
      .catch((err) => {
        console.error(err);
        alert("Lỗi tải danh sách lớp.");
      });
  }, []);

  const handleViewClass = (classId) => {
    navigate(`/teacher/class/${classId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h2>Dashboard Giáo viên</h2>
      </div>
      <h4>Danh sách lớp dạy</h4>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên lớp</th>
            <th>Môn học</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((cls) => (
            <tr key={cls.id}>
              <td>{cls.id}</td>
              <td>{cls.ten_lop}</td>
              <td>{cls.Subject ? cls.Subject.ten_mon : ""}</td>
              <td>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleViewClass(cls.id)}
                >
                  Xem &amp; Điểm danh
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TeacherDashboardPage;
