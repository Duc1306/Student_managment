// attendance-frontend/src/pages/admin/ClassManagerPage.js
import React, { useEffect, useState } from "react";
import HustHeader from "../../components/HustHeader";
import HustFooter from "../../components/HustFooter";
import api from "../../api";

function ClassManagerPage() {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);

  // Form để tạo lớp
  const [newClass, setNewClass] = useState({
    ten_lop: "",
    ma_lop: "",
    subject_id: "",
    teacher_id: "",
  });

  // Lấy danh sách lớp, môn, và giáo viên
  const fetchData = async () => {
    try {
      // Giả sử API:
      //  GET /classes => DS lớp
      //  GET /subjects => DS môn
      //  GET /teachers => DS giáo viên
      const [resClass, resSubject, resTeacher] = await Promise.all([
        api.get("/classes"),
        api.get("/subjects"),
        api.get("/teachers"),
      ]);
      setClasses(resClass.data);
      setSubjects(resSubject.data);
      setTeachers(resTeacher.data);
    } catch (error) {
      console.error(error);
      alert("Lỗi tải dữ liệu");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateClass = async () => {
    try {
      if (
        !newClass.ten_lop ||
        !newClass.ma_lop ||
        !newClass.subject_id ||
        !newClass.teacher_id
      ) {
        return alert("Hãy điền đủ thông tin lớp");
      }
      // POST /classes => chỉ admin mới gọi được (theo backend)
      await api.post("/classes", newClass);
      alert("Tạo lớp thành công!");
      setNewClass({
        ten_lop: "",
        ma_lop: "",
        subject_id: "",
        teacher_id: "",
      });
      fetchData();
    } catch (error) {
      console.error(error);
      alert("Tạo lớp thất bại");
    }
  };

  const handleDeleteClass = async (classId) => {
    if (!window.confirm("Xoá lớp này?")) return;
    try {
      // DELETE /classes/:id
      await api.delete(`/classes/${classId}`);
      fetchData();
    } catch (error) {
      console.error(error);
      alert("Xoá lớp thất bại");
    }
  };

  return (
    <div className="container my-4">
      {/* Header */}
      <HustHeader
        title="Quản lý Lớp"
        subtitle="Tạo, chỉnh sửa, hoặc xoá lớp học"
        icon="diagram-3" // 'bi bi-diagram-3'
      />

      <div className="card mb-4">
        <div className="card-body">
          <h5>
            <i className="bi bi-plus-lg me-1"></i>Tạo Lớp Mới
          </h5>
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Tên lớp</label>
              <input
                className="form-control"
                value={newClass.ten_lop}
                onChange={(e) =>
                  setNewClass({ ...newClass, ten_lop: e.target.value })
                }
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Mã lớp</label>
              <input
                className="form-control"
                value={newClass.ma_lop}
                onChange={(e) =>
                  setNewClass({ ...newClass, ma_lop: e.target.value })
                }
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Môn học</label>
              <select
                className="form-select"
                value={newClass.subject_id}
                onChange={(e) =>
                  setNewClass({ ...newClass, subject_id: e.target.value })
                }
              >
                <option value="">-- Chọn môn --</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.ten_mon} ({s.ma_mon})
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label">Giáo viên</label>
              <select
                className="form-select"
                value={newClass.teacher_id}
                onChange={(e) =>
                  setNewClass({ ...newClass, teacher_id: e.target.value })
                }
              >
                <option value="">-- Chọn giáo viên --</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.ho_ten} ({t.ma_giao_vien})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button className="btn btn-hust" onClick={handleCreateClass}>
            <i className="bi bi-plus-circle me-1"></i>Tạo lớp
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h5>
            <i className="bi bi-table me-1"></i>Danh sách Lớp
          </h5>
          <table className="table table-bordered table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên lớp</th>
                <th>Mã lớp</th>
                <th>Môn</th>
                <th>Giáo viên</th>
                <th>Hành động</th>
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
                      <i className="bi bi-trash"></i> Xoá
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <HustFooter />
    </div>
  );
}

export default ClassManagerPage;
