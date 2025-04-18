// src/pages/admin/ClassManagerPage.jsx
import { useEffect, useState } from "react";
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
  ApartmentOutlined,
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import HustHeader from "../../components/layout/HustHeader";
import HustFooter from "../../components/layout/HustFooter";
import ExportClasses from "../../components/export/ExportClasses";
import api from "../../api";

const { Option } = Select;

export default function ClassManagerPage() {

  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  const [newClass, setNewClass] = useState({
    ten_lop: "",
    ma_lop: "",
    subject_id: "",
    teacher_id: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");

  // Edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [classToEdit, setClassToEdit] = useState(null);
  const [editClassData, setEditClassData] = useState({
    ten_lop: "",
    ma_lop: "",
    subject_id: "",
    teacher_id: "",
  });

  /* ----------------------------- Fetch ----------------------------- */
  const fetchSubjectsAndTeachers = async () => {
    try {
      const [resSubject, resTeacher] = await Promise.all([
        api.get("/subjects"),
        api.get("/teachers"),
      ]);
      setSubjects(resSubject.data.data);
      setTeachers(resTeacher.data);
    } catch (err) {
      console.error(err);
      messageApi.error("Lỗi tải môn hoặc giáo viên");
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await api.get("/classes", {
        params: { page: currentPage, limit: 6, keyword: searchKeyword },
      });
      setClasses(res.data.data);
      setTotalPages(res.data.meta.totalPages);
    } catch (err) {
      console.error(err);
      messageApi.error("Lỗi tải lớp");
    }
  };

  const fetchData = () =>
    Promise.all([fetchClasses(), fetchSubjectsAndTeachers()]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchKeyword]);

  /* ---------------------------- Handlers --------------------------- */
  const handleCreateClass = async (values) => {
    try {
      await api.post("/classes", values);
      messageApi.success("Tạo lớp thành công");
      setNewClass({ ten_lop: "", ma_lop: "", subject_id: "", teacher_id: "" });
      fetchClasses();
    } catch (err) {
      console.error(err);
      messageApi.error("Tạo lớp thất bại");
    }
  };

  const handleDeleteClass = async (classId) => {
    try {
      await api.delete(`/classes/${classId}`);
      fetchClasses();
    } catch (err) {
      console.error(err);
      messageApi.error("Xoá lớp thất bại");
    }
  };

  const handleEditClick = (cls) => {
    setClassToEdit(cls);
    setEditClassData({
      ten_lop: cls.ten_lop,
      ma_lop: cls.ma_lop,
      subject_id: cls.subject_id,
      teacher_id: cls.teacher_id,
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      await api.put(`/classes/${classToEdit.id}`, editClassData);
      messageApi.success("Cập nhật lớp thành công");
      setShowEditModal(false);
      fetchClasses();
    } catch (err) {
      console.error(err);
      messageApi.error("Lỗi cập nhật lớp");
    }
  };


  const columns = [
    { title: "ID", dataIndex: "id", width: 60 },
    { title: "Tên lớp", dataIndex: "ten_lop" },
    { title: "Mã lớp", dataIndex: "ma_lop" },
    { title: "Môn", dataIndex: "subject_id" },
    { title: "Giáo viên", dataIndex: "teacher_id" },
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
            title="Xoá lớp này?"
            onConfirm={() => handleDeleteClass(record.id)}
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
        title="Quản lý Lớp"
        subtitle="Tạo, chỉnh sửa, hoặc xoá lớp học"
        icon={<ApartmentOutlined />}
      />

      {/* Form tạo lớp mới */}
      <Card className="mb-6">
        <Form
          layout="vertical"
          onFinish={handleCreateClass}
          initialValues={newClass}
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Tên lớp"
                name="ten_lop"
                rules={[{ required: true, message: "Nhập tên lớp" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Mã lớp"
                name="ma_lop"
                rules={[{ required: true, message: "Nhập mã lớp" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Môn học"
                name="subject_id"
                rules={[{ required: true, message: "Chọn môn" }]}
              >
                <Select placeholder="-- Chọn môn --">
                  {subjects.map((s) => (
                    <Option key={s.id} value={s.id}>
                      {s.ten_mon} ({s.ma_mon})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Giáo viên"
                name="teacher_id"
                rules={[{ required: true, message: "Chọn GV" }]}
              >
                <Select placeholder="-- Chọn giáo viên --">
                  {teachers.map((t) => (
                    <Option key={t.id} value={t.id}>
                      {t.ho_ten} ({t.ma_giao_vien})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            htmlType="submit"
            
          >
            Tạo lớp
          </Button>
        </Form>
      </Card>

      {/* Tìm kiếm */}
      <Form
        layout="inline"
        onFinish={() => {
          setCurrentPage(1);
          fetchClasses();
        }}
        className="mb-4"
      >
        <Form.Item>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Tìm theo tên..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Tìm kiếm
        </Button>
      </Form>

      {/* Danh sách lớp */}
      <Card>
        <Table
          rowKey="id"
          dataSource={classes}
          columns={columns}
          pagination={false}
        />

        <div className="flex justify-between items-center mt-4">
          <AntPagination
            current={currentPage}
            total={totalPages * 10}
            onChange={setCurrentPage}
          />
          <ExportClasses />
        </div>
      </Card>

      {/* Modal chỉnh sửa */}
      <Modal
        title="Chỉnh sửa Lớp"
        open={showEditModal}
        onCancel={() => setShowEditModal(false)}
        onOk={handleSaveEdit}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form layout="vertical">
          <Form.Item label="Tên lớp">
            <Input
              value={editClassData.ten_lop}
              onChange={(e) =>
                setEditClassData({ ...editClassData, ten_lop: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item label="Mã lớp">
            <Input
              value={editClassData.ma_lop}
              onChange={(e) =>
                setEditClassData({ ...editClassData, ma_lop: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item label="Môn học">
            <Select
              value={editClassData.subject_id}
              onChange={(value) =>
                setEditClassData({ ...editClassData, subject_id: value })
              }
            >
              {subjects.map((s) => (
                <Option key={s.id} value={s.id}>
                  {s.ten_mon} ({s.ma_mon})
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Giáo viên">
            <Select
              value={editClassData.teacher_id}
              onChange={(value) =>
                setEditClassData({ ...editClassData, teacher_id: value })
              }
            >
              {teachers.map((t) => (
                <Option key={t.id} value={t.id}>
                  {t.ho_ten} ({t.ma_giao_vien})
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <HustFooter />
    </div>
  );
}
