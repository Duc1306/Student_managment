// src/pages/admin/AdminDashboardPage.jsx
import React from "react";
import { Layout, Menu, Button } from "antd";
import {
  UserSwitchOutlined,
  BookOutlined,
  ApartmentOutlined,
  BarChartOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";

const { Sider, Content } = Layout;

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

 
  const currentKey =
    location.pathname.split("/admin/")[1]?.split("/")[0] || "users";

  const items = [
    {
      key: "users",
      icon: <UserSwitchOutlined />,
      label: <Link to="users">User Manager</Link>,
    },
    {
      key: "subjects",
      icon: <BookOutlined />,
      label: <Link to="subjects">Subject Manager</Link>,
    },
    {
      key: "classes",
      icon: <ApartmentOutlined />,
      label: <Link to="classes">Class Manager</Link>,
    },
    {
      key: "reports",
      icon: <BarChartOutlined />,
      label: <Link to="reports">Báo cáo tổng quan</Link>,
    },
  ];

  return (
    <Layout className="min-h-screen">
      {/* Sidebar */}
      <Sider breakpoint="lg" collapsible style={{ backgroundColor: "GRAY" }}>
        {/* Logo / Title */}
        <div className="py-4 text-center text-white text-lg font-semibold tracking-wide select-none">
          ADMIN PANEL
        </div>

        {/* Menu */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[currentKey]}
          items={items}
          style={{ backgroundColor: "GRAY" }}
        />

        {/* Logout button at bottom */}
        <div className="absolute bottom-4 w-full text-center px-4">
          <Button
            type="primary"
            danger
            icon={<LogoutOutlined />}
            block
            onClick={handleLogout}
          >
            Đăng xuất
          </Button>
        </div>
      </Sider>

      {/* Main content */}
      <Layout>
        <Content className="p-6 bg-[var(--hust-bg-light)] dark:bg-[var(--hust-bg-dark)] min-h-screen">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
