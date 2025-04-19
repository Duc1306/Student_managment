# 🎓 Student Management System

Hệ thống quản lý sinh viên fullstack được xây dựng với **ReactJS** (frontend) và **Node.js/Express + Sequelize** (backend). Dự án hỗ trợ các chức năng như:
- Quản lý sinh viên, giáo viên, lớp học, môn học
- Ghi nhận điểm danh
- Báo cáo, thống kê
- Nhập/xuất dữ liệu qua file

---

## 🏗️ Công nghệ sử dụng

### Frontend
- ReactJS
- TailwindCSS
- Ant-design 
- Axios
- React Router
- File Upload/Download

### Backend
- Node.js
- Express.js
- Sequelize ORM
- MySQL hoặc PostgreSQL (tùy cấu hình)
- JWT Authentication
- Multer (cho upload file)

---

## 🗂️ Cấu trúc thư mục

```bash
.
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   └── config/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── api.js
│   │   └── App.js


cd backend
npm install
# Thêm file .env để cấu hình database
npm start
cd frontend
npm install
npm start
