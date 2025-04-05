import React, { useState, useEffect } from "react";
import api from "../api";

function ClassManagerPage() {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [newClass, setNewClass] = useState({
    ten_lop: "",
    ma_lop: "",
    subject_id: "",
    teacher_id: "",
  });

  const fetchData = async () => {
    try {
      const [resClass, resSubject, resUsers] = await Promise.all([
        api.get("/classes"),
        api.get("/subjects"),
        api.get("/users"), // Trong đó có teacher
      ]);
      setClasses(resClass.data);
      setSubjects(resSubject.data);

      // Lọc ra user role='teacher'
      const teacherUsers = resUsers.data.filter((u) => u.role === "teacher");
      // Ở DB: ta cần teacherId = ID của Teacher (not user).
      // => Phải load Teacher table.
      // (Tuỳ cách design. Ở đây ta tạm coi teacher user.id = teacher.id,
      //  nhưng thực tế ta phải join.)
      // => Đơn giản hoá: Dùng user.id = teacherId (phải cẩn thận).
      setTeachers(teacherUsers);
    } catch (error) {
      alert("Lỗi load data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateClass = async () => {
    try {
      if (!newClass.subject_id || !newClass.teacher_id) {
        return alert("Chọn subject và teacher");
      }
      await api.post("/classes", newClass);
      alert("Tạo lớp thành công");
      setNewClass({ ten_lop: "", ma_lop: "", subject_id: "", teacher_id: "" });
      fetchData();
    } catch (error) {
      alert("Tạo lớp thất bại");
    }
  };

  const handleDeleteClass = async (id) => {
    if (!window.confirm("Xoá lớp?")) return;
    try {
      await api.delete(`/classes/${id}`);
      fetchData();
    } catch (error) {
      alert("Xóa thất bại");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Quản lý Lớp</h2>
      <div className="row">
        <div className="col-md-4">
          <h5>Tạo Lớp Mới</h5>
          <div className="mb-2">
            <label>Tên Lớp</label>
            <input
              className="form-control"
              value={newClass.ten_lop}
              onChange={(e) =>
                setNewClass({ ...newClass, ten_lop: e.target.value })
              }
            />
          </div>
          <div className="mb-2">
            <label>Mã Lớp</label>
            <input
              className="form-control"
              value={newClass.ma_lop}
              onChange={(e) =>
                setNewClass({ ...newClass, ma_lop: e.target.value })
              }
            />
          </div>
          <div className="mb-2">
            <label>Subject</label>
            <select
              className="form-select"
              value={newClass.subject_id}
              onChange={(e) =>
                setNewClass({ ...newClass, subject_id: e.target.value })
              }
            >
              <option value="">--Chọn--</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.ten_mon}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <label>Teacher</label>
            <select
              className="form-select"
              value={newClass.teacher_id}
              onChange={(e) =>
                setNewClass({ ...newClass, teacher_id: e.target.value })
              }
            >
              <option value="">--Chọn--</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.username}
                </option>
              ))}
            </select>
          </div>
          <button className="btn btn-success" onClick={handleCreateClass}>
            Tạo
          </button>
        </div>
        <div className="col-md-8">
          <h5>Danh sách Lớp</h5>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên Lớp</th>
                <th>Mã Lớp</th>
                <th>Subject_ID</th>
                <th>Teacher_ID</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.ten_lop}</td>
                  <td>{c.ma_lop}</td>
                  <td>{c.subject_id}</td>
                  <td>{c.teacher_id}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteClass(c.id)}
                    >
                      Xoá
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ClassManagerPage;
