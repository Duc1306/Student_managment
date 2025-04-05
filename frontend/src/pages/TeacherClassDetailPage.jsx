// attendance-frontend/src/pages/TeacherClassDetailPage.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

function TeacherClassDetailPage() {
  const { id } = useParams(); // id của lớp
  const navigate = useNavigate();
  const [classDetail, setClassDetail] = useState(null);
  const [students, setStudents] = useState([]);
  const [date, setDate] = useState("");
  const [attendanceData, setAttendanceData] = useState({}); // object: studentId -> status

  useEffect(() => {
    api
      .get(`/classes/${id}/students`)
      .then((res) => {
        setClassDetail({
          classId: res.data.classId,
          className: res.data.className,
          subject: res.data.subject,
          teacher: res.data.teacher,
        });
        setStudents(res.data.students);
        // Khởi tạo trạng thái điểm danh mặc định cho mỗi học sinh (ví dụ: 'present')
        const initData = {};
        res.data.students.forEach((student) => {
          initData[student.id] = "present";
        });
        setAttendanceData(initData);
      })
      .catch((err) => {
        console.error(err);
        alert("Lỗi tải chi tiết lớp");
      });
  }, [id]);

  const handleStatusChange = (studentId, newStatus) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: newStatus,
    }));
  };

  const handleSaveAttendance = () => {
    if (!date) {
      alert("Vui lòng chọn ngày điểm danh");
      return;
    }
    const attendanceList = students.map((student) => ({
      studentId: student.id,
      status: attendanceData[student.id] || "present",
    }));
    api
      .post("/attendance", { classId: id, date, attendanceList })
      .then((res) => {
        alert("Điểm danh thành công!");
      })
      .catch((err) => {
        console.error(err);
        alert("Lỗi điểm danh");
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h2>Chi tiết lớp: {classDetail ? classDetail.className : ""}</h2>
        {/* <button onClick={handleLogout} className="btn btn-danger">
          Đăng xuất
        </button> */}
      </div>
      <p>Môn học: {classDetail ? classDetail.subject : ""}</p>
      <p>Giáo viên: {classDetail ? classDetail.teacher : ""}</p>

      <div className="mb-3">
        <label>Chọn ngày điểm danh:</label>
        <input
          type="date"
          className="form-control"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <h4>Danh sách học sinh và điểm danh</h4>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Họ tên</th>
            <th>Mã sinh viên</th>
            <th>Username</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td>{student.ho_ten}</td>
              <td>{student.ma_sinh_vien}</td>
              <td>{student.User ? student.User.username : ""}</td>
              <td>
                <select
                  className="form-select"
                  value={attendanceData[student.id] || "present"}
                  onChange={(e) =>
                    handleStatusChange(student.id, e.target.value)
                  }
                >
                  <option value="present">Có mặt</option>
                  <option value="absent">Vắng</option>
                  <option value="late">Muộn</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn btn-primary" onClick={handleSaveAttendance}>
        Lưu điểm danh
      </button>
    </div>
  );
}

export default TeacherClassDetailPage;
