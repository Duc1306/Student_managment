// src/pages/auth/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Form, Input, Button, Typography, message } from "antd";
import { LoginOutlined, UserOutlined, LockOutlined } from "@ant-design/icons";
import api from "../../api";

const { Title } = Typography;

export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async ({ username, password }) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { username, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      messageApi.success("Đăng nhập thành công!");

      if (res.data.role === "admin") navigate("/admin");
      else if (res.data.role === "teacher") navigate("/teacher");
      else navigate("/student");
    } catch (err) {
      messageApi.error(err.response?.data?.error || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    
    {contextHolder}
    <div className="flex justify-center items-center min-h-screen bg-hust-red/10 px-4">
      
      <Card
        className="w-full max-w-md shadow-xl"
        bodyStyle={{ backgroundColor: "var(--hust-red)", padding: "2.5rem" }}
      >
        <Title level={3} className="!text-center !mb-6 !text-white">
          Đăng nhập HUST
        </Title>

        <Form
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          autoComplete="off"
        >
          <Form.Item
            label={<span className="text-white">Username</span>}
            name="username"
            rules={[{ required: true, message: "Vui lòng nhập username!" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Tên đăng nhập"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-white">Password</span>}
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mật khẩu"
              size="large"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            icon={<LoginOutlined />}
            loading={loading}
            className="w-full bg-white text-hust-red hover:!bg-gray-100"
            size="large"
          >
            Đăng nhập
          </Button>
        </Form>
      </Card>
    </div>
    </>
  );
}
