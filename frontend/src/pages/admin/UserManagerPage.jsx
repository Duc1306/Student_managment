import React, { useState, useEffect } from "react";
import api from "../../api";
import HustFooter from "../../components/HustFooter";
import HustHeader from "../../components/HustHeader";

function UserManagerPage() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    role: "student",
  });

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
      // POST /users
      await api.post("/users", newUser);
      alert("Tạo user thành công");
      setNewUser({ username: "", password: "", role: "student" });
      fetchUsers();
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
    } catch (err) {
      console.error(err);
      alert("Xóa user thất bại");
    }
  };

  return (
    <div className="container my-4">
      {/* Header */}
      <HustHeader
        title="Quản lý User"
        subtitle="Tạo, chỉnh sửa hoặc xoá tài khoản người dùng"
        icon="people-fill" /* Bootstrap icon */
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
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.username}</td>
                  <td>{u.role}</td>
                  <td>
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
        </div>
      </div>

      {/* Footer */}
      <HustFooter />
    </div>
  );
}

export default UserManagerPage;
