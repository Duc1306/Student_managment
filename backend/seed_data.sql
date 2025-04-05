-- Chọn DB (nếu chưa USE):
USE student_managment;

-- 1) USERS
-- Mật khẩu dưới đây là bcrypt hash của "123456" (được tạo với saltRounds=10)
-- Ví dụ: bcrypt.hashSync("123456", 10) => $2b$10$3xTceLrUowoEMf8ToC6ZPub6CWnO7opWtQh.klYpLbRELGVu10eEW
INSERT INTO users (id, username, password, role)
VALUES
(1, 'admin',    '$2b$10$3xTceLrUowoEMf8ToC6ZPub6CWnO7opWtQh.klYpLbRELGVu10eEW', 'admin'),
(2, 'teacher01','$2b$10$3xTceLrUowoEMf8ToC6ZPub6CWnO7opWtQh.klYpLbRELGVu10eEW', 'teacher'),
(3, 'teacher02','$2b$10$3xTceLrUowoEMf8ToC6ZPub6CWnO7opWtQh.klYpLbRELGVu10eEW', 'teacher'),
(4, 'teacher03','$2b$10$3xTceLrUowoEMf8ToC6ZPub6CWnO7opWtQh.klYpLbRELGVu10eEW', 'teacher'),
(5, 'student01','$2b$10$3xTceLrUowoEMf8ToC6ZPub6CWnO7opWtQh.klYpLbRELGVu10eEW', 'student'),
(6, 'student02','$2b$10$3xTceLrUowoEMf8ToC6ZPub6CWnO7opWtQh.klYpLbRELGVu10eEW', 'student'),
(7, 'student03','$2b$10$3xTceLrUowoEMf8ToC6ZPub6CWnO7opWtQh.klYpLbRELGVu10eEW', 'student'),
(8, 'student04','$2b$10$3xTceLrUowoEMf8ToC6ZPub6CWnO7opWtQh.klYpLbRELGVu10eEW', 'student'),
(9, 'student05','$2b$10$3xTceLrUowoEMf8ToC6ZPub6CWnO7opWtQh.klYpLbRELGVu10eEW', 'student'),
(10,'student06','$2b$10$3xTceLrUowoEMf8ToC6ZPub6CWnO7opWtQh.klYpLbRELGVu10eEW', 'student'),
(11,'student07','$2b$10$3xTceLrUowoEMf8ToC6ZPub6CWnO7opWtQh.klYpLbRELGVu10eEW', 'student'),
(12,'student08','$2b$10$3xTceLrUowoEMf8ToC6ZPub6CWnO7opWtQh.klYpLbRELGVu10eEW', 'student');

-- 2) TEACHERS (gắn với users #2,#3,#4)
INSERT INTO teachers (id, user_id, ma_giao_vien, ho_ten, bo_mon)
VALUES
(1, 2, 'GV001', 'Nguyễn Văn Nam', 'Công nghệ thông tin'),
(2, 3, 'GV002', 'Trần Thị Hà',    'Toán - Tin'),
(3, 4, 'GV003', 'Lê Văn Hùng',   'Điện tử - Viễn thông');

-- 3) STUDENTS (gắn với users #5..#12)
INSERT INTO students (id, user_id, ma_sinh_vien, ho_ten, ngay_sinh, dia_chi)
VALUES
(1, 5,  'BKHN-2019001', 'Nguyễn Văn A', '1999-05-12', 'Hà Nội'),
(2, 6,  'BKHN-2019002', 'Trần Thị B',   '1999-03-22', 'Hà Nội'),
(3, 7,  'BKHN-2019003', 'Phạm Văn C',   '1999-07-15', 'Hà Nội'),
(4, 8,  'BKHN-2019004', 'Đỗ Thị D',     '1998-11-01', 'Hà Nội'),
(5, 9,  'BKHN-2019005', 'Hoàng Văn E',  '1999-02-10', 'Hà Nội'),
(6, 10, 'BKHN-2019006', 'Vũ Thị F',     '1999-04-04', 'Hà Nội'),
(7, 11, 'BKHN-2019007', 'Lê Văn G',     '1999-08-20', 'Hà Nội'),
(8, 12, 'BKHN-2019008', 'Nguyễn Thị H', '1999-10-09', 'Hà Nội');

-- 4) SUBJECTS (môn học)
INSERT INTO subjects (id, ten_mon, ma_mon)
VALUES
(1, 'Cơ sở dữ liệu', 'INT3306'),
(2, 'Lập trình Web', 'INT3115'),
(3, 'Điện tử số',    'EE2010'),
(4, 'Toán rời rạc',  'INT2207');

-- 5) CLASSES (lớp học, tham chiếu subject_id, teacher_id)
-- Chú ý: teacher_id ở đây là ID của bảng TEACHERS (1,2,3)
INSERT INTO classes (id, ten_lop, ma_lop, subject_id, teacher_id)
VALUES
(1, 'Lớp CSDL 1',       'INT3306-1', 1, 1),   -- subject 1 (CSDL), teacher 1 (CNTT)
(2, 'Lớp Web 1',        'INT3115-1', 2, 1),
(3, 'Lớp Điện tử số',   'EE2010-1',  3, 3),   -- subject 3, teacher 3 (ĐTVT)
(4, 'Lớp Toán Rời Rạc', 'INT2207-1', 4, 2);

-- 6) STUDENT_CLASS (quan hệ nhiều-nhiều: student_id, class_id)
-- Ví dụ: Cho 8 SV tham gia 2 lớp đầu (CSDL & Web) 
INSERT INTO student_class (student_id, class_id)
VALUES
-- Lớp (1) INT3306-1
(1,1),(2,1),(3,1),(4,1),(5,1),(6,1),(7,1),(8,1),
-- Lớp (2) INT3115-1
(1,2),(2,2),(3,2),(4,2),(5,2),(6,2),(7,2),(8,2),
-- Lớp (3) EE2010-1: chỉ cho 4 SV (1..4) 
(1,3),(2,3),(3,3),(4,3),
-- Lớp (4) Toán Rời Rạc: 4 SV còn lại (5..8)
(5,4),(6,4),(7,4),(8,4);

-- 7) ATTENDANCE (điểm danh)
-- Ví dụ: cho lớp (1) ngày 2023-10-01, 8 SV. 
-- present, absent, late
INSERT INTO attendance (student_id, class_id, date, status)
VALUES
(1,1,'2023-10-01','present'),
(2,1,'2023-10-01','present'),
(3,1,'2023-10-01','absent'),
(4,1,'2023-10-01','present'),
(5,1,'2023-10-01','late'),
(6,1,'2023-10-01','present'),
(7,1,'2023-10-01','absent'),
(8,1,'2023-10-01','present'),

-- Lớp (1) ngày 2023-10-02
(1,1,'2023-10-02','present'),
(2,1,'2023-10-02','present'),
(3,1,'2023-10-02','present'),
(4,1,'2023-10-02','late'),
(5,1,'2023-10-02','absent'),
(6,1,'2023-10-02','present'),
(7,1,'2023-10-02','present'),
(8,1,'2023-10-02','present'),

-- Lớp (2) ngày 2023-10-01
(1,2,'2023-10-01','present'),
(2,2,'2023-10-01','absent'),
(3,2,'2023-10-01','present'),
(4,2,'2023-10-01','present'),
(5,2,'2023-10-01','absent'),
(6,2,'2023-10-01','late'),
(7,2,'2023-10-01','present'),
(8,2,'2023-10-01','present');
