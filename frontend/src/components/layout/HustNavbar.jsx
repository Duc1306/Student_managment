// src/components/layout/HustNavbar.jsx
import React from "react";
import { Layout, Menu, Button, Switch as AntSwitch, theme } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  BookOutlined,
  LoginOutlined,
  LogoutOutlined,
  BulbOutlined,
  MoonOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";

const { Header } = Layout;

export default function HustNavbar({ darkMode, setDarkMode }) {
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const { token } = theme.useToken();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const navItems = [
    role === "admin" && {
      key: "admin",
      icon: <DashboardOutlined />,
      label: <Link to="/admin">Admin Dashboard</Link>,
    },
    role === "teacher" && {
      key: "teacher",
      icon: <UserOutlined />,
      label: <Link to="/teacher">Teacher Dashboard</Link>,
    },
    role === "student" && {
      key: "student",
      icon: <BookOutlined />,
      label: <Link to="/student">Student Dashboard</Link>,
    },
  ].filter(Boolean);

  return (
    <Header
      className="flex items-center justify-between px-4"
      style={{ backgroundColor: "var(--hust-red)", padding: 0 }}
    >
      {/* Brand */}
      <div className="flex items-center gap-2 px-4">
        <Link to="/" className="flex items-center gap-2 text-white">
          <img
            src="/hust.jpg"
            alt="HUST"
            className="h-10 w-auto object-contain"
          />
          <span className="font-semibold hidden md:inline">
            Đại học Bách Khoa Hà Nội
          </span>
        </Link>
      </div>

      {/* Menu */}
      {role && (
        <Menu
          theme="dark"
          mode="horizontal"
          selectable={false}
          items={navItems}
          className="flex-1"
          style={{ backgroundColor: "transparent" }}
        />
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 px-4">
        {/* Dark Mode Switch */}
        <AntSwitch
          checked={darkMode}
          onChange={setDarkMode}
          checkedChildren={<MoonOutlined />}
          unCheckedChildren={<BulbOutlined />}
          style={{ backgroundColor: token.colorPrimary }}
        />

        {/* Login/Logout Button */}
        {role ? (
          <Button
            type="primary"
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            Đăng xuất
          </Button>
        ) : (
          <Link to="/login">
            <Button
              type="primary"
              icon={<LoginOutlined />}
              style={{
                backgroundColor: "var(--hust-red)",
                borderColor: "var(--hust-red)",
              }}
            >
              Đăng nhập
            </Button>
          </Link>
        )}
      </div>
    </Header>
  );
}
