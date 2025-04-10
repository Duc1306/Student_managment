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


    -- USERS: Thêm 16 user mới
INSERT INTO users (id, username, password, role)
VALUES
(13, 'teacher04', '$2b$10$3xTceLrUowoEMf8ToC6ZPub6CWnO7opWtQh.klYpLbRELGVu10eEW', 'teacher'),
(14, 'teacher05', '$2b$10$3xTceLrUowoEMf8ToC6ZPub6CWnO7opWtQh.klYpLbRELGVu10eEW', 'teacher'),
(15, 'teacher06', '$2b$10$3xTceLrUowoEMf8ToC6ZPub6CWnO7opWtQh.klYpLbRELGVu10eEW', 'teacher'),
(16, 'teacher07', '$2b$10$3xTceLrUowoEMf8ToC6ZPub6CWnO7opWtQh.klYpLbRELGVu10eEW', 'teacher'),

(17, 'student09', '$2b$10$3xTceLrUowoEMf8ToC6ZPub6CWnO7opWtQh.klYpLbRELGVu10eEW', 'student'),
(18, 'student10', '$2b$10$3xTceLrUowoEMf8ToC6ZPub6CWnO7opWtQh.klYpLbRELGVu10eEW', 'student'),
(19, 'student11', '$2b$10$3xTceLrUowoEMf8ToC6ZPub6CWnO7opWtQh.klYpLbRELGVu10eEW', 'student'),
(20, 'student12', '$2b$10$3xTceLrUowoEMf8ToC6ZPub6CWnO7opWtQh.klYpLbRELGVu10eEW', 'student'),
(21, 'student13', '$2b$10$3xTceLrUowoEMf8ToC6ZPub6CWnO7opWtQh.klYpLbRELGVu10eEW', 'student'),
(22, 'student14', '$2b$10$3xTceLrUowoEMf8ToC6ZPub6CWnO7opWtQh.klYpLbRELGVu10eEW', 'student'),
(23, 'student15', '$2b$10$3xTceLrUowoEMf8ToC6ZPub6CWnO7opWtQh.klYpLbRELGVu10eEW', 'student'),
(24, 'student16', '$2b$10$3xTceLrUowoEMf8ToC6ZPub6CWnO7opWtQh.klYpLbRELGVu10eEW', 'student'),
(25, 'student17', '$2b$10$3xTceLrUowoEMf8ToC6ZPub6CWnO7opWtQh.klYpLbRELGVu10eEW', 'student'),
(26, 'student18', '$2b$10$3xTceLrUowoEMf8ToC6ZPub6CWnO7opWtQh.klYpLbRELGVu10eEW', 'student'),
(27, 'student19', '$2b$10$3xTceLrUowoEMf8ToC6ZPub6CWnO7opWtQh.klYpLbRELGVu10eEW', 'student'),
(28, 'student20', '$2b$10$3xTceLrUowoEMf8ToC6ZPub6CWnO7opWtQh.klYpLbRELGVu10eEW', 'student');
-- TEACHERS: ID #4..#7
INSERT INTO teachers (id, user_id, ma_giao_vien, ho_ten, bo_mon)
VALUES
(4, 13, 'GV004', 'Phạm Thị Hòa', 'Hóa học'),
(5, 14, 'GV005', 'Trịnh Văn Hảo', 'Cơ điện tử'),
(6, 15, 'GV006', 'Nguyễn Thị Linh', 'Cơ khí'),
(7, 16, 'GV007', 'Hoàng Minh Triết', 'Khoa học máy tính');
-- STUDENTS: ID #9..#20
INSERT INTO students (id, user_id, ma_sinh_vien, ho_ten, ngay_sinh, dia_chi)
VALUES
(9, 17,  'BKHN-2019009',  'Trương Văn T',    '1999-06-01', 'Hà Nội'),
(10, 18, 'BKHN-2019010',  'Phạm Đức An',     '1999-12-11', 'Hà Nội'),
(11, 19, 'BKHN-2019011',  'Bùi Thị Mến',     '2000-03-05', 'Hà Nội'),
(12, 20, 'BKHN-2019012',  'Ngô Văn Nam',     '1999-08-17', 'Hà Nội'),
(13, 21, 'BKHN-2019013',  'Đặng Hồng Liên',  '1999-01-23', 'Hà Nội'),
(14, 22, 'BKHN-2019014',  'Lý Minh Tiến',    '1999-09-10', 'Hà Nội'),
(15, 23, 'BKHN-2019015',  'Nguyễn Hà My',    '2000-02-20', 'Hà Nội'),
(16, 24, 'BKHN-2019016',  'Lê Văn Trường',   '1999-04-14', 'Hà Nội'),
(17, 25, 'BKHN-2019017',  'Đỗ Thị Yến',      '2000-07-22', 'Hà Nội'),
(18, 26, 'BKHN-2019018',  'Phan Nhật Tú',    '1999-11-09', 'Hà Nội'),
(19, 27, 'BKHN-2019019',  'Vũ Thị Mai',      '2000-05-01', 'Hà Nội'),
(20, 28, 'BKHN-2019020',  'Hoàng Văn K',     '1999-10-30', 'Hà Nội');
-- CLASSES: ID #5..#8
INSERT INTO classes (id, ten_lop, ma_lop, subject_id, teacher_id)
VALUES
(5, 'Lớp CSDL 2',       'INT3306-2', 1, 4),   -- subject_id=1 (CSDL), teacher_id=4 (Phạm Thị Hòa)
(6, 'Lớp Web 2',        'INT3115-2', 2, 4),
(7, 'Lớp Điện tử số 2', 'EE2010-2',  3, 6),   -- subject_id=3, teacher_id=6
(8, 'Lớp Toán Rời Rạc 2','INT2207-2', 4, 7);
-- STUDENT_CLASS: Thêm quan hệ new students + new classes
-- Lớp (5) CSDL 2 => 8 SV (9..16) 
INSERT INTO student_class (student_id, class_id)
VALUES
(9,5),(10,5),(11,5),(12,5),(13,5),(14,5),(15,5),(16,5);

-- Lớp (6) Web 2 => 6 SV (9..14)
INSERT INTO student_class (student_id, class_id)
VALUES
(9,6),(10,6),(11,6),(12,6),(13,6),(14,6);

-- Lớp (7) Điện tử số 2 => 4 SV (17..20)
INSERT INTO student_class (student_id, class_id)
VALUES
(17,7),(18,7),(19,7),(20,7);

-- Lớp (8) Toán Rời Rạc 2 => 6 SV (9..11, 17..19)
INSERT INTO student_class (student_id, class_id)
VALUES
(9,8),(10,8),(11,8),(17,8),(18,8),(19,8);
-- ATTENDANCE: Lớp #5 (CSDL 2) ngày 2023-10-10
INSERT INTO attendance (student_id, class_id, date, status)
VALUES
(9,5,'2023-10-10','present'),
(10,5,'2023-10-10','late'),
(11,5,'2023-10-10','absent'),
(12,5,'2023-10-10','present'),
(13,5,'2023-10-10','present'),
(14,5,'2023-10-10','present'),
(15,5,'2023-10-10','late'),
(16,5,'2023-10-10','absent');

-- Lớp #6 (Web 2) ngày 2023-10-15
INSERT INTO attendance (student_id, class_id, date, status)
VALUES
(9,6,'2023-10-15','present'),
(10,6,'2023-10-15','absent'),
(11,6,'2023-10-15','present'),
(12,6,'2023-10-15','late'),
(13,6,'2023-10-15','present'),
(14,6,'2023-10-15','present');

-- Lớp #7 (Điện tử số 2) ngày 2023-10-20
INSERT INTO attendance (student_id, class_id, date, status)
VALUES
(17,7,'2023-10-20','present'),
(18,7,'2023-10-20','late'),
(19,7,'2023-10-20','absent'),
(20,7,'2023-10-20','present');

-- Lớp #8 (Toán Rời Rạc 2) ngày 2023-10-20
INSERT INTO attendance (student_id, class_id, date, status)
VALUES
(9,8,'2023-10-20','present'),
(10,8,'2023-10-20','absent'),
(11,8,'2023-10-20','present'),
(17,8,'2023-10-20','absent'),
(18,8,'2023-10-20','present'),
(19,8,'2023-10-20','late');

