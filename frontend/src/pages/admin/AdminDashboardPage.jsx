
import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";

function AdminDashboardPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="container my-4">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 mb-3">
          <div className="card card-highlight">
            <div className="card-body">
              <h5 className="card-title">Quản lý</h5>
              <ul className="list-group">
                <li className="list-group-item">
                  <Link to="users" className="text-decoration-none">
                    User Manager
                  </Link>
                </li>
                <li className="list-group-item">
                  <Link to="subjects" className="text-decoration-none">
                    Subject Manager
                  </Link>
                </li>
                <li className="list-group-item">
                  <Link to="classes" className="text-decoration-none">
                    Class Manager
                  </Link>
                </li>
                {/* Thêm mục cho Báo cáo */}
                <li className="list-group-item">
                  <Link to="reports" className="text-decoration-none">
                    Báo cáo tổng quan
                  </Link>
                </li>
              </ul>
              <hr />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-md-9">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
