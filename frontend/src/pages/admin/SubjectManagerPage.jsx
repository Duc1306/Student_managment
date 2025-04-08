import React, { useState, useEffect } from "react";
import api from "../../api";
import HustFooter from "../../components/HustFooter";
import HustHeader from "../../components/HustHeader";

function SubjectManagerPage() {
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState({ ten_mon: "", ma_mon: "" });

  const fetchSubjects = async () => {
    try {
      const res = await api.get("/subjects");
      setSubjects(res.data);
    } catch (err) {
      console.error(err);
      alert("Lỗi tải môn học");
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleCreate = async () => {
    try {
      await api.post("/subjects", form);
      alert("Tạo môn thành công!");
      setForm({ ten_mon: "", ma_mon: "" });
      fetchSubjects();
    } catch (err) {
      console.error(err);
      alert("Lỗi tạo môn");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xoá môn này?")) return;
    try {
      await api.delete(`/subjects/${id}`);
      fetchSubjects();
    } catch (err) {
      console.error(err);
      alert("Xoá thất bại");
    }
  };

  return (
    <div className="container my-4">
      <HustHeader
        title="Quản lý Môn học"
        subtitle="Thêm, chỉnh sửa hoặc xoá môn học"
        icon="journal-bookmark-fill"
      />

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5>
            <i className="bi bi-plus-lg me-1"></i>Tạo Môn
          </h5>
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Tên môn</label>
              <input
                className="form-control"
                value={form.ten_mon}
                onChange={(e) => setForm({ ...form, ten_mon: e.target.value })}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Mã môn</label>
              <input
                className="form-control"
                value={form.ma_mon}
                onChange={(e) => setForm({ ...form, ma_mon: e.target.value })}
              />
            </div>
          </div>
          <button className="btn btn-hust" onClick={handleCreate}>
            <i className="bi bi-plus-circle me-1"></i>Thêm
          </button>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <h5>
            <i className="bi bi-table me-1"></i>Danh sách Môn học
          </h5>
          <table className="table table-bordered table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên môn</th>
                <th>Mã môn</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((s) => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.ten_mon}</td>
                  <td>{s.ma_mon}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(s.id)}
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

      <HustFooter />
    </div>
  );
}

export default SubjectManagerPage;
