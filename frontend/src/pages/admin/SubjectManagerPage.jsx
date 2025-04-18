// src/pages/admin/SubjectManagerPage.jsx
import { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Form,
  Input,
  Button,
  Table,
  Modal,
  Popconfirm,
  Pagination as AntPagination,
  message,
} from "antd";
import {
  BookOutlined,
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import HustHeader from "../../components/layout/HustHeader";
import HustFooter from "../../components/layout/HustFooter";
import api from "../../api";

function SubjectManagerPage() {
  const [subjects, setSubjects] = useState([]);
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [subjectToEdit, setSubjectToEdit] = useState(null);
  const [editForm] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  

  const fetchSubjects = async () => {
    try {
      const res = await api.get("/subjects", {
        params: { page: currentPage, limit: 6, keyword: searchKeyword },
      });
      setSubjects(res.data.data);
      setTotalPages(res.data.meta.totalPages);
    } catch (err) {
      console.error(err);
      messageApi.error("Lỗi tải môn học");
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, [currentPage, searchKeyword]);

  const handleCreate = async (values) => {
    try {
      await api.post("/subjects", values);
      messageApi.success("Tạo môn thành công!");
      form.resetFields();
      setCurrentPage(1);
      fetchSubjects();
    } catch (err) {
      console.error(err);
      messageApi.error("Lỗi tạo môn");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/subjects/${id}`);
      messageApi.success("Xoá môn thành công");
      fetchSubjects();
    } catch (err) {
      console.error(err);
      messageApi.error("Xoá thất bại");
    }
  };

  const handleEditClick = (record) => {
    setSubjectToEdit(record);
    editForm.setFieldsValue({ ten_mon: record.ten_mon, ma_mon: record.ma_mon });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      const values = await editForm.validateFields();
      await api.put(`/subjects/${subjectToEdit.id}`, values);
      messageApi.success("Cập nhật môn học thành công!");
      setShowEditModal(false);
      fetchSubjects();
    } catch (err) {
      console.error(err);
      messageApi.error("Lỗi cập nhật môn học");
    }
  };

  const handleSearch = (values) => {
    setCurrentPage(1);
    setSearchKeyword(values.keyword || "");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const columns = [
    { title: "ID", dataIndex: "id", width: 60 },
    { title: "Tên môn", dataIndex: "ten_mon" },
    { title: "Mã môn", dataIndex: "ma_mon" },
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
            title="Xoá môn này?"
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
        title="Quản lý Môn học"
        subtitle="Thêm, chỉnh sửa hoặc xoá môn học"
        icon={<BookOutlined />}
      />

      <Card className="mb-6">
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Tên môn"
                name="ten_mon"
                rules={[{ required: true, message: "Nhập tên môn" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Mã môn"
                name="ma_mon"
                rules={[{ required: true, message: "Nhập mã môn" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            htmlType="submit"
          >
            Thêm môn
          </Button>
        </Form>
      </Card>

      <Form layout="inline" onFinish={handleSearch} className="mb-4">
        <Form.Item name="keyword">
          <Input
            prefix={<SearchOutlined />}
            placeholder="Tìm kiếm theo tên môn..."
          />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Tìm kiếm
        </Button>
      </Form>

      <Card>
        <Table
          rowKey="id"
          dataSource={subjects}
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
        title="Chỉnh sửa Môn học"
        open={showEditModal}
        onCancel={() => setShowEditModal(false)}
        onOk={handleSaveEdit}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            label="Tên môn"
            name="ten_mon"
            rules={[{ required: true, message: "Nhập tên môn" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Mã môn"
            name="ma_mon"
            rules={[{ required: true, message: "Nhập mã môn" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <HustFooter />
    </div>
  );
}

export default SubjectManagerPage;
