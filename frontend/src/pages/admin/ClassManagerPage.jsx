
import React, { useEffect, useState } from "react";
import HustHeader from "../../components/HustHeader";
import HustFooter from "../../components/HustFooter";
import Pagination from "../../components/Pagination";
import api from "../../api";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");

  // State cho modal chỉnh sửa
  const [showEditModal, setShowEditModal] = useState(false);
  const [classToEdit, setClassToEdit] = useState(null);
  const [editClassData, setEditClassData] = useState({
    ten_lop: "",
    ma_lop: "",
    subject_id: "",
    teacher_id: "",
  });

  // Load danh sách môn và giáo viên
  const fetchSubjectsAndTeachers = async () => {
    try {
      const [resSubject, resTeacher] = await Promise.all([
        api.get("/subjects"),
        api.get("/teachers"),
      ]);
      setSubjects(resSubject.data.data);
      setTeachers(resTeacher.data);
    } catch (error) {
      console.error(error);
      alert("Lỗi tải dữ liệu môn hoặc giáo viên");
    }
  };

  // Load danh sách lớp (với phân trang & tìm kiếm)
  const fetchClasses = async () => {
    try {
      const resClass = await api.get("/classes", {
        params: { page: currentPage, limit: 6, keyword: searchKeyword },
      });
      setClasses(resClass.data.data);
      setTotalPages(resClass.data.meta.totalPages);
    } catch (error) {
      console.error(error);
      alert("Lỗi tải dữ liệu lớp");
    }
  };

  const fetchData = async () => {
    await Promise.all([fetchClasses(), fetchSubjectsAndTeachers()]);
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, searchKeyword]);

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
      await api.post("/classes", newClass);
      alert("Tạo lớp thành công!");
      setNewClass({
        ten_lop: "",
        ma_lop: "",
        subject_id: "",
        teacher_id: "",
      });
      fetchClasses();
    } catch (error) {
      console.error(error);
      alert("Tạo lớp thất bại");
    }
  };

  const handleDeleteClass = async (classId) => {
    if (!window.confirm("Xoá lớp này?")) return;
    try {
      await api.delete(`/classes/${classId}`);
      fetchClasses();
    } catch (error) {
      console.error(error);
      alert("Xoá lớp thất bại");
    }
  };

  // --- Phần chỉnh sửa lớp ---
  const handleEditClick = (cls) => {
    setClassToEdit(cls);
    setEditClassData({
      ten_lop: cls.ten_lop,
      ma_lop: cls.ma_lop,
      subject_id: cls.subject_id,
      teacher_id: cls.teacher_id,
    });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    setEditClassData({ ...editClassData, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = async () => {
    try {
      await api.put(`/classes/${classToEdit.id}`, editClassData);
      alert("Cập nhật lớp thành công!");
      setShowEditModal(false);
      fetchClasses();
    } catch (error) {
      console.error(error);
      alert("Lỗi cập nhật lớp");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchClasses();
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="container my-4">
      <HustHeader
        title="Quản lý Lớp"
        subtitle="Tạo, chỉnh sửa, hoặc xoá lớp học"
        icon="diagram-3"
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

      {/* Tìm kiếm lớp */}
      <form onSubmit={handleSearch} className="mb-3">
        <div className="row">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Tìm kiếm lớp theo tên..."
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
              {classes.map((cls) => (
                <tr key={cls.id}>
                  <td>{cls.id}</td>
                  <td>{cls.ten_lop}</td>
                  <td>{cls.ma_lop}</td>
                  <td>{cls.subject_id}</td>
                  <td>{cls.teacher_id}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => handleEditClick(cls)}
                    >
                      <i className="bi bi-pencil-square"></i> Sửa
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteClass(cls.id)}
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

      {/* Modal chỉnh sửa Lớp */}
      {showEditModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Chỉnh sửa Lớp</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Tên lớp</label>
                  <input
                    type="text"
                    className="form-control"
                    name="ten_lop"
                    value={editClassData.ten_lop}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Mã lớp</label>
                  <input
                    type="text"
                    className="form-control"
                    name="ma_lop"
                    value={editClassData.ma_lop}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Môn học</label>
                  <select
                    className="form-select"
                    name="subject_id"
                    value={editClassData.subject_id}
                    onChange={handleEditChange}
                  >
                    <option value="">-- Chọn môn --</option>
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.ten_mon} ({s.ma_mon})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Giáo viên</label>
                  <select
                    className="form-select"
                    name="teacher_id"
                    value={editClassData.teacher_id}
                    onChange={handleEditChange}
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

export default ClassManagerPage;
