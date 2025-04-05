
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

function TeacherClassDetailPage() {
  const { id } = useParams(); // id của lớp
  const navigate = useNavigate();
  const [classDetail, setClassDetail] = useState(null);
  const [students, setStudents] = useState([]);
  const [date, setDate] = useState("");
  const [attendanceData, setAttendanceData] = useState({}); // studentId -> status
  // Dữ liệu cho việc thêm học sinh mới
  const [newStudentData, setNewStudentData] = useState({
    studentId: "", // Nếu có ID, có thể nhập vào; nếu để trống thì tạo mới
    ma_sinh_vien: "",
    ho_ten: "",
    ngay_sinh: "",
    dia_chi: "",
    password: "", // Trường mật khẩu cho học sinh
  });

  const fetchClassData = () => {
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
  };

  useEffect(() => {
    fetchClassData();
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

  const handleRemoveStudent = (studentId) => {
    if (!window.confirm("Bạn có chắc muốn xoá học sinh này khỏi lớp?")) return;
    api
      .delete(`/classes/${id}/students/${studentId}`)
      .then((res) => {
        alert("Học sinh đã được xoá");
        fetchClassData();
      })
      .catch((err) => {
        console.error(err);
        alert(err.response?.data?.error || "Lỗi xoá học sinh");
      });
  };

  const handleAddStudent = () => {
    // Gửi toàn bộ dữ liệu từ newStudentData, bao gồm mật khẩu
    api
      .post(`/classes/${id}/students`, newStudentData)
      .then((res) => {
        alert("Học sinh đã được thêm");
        setNewStudentData({
          studentId: "",
          ma_sinh_vien: "",
          ho_ten: "",
          ngay_sinh: "",
          dia_chi: "",
          password: "", // Reset mật khẩu
        });
        fetchClassData();
      })
      .catch((err) => {
        console.error(err);
        alert(err.response?.data?.error || "Lỗi thêm học sinh");
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
            <th>Hành động</th>
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
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleRemoveStudent(student.id)}
                >
                  Xoá
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn btn-primary me-2" onClick={handleSaveAttendance}>
        Lưu điểm danh
      </button>

      <hr />
      <h4>Thêm học sinh vào lớp</h4>
      <div className="mb-3">
        <label>Nếu đã có ID, nhập vào (hoặc bỏ trống để tạo mới):</label>
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Student ID (nếu có)"
          value={newStudentData.studentId}
          onChange={(e) =>
            setNewStudentData({ ...newStudentData, studentId: e.target.value })
          }
        />
        <label>Mã sinh viên:</label>
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Mã sinh viên"
          value={newStudentData.ma_sinh_vien}
          onChange={(e) =>
            setNewStudentData({
              ...newStudentData,
              ma_sinh_vien: e.target.value,
            })
          }
        />
        <label>Họ tên:</label>
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Họ tên"
          value={newStudentData.ho_ten}
          onChange={(e) =>
            setNewStudentData({ ...newStudentData, ho_ten: e.target.value })
          }
        />
        <label>Ngày sinh:</label>
        <input
          type="date"
          className="form-control mb-2"
          value={newStudentData.ngay_sinh}
          onChange={(e) =>
            setNewStudentData({ ...newStudentData, ngay_sinh: e.target.value })
          }
        />
        <label>Địa chỉ:</label>
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Địa chỉ"
          value={newStudentData.dia_chi}
          onChange={(e) =>
            setNewStudentData({ ...newStudentData, dia_chi: e.target.value })
          }
        />
        <label>Mật khẩu:</label>
        <input
          type="password"
          className="form-control mb-2"
          placeholder="Mật khẩu"
          value={newStudentData.password}
          onChange={(e) =>
            setNewStudentData({ ...newStudentData, password: e.target.value })
          }
        />
        <button className="btn btn-success" onClick={handleAddStudent}>
          Thêm học sinh
        </button>
      </div>
    </div>
  );
}

export default TeacherClassDetailPage;
