// attendance-frontend/src/pages/StudentDashboardPage.js
import React, { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

function StudentDashboardPage() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [attendance, setAttendance] = useState([]);

  const fetchClasses = async () => {
    try {
      // API GET /classes khi role là student sẽ trả về các lớp sinh viên tham gia
      const res = await api.get("/classes");
      setClasses(res.data);
    } catch (error) {
      alert("Lỗi tải danh sách lớp");
    }
  };

  const fetchAttendance = async () => {
    try {
      // API GET /attendance trong controller sẽ lọc theo student_id dựa vào JWT
      const res = await api.get("/attendance");
      setAttendance(res.data);
    } catch (error) {
      alert("Lỗi tải thông tin điểm danh");
    }
  };

  useEffect(() => {
    fetchClasses();
    fetchAttendance();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h2>Dashboard Sinh viên</h2>
        {/* <button onClick={handleLogout} className="btn btn-danger">
          Đăng xuất
        </button> */}
      </div>
      <h4>Lớp bạn đang theo học</h4>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên lớp</th>
            <th>Môn học</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((cls) => (
            <tr key={cls.id}>
              <td>{cls.id}</td>
              <td>{cls.ten_lop}</td>
              <td>{cls.Subject ? cls.Subject.ten_mon : ""}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4>Thông báo điểm danh của bạn</h4>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Ngày</th>
            <th>Trạng thái</th>
            <th>Lớp</th>
          </tr>
        </thead>
        <tbody>
          {attendance.map((a, idx) => (
            <tr key={idx}>
              <td>{a.date}</td>
              <td>{a.status}</td>
              <td>{a.Class ? a.Class.ten_lop : "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentDashboardPage;
