
import React, { useState, useEffect } from "react";
import api from "../../api";
import HustFooter from "../../components/HustFooter";
import HustHeader from "../../components/HustHeader";
import Pagination from "../../components/Pagination";

function SubjectManagerPage() {
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState({ ten_mon: "", ma_mon: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");

  // State cho modal chỉnh sửa môn học
  const [showEditModal, setShowEditModal] = useState(false);
  const [subjectToEdit, setSubjectToEdit] = useState(null);
  const [editSubjectData, setEditSubjectData] = useState({
    ten_mon: "",
    ma_mon: "",
  });

  const fetchSubjects = async () => {
    try {
      const res = await api.get("/subjects", {
        params: { page: currentPage, limit: 6, keyword: searchKeyword },
      });
      setSubjects(res.data.data);
      setTotalPages(res.data.meta.totalPages);
    } catch (err) {
      console.error(err);
      alert("Lỗi tải môn học");
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, [currentPage, searchKeyword]);

  const handleCreate = async () => {
    try {
      await api.post("/subjects", form);
      alert("Tạo môn thành công!");
      setForm({ ten_mon: "", ma_mon: "" });
      setCurrentPage(1);
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

  // --- Phần chỉnh sửa môn học ---
  const handleEditClick = (subject) => {
    setSubjectToEdit(subject);
    setEditSubjectData({
      ten_mon: subject.ten_mon,
      ma_mon: subject.ma_mon,
    });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    setEditSubjectData({ ...editSubjectData, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = async () => {
    try {
      await api.put(`/subjects/${subjectToEdit.id}`, editSubjectData);
      alert("Cập nhật môn học thành công!");
      setShowEditModal(false);
      fetchSubjects();
    } catch (error) {
      console.error(error);
      alert("Lỗi cập nhật môn học");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchSubjects();
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
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

      <form onSubmit={handleSearch} className="mb-3">
        <div className="row">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Tìm kiếm theo tên môn..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-hust">
              Tìm kiếm
            </button>
          </div>
        </div>
      </form>

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
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => handleEditClick(s)}
                    >
                      <i className="bi bi-pencil-square"></i> Sửa
                    </button>
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
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {/* Modal chỉnh sửa môn học */}
      {showEditModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Chỉnh sửa Môn học</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Tên môn</label>
                  <input
                    type="text"
                    className="form-control"
                    name="ten_mon"
                    value={editSubjectData.ten_mon}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Mã môn</label>
                  <input
                    type="text"
                    className="form-control"
                    name="ma_mon"
                    value={editSubjectData.ma_mon}
                    onChange={handleEditChange}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveEdit}
                >
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <HustFooter />
    </div>
  );
}

export default SubjectManagerPage;
