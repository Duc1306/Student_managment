import React from "react";
import {
  Layout,
  Menu,
  Row,
  Col,
  Card,
  Statistic,
  Table,
  Avatar,
  Dropdown,
  Space,
  Breadcrumb,
  Typography,
  Button,
} from "antd";
import {
  DashboardOutlined,
  UserSwitchOutlined,
  BookOutlined,
  ApartmentOutlined,
  BarChartOutlined,
  LogoutOutlined,
  BellOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";

const { Sider, Header, Content, Footer } = Layout;
const { Title } = Typography;

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Xác định tab hiện tại; mặc định 'dashboard'
  const path = location.pathname.replace(/^\/admin\/?/, "");
  const currentKey = path.split("/")[0] || "dashboard";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  // Hardcoded dữ liệu thống kê
  const summary = {
    students: 2340,
    classes: 68,
    subjects: 121,
    reports: 940,
  };

  // Danh sách recent users mẫu
  const recentUsers = [
    { id: 1, username: "TRỊNH MINH ĐỨC ", role: "student", createdAt: "2025-04-10" },
    { id: 2, username: "NGUYỄN KHÁNH DUY ", role: "student", createdAt: "2025-04-11" },
    { id: 3, username: "NGÔ TRUNG LAM", role: "teacher", createdAt: "2025-04-09" },
  ];

  // Cấu hình stats với gradient
  const statsConfig = [
    {
      title: "Students",
      key: "students",
      icon: <UserSwitchOutlined />,
      gradient: "from-purple-500 to-indigo-500",
    },
    {
      title: "Classes",
      key: "classes",
      icon: <ApartmentOutlined />,
      gradient: "from-green-400 to-green-600",
    },
    {
      title: "Subjects",
      key: "subjects",
      icon: <BookOutlined />,
      gradient: "from-blue-400 to-blue-600",
    },
    {
      title: "Reports",
      key: "reports",
      icon: <BarChartOutlined />,
      gradient: "from-yellow-400 to-orange-500",
    },
  ];

  const columns = [
    { title: "Username", dataIndex: "username", key: "username" },
    { title: "Role", dataIndex: "role", key: "role" },
    { title: "Joined At", dataIndex: "createdAt", key: "createdAt" },
  ];

  return (
    <Layout className="min-h-screen bg-white dark:bg-gray-900">
      {/* Sidebar */}
      <Sider
        collapsible
        className="bg-gradient-to-b from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900"
      >
        <div className="py-4 text-center text-white text-lg font-bold tracking-wide">
          ADMIN PANEL
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[currentKey]}
          items={[
            {
              key: "dashboard",
              icon: <DashboardOutlined />,
              label: <Link to="/admin">Dashboard</Link>,
            },
            {
              key: "users",
              icon: <UserSwitchOutlined />,
              label: <Link to="/admin/users">User Manager</Link>,
            },
            {
              key: "subjects",
              icon: <BookOutlined />,
              label: <Link to="/admin/subjects">Subject Manager</Link>,
            },
            {
              key: "classes",
              icon: <ApartmentOutlined />,
              label: <Link to="/admin/classes">Class Manager</Link>,
            },
            {
              key: "reports",
              icon: <BarChartOutlined />,
              label: <Link to="/admin/reports">Reports</Link>,
            },
          ]}
          className="bg-transparent"
        />
        <div className="absolute bottom-4 w-full px-4">
          <Button
            type="primary"
            danger
            icon={<LogoutOutlined />}
            block
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </Sider>

      <Layout className="bg-white dark:bg-gray-900">
        {/* Header */}
        <Header className="bg-white dark:bg-gray-800 px-6 flex justify-between items-center shadow-md">
          <Breadcrumb className="text-gray-700 dark:text-gray-300">
            <Breadcrumb.Item>Admin</Breadcrumb.Item>
            <Breadcrumb.Item>
              {currentKey.charAt(0).toUpperCase() + currentKey.slice(1)}
            </Breadcrumb.Item>
          </Breadcrumb>
          <Space>
            <BellOutlined className="text-2xl text-gray-600 dark:text-gray-300" />
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item icon={<SettingOutlined />}>Profile</Menu.Item>
                  <Menu.Item icon={<LogoutOutlined />} onClick={handleLogout}>
                    Logout
                  </Menu.Item>
                </Menu>
              }
              placement="bottomRight"
            >
              <Avatar
                size="large"
                className="cursor-pointer"
                style={{ backgroundColor: "#7265e6" }}
              >
                A
              </Avatar>
            </Dropdown>
          </Space>
        </Header>

        {/* Content */}
        <Content className="p-8 bg-gradient-to-br from-gray-50 to-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 min-h-screen">
          {currentKey === "dashboard" ? (
            <>
              <Title
                level={2}
                className="mb-6 text-gray-700 dark:text-gray-200"
              >
                Dashboard Overview
              </Title>
              <Row gutter={[24, 24]}>
                {statsConfig.map((stat) => (
                  <Col xs={24} sm={12} md={6} key={stat.key}>
                    <Card
                      hoverable
                      className={`bg-gradient-to-br ${stat.gradient} text-white rounded-lg shadow-lg`}
                    >
                      <Statistic
                        title={stat.title}
                        value={summary[stat.key]}
                        prefix={stat.icon}
                        valueStyle={{ fontSize: 28, color: "#fff" }}
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
              <Card title="Recent Users" className="mt-8 rounded-lg shadow-md">
                <Table
                  dataSource={recentUsers}
                  columns={columns}
                  pagination={false}
                  rowKey="id"
                />
              </Card>
            </>
          ) : (
            <Outlet />
          )}
        </Content>

        <Footer className="text-center bg-white dark:bg-gray-800 dark:text-gray-400">
          © {new Date().getFullYear()} Student Management System
        </Footer>
      </Layout>
    </Layout>
  );
}
