// src/pages/admin/UserManagerPage.jsx
import { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Form,
  Input,
  Select,
  Button,
  Table,
  Modal,
  Popconfirm,
  Pagination as AntPagination,
  message,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import HustHeader from "../../components/layout/HustHeader";
import HustFooter from "../../components/layout/HustFooter";
import api from "../../api";

const { Option } = Select;

function UserManagerPage() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [editForm] = Form.useForm();
  const [createForm] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users", {
        params: { page: currentPage, limit: 6, keyword: searchKeyword },
      });
      setUsers(res.data.data);
      setTotalPages(res.data.meta.totalPages);
    } catch (err) {
      console.error(err);
      messageApi.error("Lỗi tải danh sách user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchKeyword]);

  const handleCreate = async (values) => {
    try {
      await api.post("/users", values);
      messageApi.success("Tạo user thành công!");
      createForm.resetFields();
      setCurrentPage(1);
      fetchUsers();
    } catch (err) {
      console.error(err);
      messageApi.error("Lỗi tạo user");
    }
  };

  const handleSearch = ({ keyword }) => {
    setCurrentPage(1);
    setSearchKeyword(keyword || "");
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/users/${id}`);
      messageApi.success("Xoá user thành công");
      fetchUsers();
    } catch (err) {
      console.error(err);
      messageApi.error("Xoá user thất bại");
    }
  };

  const handleEditClick = (record) => {
    setUserToEdit(record);
    editForm.setFieldsValue({ username: record.username, role: record.role });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      const values = await editForm.validateFields();
      await api.put(`/users/${userToEdit.id}`, values);
      messageApi.success("Cập nhật user thành công!");
      setShowEditModal(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
      messageApi.error("Lỗi cập nhật user");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const columns = [
    { title: "ID", dataIndex: "id", width: 60 },
    { title: "Username", dataIndex: "username" },
    { title: "Role", dataIndex: "role" },
    {
      title: "Hành động",
      dataIndex: "actions",
      render: (_, record) => (
        <>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEditClick(record)}
          />
          <Popconfirm
            title="Xoá user này?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button
              icon={<DeleteOutlined />}
              danger
              size="small"
              className="ml-2"
            />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div className="container mx-auto py-6">
      {contextHolder}
      <HustHeader
        title="Quản lý User"
        subtitle="Tạo, chỉnh sửa hoặc xoá tài khoản người dùng"
        icon={<TeamOutlined />}
      />

      <Card className="mb-6">
        <Form form={createForm} layout="vertical" onFinish={handleCreate}>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: "Nhập username" }]}
              >
                <Input prefix={<UserOutlined />} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Nhập password" }]}
              >
                <Input.Password prefix={<LockOutlined />} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Role"
                name="role"
                rules={[{ required: true, message: "Chọn role" }]}
              >
                <Select placeholder="Chọn role">
                  <Option value="admin">Admin</Option>
                  <Option value="teacher">Teacher</Option>
                  <Option value="student">Student</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            htmlType="submit"
          >
            Tạo user
          </Button>
        </Form>
      </Card>

      <Form layout="inline" onFinish={handleSearch} className="mb-4">
        <Form.Item name="keyword">
          <Input prefix={<SearchOutlined />} placeholder="Tìm kiếm user..." />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Tìm kiếm
        </Button>
      </Form>

      <Card>
        <Table
          rowKey="id"
          dataSource={users}
          columns={columns}
          pagination={false}
        />
        <div className="flex justify-center items-center mt-4">
          <AntPagination
            current={currentPage}
            total={totalPages * 6}
            pageSize={6}
            onChange={handlePageChange}
          />
        </div>
      </Card>

      <Modal
        title="Chỉnh sửa User"
        open={showEditModal}
        onCancel={() => setShowEditModal(false)}
        onOk={handleSaveEdit}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Nhập username" }]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>
          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Chọn role" }]}
          >
            <Select>
              <Option value="admin">Admin</Option>
              <Option value="teacher">Teacher</Option>
              <Option value="student">Student</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <HustFooter />
    </div>
  );
}

export default UserManagerPage;
