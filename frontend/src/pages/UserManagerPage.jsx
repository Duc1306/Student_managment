
import React, { useEffect, useState } from "react";
import api from "../api";

function UserManagerPage() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    role: "student",
  });

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (error) {
      alert(error.response?.data?.error || "Lỗi tải danh sách user");
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
    } catch (error) {
      alert(error.response?.data?.error || "Tạo user thất bại");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Bạn chắc muốn xóa user?")) return;
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.error || "Xóa thất bại");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Quản lý User</h2>
      <div className="row">
        <div className="col-md-4">
          <h4>Tạo User Mới</h4>
          <div className="mb-2">
            <label>Username</label>
            <input
              className="form-control"
              value={newUser.username}
              onChange={(e) =>
                setNewUser({ ...newUser, username: e.target.value })
              }
            />
          </div>
          <div className="mb-2">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
            />
          </div>
          <div className="mb-2">
            <label>Role</label>
            <select
              className="form-select"
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
              <option value="admin">Admin</option>
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
            </select>
          </div>
          <button className="btn btn-success" onClick={handleCreateUser}>
            Tạo
          </button>
        </div>
        <div className="col-md-8">
          <h4>Danh sách User</h4>
          <table className="table table-bordered">
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
                      Xóa
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

export default UserManagerPage;
