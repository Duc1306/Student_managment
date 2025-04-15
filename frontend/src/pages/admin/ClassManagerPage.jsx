// src/pages/admin/ClassManagerPage.jsx
import React, { useEffect, useState } from "react";
import HustHeader from "../../components/HustHeader";
import HustFooter from "../../components/HustFooter";
import Pagination from "../../components/Pagination";
import api from "../../api";

function ClassManagerPage() {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  // Form tạo lớp
  const [newClass, setNewClass] = useState({
    ten_lop: "",
    ma_lop: "",
    subject_id: "",
    teacher_id: "",
  });

  // State phân trang và tìm kiếm cho lớp
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");

  // Hàm tải teachers và subjects (giả sử số lượng ở đây nhỏ)
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

  // Hàm tải lớp với phân trang và tìm kiếm
  const fetchClasses = async () => {
    try {
      const resClass = await api.get("/classes", {
        params: { page: currentPage, limit: 6, keyword: searchKeyword },
      });
      // Giả sử API trả về { data: { data: [...], meta: {...} } }
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
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      <HustFooter />
    </div>
  );
}

export default ClassManagerPage;
