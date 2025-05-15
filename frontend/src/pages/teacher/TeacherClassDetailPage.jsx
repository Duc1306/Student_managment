// src/pages/teacher/TeacherClassDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import {
  Layout,
  Card,
  Form,
  DatePicker,
  Select,
  Button,
  Table,
  Modal,
  Popconfirm,
  Input,
  message,
  Tag
} from "antd";
import {
  CalendarOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import HustHeader from "../../components/layout/HustHeader";
import HustFooter from "../../components/layout/HustFooter";
import ImportStudents from "../../components/import/ImportStudents";
import ExportAttendance from "../../components/export/ExportAttendance";
import api from "../../api";

const { Content } = Layout;
const { Option } = Select;

export default function TeacherClassDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [classDetail, setClassDetail] = useState(null);
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [attendanceDate, setAttendanceDate] = useState(null);
  const [attendanceData, setAttendanceData] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState(null);
  const [editFormData, setEditFormData] = useState({
    ho_ten: "",
    ma_sinh_vien: "",
    ngay_sinh: "",
    dia_chi: "",
    password: "",
  });
  const today = dayjs().format("YYYY-MM-DD");
  

  const fetchData = async () => {
    try {
      const res = await api.get(`/classes/${id}/students`);
      const { classId, className, subject, teacher, students: studs } = res.data;
      setClassDetail({ classId, className, subject, teacher });
      setStudents(studs);
      const initData = {};
      studs.forEach((stu) => (initData[stu.id] = "present"));
      setAttendanceData(initData);
      const allRes = await api.get("/students");
      setAllStudents(allRes.data);
    } catch (err) {
      messageApi.error("Lỗi tải dữ liệu lớp");
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleToggleStatus = (studentId) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === "present" ? "absent" : "present",
    }));
  };

  const handleSaveAttendance = async () => {
    const attendanceList = students.map((stu) => ({
      studentId: stu.id,
      status: attendanceData[stu.id],
    }));
    try {
      await api.post("/attendance", {
        classId: id,
        date: today,
        attendanceList,
      });
      messageApi.success("Điểm danh thành công!");
    } catch {
      messageApi.error("Lỗi điểm danh");
    }
  };

  const handleRemoveStudent = async (studentId) => {
    try {
      await api.delete(`/classes/${id}/students/${studentId}`);
      messageApi.success("Xóa học sinh thành công");
      fetchData();
    } catch {
      messageApi.error("Lỗi xóa học sinh");
    }
  };

  const handleAddStudent = async () => {
    if (!selectedStudentId) {
      messageApi.warning("Chọn học sinh để thêm");
      return;
    }
    try {
      await api.post(`/classes/${id}/students`, { studentId: selectedStudentId });
      messageApi.success("Thêm học sinh thành công");
      fetchData();
    } catch (err) {
      messageApi.error(err.response?.data?.error || "Lỗi thêm học sinh");
    }
  };

  const handleEditClick = (student) => {
    setStudentToEdit(student);
    setEditFormData({
      ho_ten: student.ho_ten,
      ma_sinh_vien: student.ma_sinh_vien,
      ngay_sinh: student.ngay_sinh,
      dia_chi: student.dia_chi,
      password: "",
    });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async () => {
    if (!studentToEdit) return;
    try {
      await api.put(`/students/${studentToEdit.id}`, editFormData);
      messageApi.success("Cập nhật học sinh thành công");
      setShowEditModal(false);
      fetchData();
    } catch {
      messageApi.error("Lỗi cập nhật học sinh");
    }
  };

  const availableStudents = allStudents.filter((stu) => !students.some((s) => s.id === stu.id));

  const columns = [
    { title: "Họ tên", dataIndex: "ho_ten", key: "ho_ten" },
    { title: "Mã SV", dataIndex: "ma_sinh_vien", key: "ma_sinh_vien" },
    { title: "Username", dataIndex: ["User", "username"], key: "username" },
    {
      title: "Trạng thái",
      key: "status",
      render: (_, record) => {
        const isPresent = attendanceData[record.id] === "present";
        return (
          <Tag
            color={isPresent ? "green" : "red"}
            style={{ cursor: "pointer" }}
            onClick={() => handleToggleStatus(record.id)}
          >
            {isPresent ? "Có mặt" : "Vắng"}
          </Tag>
        );
      },
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <span className="flex space-x-2">
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEditClick(record)}
          />
          <Popconfirm
            title="Xóa học sinh khỏi lớp?"
            onConfirm={() => handleRemoveStudent(record.id)}
          >
            <Button icon={<DeleteOutlined />} danger size="small" />
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <Layout className="min-h-screen">
      {contextHolder}
      <Content className="container mx-auto py-6">
        <HustHeader
          title={`Chi tiết lớp: ${classDetail?.className || ""}`}
          subtitle={`Môn: ${classDetail?.subject || ""} | GV: ${
            classDetail?.teacher || ""
          }`}
          icon={<CalendarOutlined />}
        />

        <Card className="mb-6">
          <Form layout="inline">
            <Form.Item>
              <Button type="primary" onClick={handleSaveAttendance}>
                Lưu điểm danh ({today})
              </Button>
            </Form.Item>
            <Form.Item>
              <ExportAttendance classId={id} date={today} />
            </Form.Item>
          </Form>
        </Card>

        <Card title="Danh sách học sinh" className="mb-6">
          <Table
            n
            dataSource={students}
            columns={columns}
            rowKey="id"
            pagination={false}
          />
        </Card>

        <Card className="mb-6">
          <Form layout="inline">
            <Form.Item label="Thêm học sinh">
              <Select
                placeholder="Chọn học sinh"
                style={{ minWidth: 200 }}
                value={selectedStudentId}
                onChange={setSelectedStudentId}
                options={availableStudents.map((stu) => ({
                  value: stu.id,
                  label: `${stu.ho_ten} (${stu.ma_sinh_vien})`,
                }))}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="dashed"
                icon={<UploadOutlined />}
                onClick={handleAddStudent}
              >
                Thêm học sinh
              </Button>
            </Form.Item>
            <Form.Item>
              <ImportStudents classId={id} onImportSuccess={fetchData} />
            </Form.Item>
          </Form>
        </Card>

        <Modal
          title="Chỉnh sửa học sinh"
          open={showEditModal}
          onOk={handleSaveEdit}
          onCancel={() => setShowEditModal(false)}
          okText="Lưu"
          cancelText="Hủy"
        >
          <Form layout="vertical">
            <Form.Item label="Họ tên">
              <Input
                name="ho_ten"
                value={editFormData.ho_ten}
                onChange={handleEditChange}
              />
            </Form.Item>
            <Form.Item label="Mã SV">
              <Input
                name="ma_sinh_vien"
                value={editFormData.ma_sinh_vien}
                onChange={handleEditChange}
              />
            </Form.Item>
            <Form.Item label="Ngày sinh">
              <DatePicker
                value={
                  editFormData.ngay_sinh ? dayjs(editFormData.ngay_sinh) : null
                }
                onChange={(d) =>
                  setEditFormData((prev) => ({
                    ...prev,
                    ngay_sinh: d ? d.format("YYYY-MM-DD") : "",
                  }))
                }
              />
            </Form.Item>
            <Form.Item label="Địa chỉ">
              <Input
                name="dia_chi"
                value={editFormData.dia_chi}
                onChange={handleEditChange}
              />
            </Form.Item>
            {/* <Form.Item label="Mật khẩu">
              <Input.Password
                name="password"
                placeholder="Để trống nếu không thay đổi"
                value={editFormData.password}
                onChange={handleEditChange}
              />
            </Form.Item> */}
          </Form>
        </Modal>
      </Content>
      <HustFooter />
    </Layout>
  );
}
