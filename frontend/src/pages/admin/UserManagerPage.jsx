import React, { useState, useEffect } from "react";
import api from "../../api";
import HustHeader from "../../components/layout/HustHeader";
import HustFooter from "../../components/layout/HustFooter";

import Pagination from "../../components/pagination/Pagination";
import useFetchData from "../../hooks/useFetchData";

function UserManagerPage() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    role: "student",
  });
  const [keyword, setKeyword] = useState("");
  const {
    data: usersData,
    meta,
    loading,
    refetch,
  } = useFetchData("/users", { keyword, page: 1, limit: 6 });

  // State cho modal chỉnh sửa User
  const [showEditModal, setShowEditModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [editUserData, setEditUserData] = useState({
    username: "",
    password: "",
    role: "student",
  });

  const handleSearch = (e) => {
    e.preventDefault();
    refetch({ keyword, page: 1 });
  };

  const handlePageChange = (newPage) => {
    refetch({ page: newPage, keyword });
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users"); // Giả sử GET /users
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      alert("Lỗi tải danh sách user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async () => {
    try {
      await api.post("/users", newUser);
      alert("Tạo user thành công");
      setNewUser({ username: "", password: "", role: "student" });
      fetchUsers();
      refetch();
    } catch (err) {
      console.error(err);
      alert("Lỗi tạo user");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Xóa user này?")) return;
    try {
      await api.delete(`/users/${userId}`);
      fetchUsers();
      refetch();
    } catch (err) {
      console.error(err);
      alert("Xóa user thất bại");
    }
  };

  // --- Xử lý chỉnh sửa User ---
  const handleEditClick = (user) => {
    setUserToEdit(user);
    setEditUserData({
      username: user.username,
      password: "", // Để trống nếu không muốn thay đổi mật khẩu
      role: user.role,
    });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    setEditUserData({
      ...editUserData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveEdit = async () => {
    try {
      await api.put(`/users/${userToEdit.id}`, editUserData);
      alert("Cập nhật user thành công");
      setShowEditModal(false);
      fetchUsers();
      refetch();
    } catch (err) {
      console.error(err);
      alert("Lỗi cập nhật user");
    }
  };

  return (
    <div className="container my-4">
      <HustHeader
        title="Quản lý User"
        subtitle="Tạo, chỉnh sửa hoặc xoá tài khoản người dùng"
        icon="people-fill"
      />
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5>
            <i className="bi bi-plus-circle me-1"></i>Tạo User
          </h5>
          <div className="row mb-3">
            <div className="col-md-4">
              <label className="form-label">Username</label>
              <input
                className="form-control"
                value={newUser.username}
                onChange={(e) =>
                  setNewUser({ ...newUser, username: e.target.value })
                }
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Password</label>
              <input
                className="form-control"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Role</label>
              <select
                className="form-select"
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({ ...newUser, role: e.target.value })
                }
              >
                <option value="admin">Admin</option>
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>
              </select>
            </div>
          </div>
          <button className="btn btn-hust" onClick={handleCreateUser}>
            <i className="bi bi-plus-circle me-1"></i>Tạo
          </button>
        </div>
      </div>
      <div className="card shadow-sm">
        <div className="card-body">
          <h5>
            <i className="bi bi-table me-1"></i>Danh sách User
          </h5>
          <table className="table table-bordered table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Role</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {usersData.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.username}</td>
                  <td>{u.role}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => handleEditClick(u)}
                    >
                      <i className="bi bi-pencil-square"></i> Sửa
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteUser(u.id)}
                    >
                      <i className="bi bi-trash"></i> Xoá
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {meta && (
            <Pagination
              currentPage={meta.page}
              totalPages={meta.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>

      {/* Modal chỉnh sửa User */}
      {showEditModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Chỉnh sửa User</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    name="username"
                    value={editUserData.username}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="text"
                    className="form-control"
                    name="password"
                    placeholder="Để trống nếu không thay đổi"
                    value={editUserData.password}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Role</label>
                  <select
                    className="form-select"
                    name="role"
                    value={editUserData.role}
                    onChange={handleEditChange}
                  >
                    <option value="admin">Admin</option>
                    <option value="teacher">Teacher</option>
                    <option value="student">Student</option>
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

export default UserManagerPage;
