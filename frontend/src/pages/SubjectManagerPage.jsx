
import React, { useState, useEffect } from "react";
import api from "../api";

function SubjectManagerPage() {
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState({ ten_mon: "", ma_mon: "" });

  const fetchSubjects = async () => {
    try {
      const res = await api.get("/subjects");
      setSubjects(res.data);
    } catch (error) {
      alert("Lỗi tải subject");
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleCreateSubject = async () => {
    try {
      await api.post("/subjects", newSubject);
      alert("Tạo môn thành công");
      setNewSubject({ ten_mon: "", ma_mon: "" });
      fetchSubjects();
    } catch (error) {
      alert("Tạo môn thất bại");
    }
  };

  const handleDeleteSubject = async (id) => {
    if (!window.confirm("Xoá môn học?")) return;
    try {
      await api.delete(`/subjects/${id}`);
      fetchSubjects();
    } catch (error) {
      alert("Xoá thất bại");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Quản lý Môn học</h2>
      <div className="row">
        <div className="col-md-4">
          <h5>Tạo Môn mới</h5>
          <div className="mb-2">
            <label>Tên môn</label>
            <input
              className="form-control"
              value={newSubject.ten_mon}
              onChange={(e) =>
                setNewSubject({ ...newSubject, ten_mon: e.target.value })
              }
            />
          </div>
          <div className="mb-2">
            <label>Mã môn</label>
            <input
              className="form-control"
              value={newSubject.ma_mon}
              onChange={(e) =>
                setNewSubject({ ...newSubject, ma_mon: e.target.value })
              }
            />
          </div>
          <button className="btn btn-success" onClick={handleCreateSubject}>
            Tạo
          </button>
        </div>
        <div className="col-md-8">
          <h5>Danh sách Môn</h5>
          <table className="table">
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
                      onClick={() => handleDeleteSubject(s.id)}
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

export default SubjectManagerPage;
