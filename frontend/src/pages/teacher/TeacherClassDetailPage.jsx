import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HustHeader from "../../components/HustHeader";
import HustFooter from "../../components/HustFooter";
import api from "../../api";

function TeacherClassDetailPage() {
  const { id } = useParams(); // id của lớp
  const navigate = useNavigate();

  // Thông tin chi tiết lớp
  const [classDetail, setClassDetail] = useState(null);
  // Danh sách học sinh đã có trong lớp
  const [students, setStudents] = useState([]);
  // Danh sách tất cả học sinh từ DB
  const [allStudents, setAllStudents] = useState([]);
  // Giá trị học sinh được chọn để thêm vào lớp (studentId)
  const [selectedStudentId, setSelectedStudentId] = useState("");

  // Ngày điểm danh
  const [date, setDate] = useState("");

  // studentId -> status
  const [attendanceData, setAttendanceData] = useState({});

  // Lấy thông tin lớp và danh sách học sinh của lớp
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
        // Khởi tạo trạng thái điểm danh mặc định = 'present'
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

  // Lấy danh sách tất cả học sinh từ database
  const fetchAllStudents = () => {
    api
      .get("/students")
      .then((res) => {
        setAllStudents(res.data);
      })
      .catch((err) => {
        console.error(err);
        alert("Lỗi tải danh sách học sinh");
      });
  };

  useEffect(() => {
    fetchClassData();
    fetchAllStudents();
  }, [id]);

  // Xử lý đổi trạng thái điểm danh trong select
  const handleStatusChange = (studentId, newStatus) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: newStatus,
    }));
  };

  // Lưu điểm danh
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

  // Xoá học sinh khỏi lớp
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

  // Thêm học sinh từ danh sách có sẵn
  const handleAddStudent = () => {
    if (!selectedStudentId) {
      alert("Vui lòng chọn học sinh để thêm");
      return;
    }
    api
      .post(`/classes/${id}/students`, { studentId: selectedStudentId })
      .then((res) => {
        alert("Học sinh đã được thêm");
        setSelectedStudentId(""); // Reset chọn lựa
        fetchClassData();
      })
      .catch((err) => {
        console.error(err);
        alert(err.response?.data?.error || "Lỗi thêm học sinh");
      });
  };

  // Lọc ra danh sách học sinh chưa có trong lớp
  const availableStudents = allStudents.filter(
    (student) => !students.some((s) => s.id === student.id)
  );

  // Đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="container mt-4">
      <HustHeader
        title={`Chi tiết lớp: ${classDetail ? classDetail.className : ""}`}
        subtitle={`Môn: ${classDetail ? classDetail.subject : ""} | GV: ${
          classDetail ? classDetail.teacher : ""
        }`}
        icon="clipboard-check"
      />

      <div className="card mb-4">
        <div className="card-body">
          <h5>
            <i className="bi bi-calendar-check me-1"></i>Điểm danh
          </h5>
          <div className="row mb-3">
            <div className="col-md-4">
              <label className="form-label">Chọn ngày điểm danh</label>
              <input
                type="date"
                className="form-control"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bảng danh sách học sinh của lớp */}
      <div className="card mb-4">
        <div className="card-body">
          <h5>
            <i className="bi bi-people me-1"></i>Danh sách học sinh
          </h5>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Họ tên</th>
                <th>Mã SV</th>
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
                      className="btn btn-sm btn-danger"
                      onClick={() => handleRemoveStudent(student.id)}
                    >
                      <i className="bi bi-person-dash"></i> Xoá
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            className="btn btn-primary mt-3 me-2"
            onClick={handleSaveAttendance}
          >
            <i className="bi bi-check-circle me-1"></i>Lưu điểm danh
          </button>
          <button
            className="btn btn-outline-primary mt-3"
            onClick={() => navigate(`/teacher/report/${id}`)}
          >
            <i className="bi bi-bar-chart me-1"></i>Xem báo cáo
          </button>
        </div>
      </div>

      {/* Phần thêm học sinh bằng cách chọn từ danh sách */}
      <div className="card mb-4">
        <div className="card-body">
          <h5>
            <i className="bi bi-person-plus me-1"></i>Thêm học sinh vào lớp
          </h5>
          <p className="text-muted mb-2">
            Chọn học sinh từ danh sách sau để thêm vào lớp.
          </p>

          <div className="mb-3">
            <label className="form-label">Chọn học sinh</label>
            <select
              className="form-select"
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
            >
              <option value="">--Chọn học sinh để thêm--</option>
              {availableStudents.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.ho_ten} - {student.ma_sinh_vien}
                </option>
              ))}
            </select>
          </div>

          <button className="btn btn-success" onClick={handleAddStudent}>
            <i className="bi bi-person-plus-fill me-1"></i>Thêm học sinh
          </button>
        </div>
      </div>

      <hr />
      <HustFooter />
    </div>
  );
}

export default TeacherClassDetailPage;
