
import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";




function AdminDashboardPage() {
        const navigate = useNavigate();
     const handleLogout = () => {
       localStorage.removeItem("token");
       localStorage.removeItem("role");
       navigate("/login");
     };
  return (
    <div className="container mt-4">
      <h2>Dashboard Admin</h2>
     
      <div className="row">
        <div className="col-md-3">
          <div className="list-group">
            <Link to="users" className="list-group-item list-group-item-action">
              Quản lý User
            </Link>
            <Link
              to="subjects"
              className="list-group-item list-group-item-action"
            >
              Quản lý Môn học
            </Link>
            <Link
              to="classes"
              className="list-group-item list-group-item-action"
            >
              Quản lý Lớp học
            </Link>
          </div>
        </div>
        <div className="col-md-9">
          {/* Outlet để hiển thị các component con */}
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
