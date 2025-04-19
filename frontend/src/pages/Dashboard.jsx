import {
  Layout,
  Row,
  Col,
  Card,
  Statistic,
  Button,
  Typography,
  Space,
} from "antd";
import {
  UserOutlined,
  TeamOutlined,
  BookOutlined,
  FileDoneOutlined,
  LoginOutlined,
  UserAddOutlined,
  AppstoreOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

export default function Dashboard() {

  const stats = [
    {
      icon: <UserOutlined />,
      label: "Sinh viên",
      value: 2340,
      bg: "from-purple-500 to-indigo-500",
    },
    {
      icon: <TeamOutlined />,
      label: "Lớp học",
      value: 68,
      bg: "from-green-500 to-emerald-500",
    },
    {
      icon: <BookOutlined />,
      label: "Môn học",
      value: 121,
      bg: "from-blue-500 to-sky-500",
    },
    {
      icon: <FileDoneOutlined />,
      label: "Báo cáo",
      value: 940,
      bg: "from-yellow-400 to-amber-500",
    },
  ];

  // Các đường dẫn nhanh
  const quickLinks = [
    { to: "/login", label: "Đăng nhập", icon: <LoginOutlined /> },
    { to: "/login", label: "Đăng ký", icon: <UserAddOutlined /> },
    { to: "/login", label: "Quản lý lớp", icon: <AppstoreOutlined /> },
    { to: "/login", label: "Quản lý sinh viên", icon: <SolutionOutlined /> },
  ];

  return (
    <Layout className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}

      <Content>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 opacity-10" />

          <div className="container mx-auto text-center py-24 px-4">
            <Title className="!text-gray-800 dark:!text-white !leading-snug">
              Hệ thống Quản lý Sinh viên
            </Title>
            <Paragraph className="!text-gray-600 dark:!text-gray-300 max-w-2xl mx-auto">
              Theo dõi lớp học, sinh viên, điểm danh và báo cáo trong một bảng
              điều khiển trực quan duy nhất.
            </Paragraph>
            <Space className="mt-8">
              <Link to="/login">
                <Button type="primary" size="large" icon={<LoginOutlined />}>
                  Bắt đầu ngay
                </Button>
              </Link>
              <a
                href="https://react.dev/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="large" type="primary" icon={<SolutionOutlined />}>
                  Tài liệu
                </Button>
              </a>
            </Space>
          </div>
        </section>

        {/* Stats */}
        <section className="container mx-auto py-16 px-4">
          <Row gutter={[24, 24]} justify="center">
            {stats.map((s, i) => (
              <Col xs={12} md={6} key={i}>
                <Card
                  className={`text-center hover:shadow-lg transition-shadow bg-gradient-to-br ${s.bg} text-white`}
                  bordered={false}
                >
                  <Statistic
                    title={<span className="text-gray-100">{s.label}</span>}
                    value={s.value}
                    prefix={s.icon}
                    valueStyle={{ fontSize: 32, color: "white" }}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        {/* Quick Links */}
        <section className="container mx-auto pb-24 px-4">
          <Title level={4} className="!text-gray-800 dark:!text-white mb-6">
            Truy cập nhanh
          </Title>
          <Row gutter={[16, 16]}>
            {quickLinks.map((q, i) => (
              <Col xs={12} md={6} key={i}>
                <Link to={q.to}>
                  <Card
                    hoverable
                    className="group border border-transparent bg-white dark:bg-gray-800 hover:border-purple-500 dark:hover:border-purple-600 shadow-sm hover:shadow-lg transition-all"
                  >
                    <Space>
                      {q.icon}
                      <span className="group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors font-medium">
                        {q.label}
                      </span>
                    </Space>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </section>
      </Content>

      {/* Footer */}
      <Footer className="text-center bg-gray-100 dark:bg-gray-800 dark:text-gray-400">
        © {new Date().getFullYear()} Student Management System
      </Footer>
    </Layout>
  );
}
