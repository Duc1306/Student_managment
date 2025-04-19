# 🎓 Student Management System

Hệ thống quản lý sinh viên fullstack giúp nhà trường theo dõi và quản lý các hoạt động liên quan đến sinh viên, giáo viên, lớp học và điểm danh một cách hiệu quả.

---

## 🚀 Tính năng nổi bật

- ✅ Quản lý sinh viên, giáo viên, lớp học, môn học
- ✅ Ghi nhận và xem lịch sử điểm danh theo ngày
- ✅ Báo cáo tổng hợp theo lớp hoặc giáo viên
- ✅ Nhập/xuất dữ liệu qua file Excel
- ✅ Phân quyền theo vai trò: Admin, Teacher, Student
- ✅ Xác thực bảo mật bằng JWT
- ✅ Responsive UI (kết hợp Tailwind + Ant Design)

---

## 🏗️ Công nghệ sử dụng

### Frontend
- ⚛️ ReactJS
- 💅 TailwindCSS + Ant Design
- 📡 Axios + React Router
- 📁 File upload/download (Excel)

### Backend
- 🛠️ Node.js + Express.js
- 🧩 Sequelize ORM (MySQL hoặc PostgreSQL)
- 🔐 JWT Authentication
- 📂 Multer (upload file)

---

## 👥 Phân quyền người dùng

| Vai trò   | Quyền |
|-----------|-------|
| Admin     | Quản lý toàn bộ hệ thống: tài khoản, lớp, môn học, báo cáo |
| Teacher   | Xem lớp dạy, điểm danh, xuất báo cáo lớp của mình |
| Student   | Xem thời khoá biểu, lịch sử điểm danh, thông tin cá nhân |

---

## 🖼️ Giao diện (Demo Screenshots)

student-managment-sigma.vercel.app

---

## 📂 Cấu trúc thư mục chính

.
├── backend/                     # Phần backend Node.js + Express
│   ├── config/                  # Cấu hình kết nối database (Sequelize)
│   │   └── database.js
│   ├── controllers/            # Xử lý logic từng tính năng
│   │   ├── authController.js
│   │   ├── studentController.js
│   │   ├── teacherController.js
│   │   ├── classController.js
│   │   ├── subjectController.js
│   │   ├── attendanceController.js
│   │   ├── reportController.js
│   │   └── userController.js
│   ├── models/                 # Định nghĩa các bảng và liên kết CSDL
│   │   ├── Student.js
│   │   ├── Teacher.js
│   │   ├── Class.js
│   │   ├── Subject.js
│   │   ├── Attendance.js
│   │   ├── User.js
│   │   ├── StudentClass.js
│   │   └── index.js            # Khởi tạo Sequelize & liên kết models
│   ├── routes/                 # Định tuyến API
│   │   ├── authRoutes.js
│   │   ├── studentRoutes.js
│   │   ├── teacherRoutes.js
│   │   ├── classRoutes.js
│   │   ├── subjectRoutes.js
│   │   ├── attendanceRoutes.js
│   │   ├── reportRoutes.js
│   │   └── userRoutes.js
│   ├── middlewares/           # Middleware xử lý xác thực, upload,...
│   │   ├── authMiddleware.js
│   │   └── upload.js
│   ├── utils/                  # Tiện ích dùng chung
│   │   └── pagination.js
│   ├── .env                    # Biến môi trường
│   ├── index.js                # Điểm khởi động server
│   └── package.json            # Thông tin project và dependencies
│
├── frontend/                   # Giao diện frontend React
│   ├── public/                 # HTML gốc và tài nguyên tĩnh
│   │   ├── index.html
│   │   └── logo512.png,...
│   ├── src/
│   │   ├── api.js              # File chứa cấu hình gọi API (axios)
│   │   ├── App.js              # Component gốc
│   │   ├── index.js            # ReactDOM entrypoint
│   │   ├── theme.css           # Định nghĩa theme hoặc dark mode
│   │   ├── hooks/              # Custom hook gọi API, xử lý dữ liệu
│   │   │   └── useFetchData.js
│   │   ├── components/         # Component chia nhỏ theo chức năng
│   │   │   ├── layout/         # Header, Navbar, Footer
│   │   │   │   ├── HustHeader.jsx
│   │   │   │   ├── HustNavbar.jsx
│   │   │   │   └── HustFooter.jsx
│   │   │   ├── export/         # Component xuất dữ liệu
│   │   │   │   ├── ExportAttendance.jsx
│   │   │   │   └── ExportClasses.jsx
│   │   │   ├── import/         # Component nhập dữ liệu
│   │   │   │   └── ImportStudents.jsx
│   │   │   └── pagination/     # Phân trang dữ liệu
│   │   │       └── Pagination.jsx
│   │   ├── pages/              # Trang chia theo vai trò người dùng
│   │   │   ├── admin/          # Trang dành cho quản trị viên
│   │   │   │   ├── AdminDashboardPage.jsx
│   │   │   │   ├── UserManagerPage.jsx
│   │   │   │   ├── ClassManagerPage.jsx
│   │   │   │   ├── SubjectManagerPage.jsx
│   │   │   │   └── AdminReportPage.jsx
│   │   │   ├── teacher/        # Trang dành cho giáo viên
│   │   │   │   ├── TeacherDashboardPage.jsx
│   │   │   │   ├── TeacherClassDetailPage.jsx
│   │   │   │   └── TeacherReportPage.jsx
│   │   │   ├── student/        # Trang dành cho sinh viên
│   │   │   │   ├── StudentDashboardPage.jsx
│   │   │   │   └── StudentClassDetailPage.jsx
│   │   │   └── auth/           # Trang xác thực (login)
│   │   │       └── LoginPage.jsx
│   ├── tailwind.config.js      # Cấu hình TailwindCSS
│   └── package.json            # Thông tin project và dependencies
│
├── uploads/                    # Chứa file upload từ backend (ảnh, excel)
├── README.md                   # Mô tả dự án
└── .git/                       # Thư mục git version control


## ⚙️ Cài đặt & chạy dự án

### Backend
```bash
cd backend
npm install
npm start 
### Frontend
```bash 
cd frontend
npm install
npm start
