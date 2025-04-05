
import React, { useState, useEffect } from "react";
import api from "../api";

function AttendancePage() {
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState("");
  const [date, setDate] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);

  // Tải danh sách lớp (teacher). Nếu system phân quyền chặt, ta filter teacherId
  const fetchClasses = async () => {
    try {
      const res = await api.get("/classes");
      setClasses(res.data);
    } catch (error) {
      alert("Lỗi tải lớp");
    }
  };


  const fetchStudentsOfClass = async (cId) => {
    // Ở đây ta tạm mock:
    try {
      // Gọi attendance? Hoặc gọi 1 route custom => Tuỳ
      // Giả sử 8 SV [1..8]
      const data = [
        { studentId: 1, hoTen: "Nguyễn Văn A", status: "present" },
        { studentId: 2, hoTen: "Trần Thị B", status: "absent" },
        { studentId: 3, hoTen: "Phạm Văn C", status: "present" },
        { studentId: 4, hoTen: "Đỗ Thị D", status: "late" },
      ];
      setStudents(data);
    } catch (error) {
      alert("Lỗi tải SV");
    }
  };

  useEffect(() => {
    api
      .get("/classes")
      .then((res) => setClasses(res.data))
      .catch((err) => alert("Lỗi tải lớp"));
  }, []);


  const handleSelectClass = async (classId) => {
    try {
      const res = await api.get(`/classes/${classId}/students`);
      setSelectedClass(res.data);
      // res.data.students = [ {id, ma_sinh_vien, ho_ten, ...} ]
      setStudents(res.data.students);
    } catch (error) {
      alert(error.response?.data?.error || "Lỗi load SV");
    }
  };
  const handleChangeStatus = (idx, newStatus) => {
    const newArr = [...students];
    newArr[idx].status = newStatus;
    setStudents(newArr);
  };

  const handleSaveAttendance = async () => {
    try {
      if (!classId || !date) {
        return alert("Chọn lớp và ngày");
      }
      const attendanceList = students.map((s) => ({
        studentId: s.studentId,
        status: s.status,
      }));
      await api.post("/attendance", { classId, date, attendanceList });
      alert("Điểm danh thành công");
    } catch (error) {
      alert("Lỗi điểm danh");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Điểm Danh</h2>
      <div className="mb-3">
        <label>Chọn Lớp</label>
        <select
          className="form-select"
          value={classId}
          onChange={(e) => handleSelectClass(e.target.value)}
        >
          <option value="">--Chọn lớp--</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.ten_lop}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label>Ngày</label>
        <input
          type="date"
          className="form-control"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Sinh viên</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {students.map((st, idx) => (
            <tr key={st.studentId}>
              <td>{st.hoTen}</td>
              <td>
                <select
                  className="form-select"
                  value={st.status}
                  onChange={(e) => handleChangeStatus(idx, e.target.value)}
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
        Lưu
      </button>
    </div>
  );
}

export default AttendancePage;
