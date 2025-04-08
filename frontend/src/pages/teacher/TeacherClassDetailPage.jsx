
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

  // Danh sách học sinh
  const [students, setStudents] = useState([]);

  // Ngày điểm danh
  const [date, setDate] = useState("");

  // studentId -> status
  const [attendanceData, setAttendanceData] = useState({});

  // Dữ liệu thêm học sinh mới
  const [newStudentData, setNewStudentData] = useState({
    studentId: "", // Nếu nhập ID có sẵn, hoặc bỏ trống để tạo mới
    ma_sinh_vien: "",
    ho_ten: "",
    ngay_sinh: "",
    dia_chi: "",
    password: "", // mật khẩu học sinh
  });

  // Lấy thông tin lớp & học sinh
  const fetchClassData = () => {
    api
      .get(`/classes/${id}/students`)
      .then((res) => {
        // Cập nhật thông tin lớp
        setClassDetail({
          classId: res.data.classId,
          className: res.data.className,
          subject: res.data.subject,
          teacher: res.data.teacher,
        });
        // Danh sách học sinh
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

  useEffect(() => {
    fetchClassData();
  }, [id]);

  // Xử lý đổi trạng thái attendance trong select
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

  // Thêm học sinh (có thể tạo mới hoặc nhập ID đã có)
  const handleAddStudent = () => {
    api
      .post(`/classes/${id}/students`, newStudentData)
      .then((res) => {
        alert("Học sinh đã được thêm");
        // Reset form
        setNewStudentData({
          studentId: "",
          ma_sinh_vien: "",
          ho_ten: "",
          ngay_sinh: "",
          dia_chi: "",
          password: "",
        });
        fetchClassData();
      })
      .catch((err) => {
        console.error(err);
        alert(err.response?.data?.error || "Lỗi thêm học sinh");
      });
  };

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
        icon="clipboard-check" // e.g. "bi bi-clipboard-check"
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
          <button className="btn btn-hust" onClick={handleSaveAttendance}>
            <i className="bi bi-check-circle me-1"></i>Lưu điểm danh
          </button>
        </div>
      </div>

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
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h5>
            <i className="bi bi-person-plus me-1"></i>Thêm học sinh vào lớp
          </h5>
          <p className="text-muted mb-2">
            Nếu học sinh chưa tồn tại, hãy để trống "Student ID" và nhập thông
            tin tạo mới.
          </p>

          <div className="mb-3">
            <label className="form-label">Student ID (nếu đã tồn tại)</label>
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Student ID"
              value={newStudentData.studentId}
              onChange={(e) =>
                setNewStudentData({
                  ...newStudentData,
                  studentId: e.target.value,
                })
              }
            />
          </div>

          <div className="mb-2">
            <label className="form-label">Mã sinh viên</label>
            <input
              type="text"
              className="form-control"
              placeholder="Mã sinh viên"
              value={newStudentData.ma_sinh_vien}
              onChange={(e) =>
                setNewStudentData({
                  ...newStudentData,
                  ma_sinh_vien: e.target.value,
                })
              }
            />
          </div>

          <div className="mb-2">
            <label className="form-label">Họ tên</label>
            <input
              type="text"
              className="form-control"
              placeholder="Họ tên"
              value={newStudentData.ho_ten}
              onChange={(e) =>
                setNewStudentData({ ...newStudentData, ho_ten: e.target.value })
              }
            />
          </div>

          <div className="mb-2">
            <label className="form-label">Ngày sinh</label>
            <input
              type="date"
              className="form-control"
              value={newStudentData.ngay_sinh}
              onChange={(e) =>
                setNewStudentData({
                  ...newStudentData,
                  ngay_sinh: e.target.value,
                })
              }
            />
          </div>

          <div className="mb-2">
            <label className="form-label">Địa chỉ</label>
            <input
              type="text"
              className="form-control"
              placeholder="Địa chỉ"
              value={newStudentData.dia_chi}
              onChange={(e) =>
                setNewStudentData({
                  ...newStudentData,
                  dia_chi: e.target.value,
                })
              }
            />
          </div>

          <div className="mb-2">
            <label className="form-label">Mật khẩu</label>
            <input
              type="text"
              className="form-control"
              placeholder="Mật khẩu"
              value={newStudentData.password}
              onChange={(e) =>
                setNewStudentData({
                  ...newStudentData,
                  password: e.target.value,
                })
              }
            />
          </div>

          <button className="btn btn-success" onClick={handleAddStudent}>
            <i className="bi bi-person-plus-fill me-1"></i>Thêm học sinh
          </button>
        </div>
      </div>

   
      <hr />
      <HustFooter/>
    </div>
  );
}

export default TeacherClassDetailPage;
