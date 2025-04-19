const {
  Class,
  Student,
  User,
  Teacher,
  Subject,
  StudentClass,
} = require("../models");
const { Op } = require("sequelize");
const xlsx = require("xlsx");
const bcrypt = require("bcryptjs");

module.exports = {
  getAll: async (req, res) => {
    try {
      const role = req.user.role;
      let whereCondition = {};

      if (role === "teacher") {
        // Tìm teacher dựa vào user_id
        const teacher = await Teacher.findOne({
          where: { user_id: req.user.userId },
        });
        if (!teacher) {
          return res.status(403).json({ error: "Teacher not found" });
        }
        whereCondition = { teacher_id: teacher.id };
        const classes = await Class.findAll({
          where: whereCondition,
          include: [Subject, Teacher],
        });
        return res.json(classes);
      } else if (role === "student") {
        // Lấy student và trả về danh sách lớp mà student đang học
        const student = await Student.findOne({
          where: { user_id: req.user.userId },
        });
        if (!student) {
          return res.status(403).json({ error: "Student not found" });
        }
        const classes = await student.getClasses({
          include: [Subject, Teacher],
        });
        return res.json(classes);
      } else if (role === "admin") {
        // Cho admin, thêm phân trang và tìm kiếm theo tên lớp
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const offset = (page - 1) * limit;
        const keyword = req.query.keyword || "";

        if (keyword) {
          whereCondition.ten_lop = { [Op.like]: `%${keyword}%` };
        }
        const { count, rows } = await Class.findAndCountAll({
          where: whereCondition,
          include: [Subject, Teacher],
          limit,
          offset,
        });
        return res.json({
          data: rows,
          meta: {
            total: count,
            page,
            limit,
            totalPages: Math.ceil(count / limit),
          },
        });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  create: async (req, res) => {
    try {
      const { ten_lop, ma_lop, subject_id, teacher_id } = req.body;
      const newClass = await Class.create({
        ten_lop,
        ma_lop,
        subject_id,
        teacher_id,
      });
      res.json(newClass);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { ten_lop, ma_lop, subject_id, teacher_id } = req.body;
      const c = await Class.findByPk(id);
      if (!c) return res.status(404).json({ error: "Class not found" });

      if (ten_lop) c.ten_lop = ten_lop;
      if (ma_lop) c.ma_lop = ma_lop;
      if (subject_id) c.subject_id = subject_id;
      if (teacher_id) c.teacher_id = teacher_id;
      await c.save();
      res.json(c);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const c = await Class.findByPk(id);
      if (!c) return res.status(404).json({ error: "Class not found" });

      await c.destroy();
      res.json({ message: "Class deleted" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  getStudentsOfClass: async (req, res) => {
    try {
      const { id } = req.params; // id của lớp
      // Tìm lớp theo id
      const foundClass = await Class.findByPk(id, {
        include: [Subject, Teacher], // JOIN thông tin môn học và giáo viên nếu cần
      });
      if (!foundClass) {
        return res.status(404).json({ error: "Class not found" });
      }

      // Kiểm tra quyền truy cập:
      const role = req.user.role;
      if (role === "teacher") {
        // Tìm teacher ứng với user hiện tại
        const teacher = await Teacher.findOne({
          where: { user_id: req.user.userId },
        });
        if (!teacher) {
          return res.status(403).json({ error: "Teacher not found" });
        }
        // Chỉ cho giáo viên xem nếu lớp thuộc trách nhiệm của họ
        if (foundClass.teacher_id !== teacher.id) {
          return res.status(403).json({ error: "Not your class" });
        }
      } else if (role === "student") {
        // Tìm student tương ứng
        const student = await Student.findOne({
          where: { user_id: req.user.userId },
        });
        if (!student) {
          return res.status(403).json({ error: "Student not found" });
        }
        // Kiểm tra student có thuộc lớp này hay không
        const isInClass = await foundClass.hasStudent(student);
        if (!isInClass) {
          return res
            .status(403)
            .json({ error: "This class does not belong to you" });
        }
      }
      // Nếu admin, không cần kiểm tra

      // Lấy danh sách sinh viên thực tế qua quan hệ N-N, JOIN thêm thông tin từ bảng User
      const students = await foundClass.getStudents({
        include: [
          {
            model: User,
            attributes: ["username", "role"],
          },
        ],
      });

      res.json({
        classId: foundClass.id,
        className: foundClass.ten_lop,
        subject: foundClass.Subject ? foundClass.Subject.ten_mon : null,
        teacher: foundClass.Teacher ? foundClass.Teacher.ho_ten : null,
        students,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  addStudentToClass: async (req, res) => {
    try {
      const { id } = req.params; // id của lớp
      const { studentId, ma_sinh_vien, ho_ten, ngay_sinh, dia_chi, password } =
        req.body;

      const foundClass = await Class.findByPk(id);
      if (!foundClass)
        return res.status(404).json({ error: "Class not found" });

      // Kiểm tra quyền: chỉ teacher mới được thêm học sinh vào lớp của mình
      if (req.user.role !== "teacher") {
        return res
          .status(403)
          .json({ error: "Only teacher can modify student list" });
      }
      const teacher = await Teacher.findOne({
        where: { user_id: req.user.userId },
      });
      if (!teacher || foundClass.teacher_id !== teacher.id) {
        return res.status(403).json({ error: "Not your class" });
      }

      let studentRecord;
      if (studentId) {
        // Nếu có studentId, cố gắng tìm trong bảng students
        studentRecord = await Student.findByPk(studentId);
      }

      // Nếu không tìm thấy, tạo mới học sinh
      if (!studentRecord) {
        if (!ma_sinh_vien || !ho_ten || !password) {
          return res.status(400).json({
            error:
              "Student not found. Please provide student details (ma_sinh_vien, ho_ten, password) to create new record.",
          });
        }

        // Tạo tài khoản user cho học sinh với role là 'student'
        const newUser = await User.create({
          username: ma_sinh_vien, // Dùng ma_sinh_vien làm username
          password: password, // Mật khẩu đã được mã hóa
          role: "student",
        });

        // Tạo bản ghi học sinh với user_id từ user vừa tạo
        studentRecord = await Student.create({
          user_id: newUser.id,
          ma_sinh_vien,
          ho_ten,
          ngay_sinh: ngay_sinh || null,
          dia_chi: dia_chi || null,
        });
      }

      // Kiểm tra xem học sinh đã có trong lớp chưa
      const exists = await foundClass.hasStudent(studentRecord.id);
      if (exists) {
        return res
          .status(400)
          .json({ error: "Student already exists in class" });
      }

      await foundClass.addStudent(studentRecord.id);
      res.json({
        message: "Student added successfully",
        student: studentRecord,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  removeStudentFromClass: async (req, res) => {
    try {
      const { id, studentId } = req.params;
      // Ép kiểu studentId sang số nguyên để đảm bảo khớp với kiểu dữ liệu trong DB
      const studentIdParsed = parseInt(studentId, 10);

      const foundClass = await Class.findByPk(id);
      if (!foundClass)
        return res.status(404).json({ error: "Class not found" });

      if (req.user.role !== "teacher") {
        return res
          .status(403)
          .json({ error: "Only teacher can modify student list" });
      }
      const teacher = await Teacher.findOne({
        where: { user_id: req.user.userId },
      });
      if (!teacher || foundClass.teacher_id !== teacher.id) {
        return res.status(403).json({ error: "Not your class" });
      }

      // Kiểm tra sự tồn tại của học sinh trong bảng students
      const studentRecord = await Student.findByPk(studentIdParsed);
      if (!studentRecord) {
        return res.status(404).json({ error: "Student not found in database" });
      }

      // Ép kiểu và kiểm tra xem học sinh có trong lớp không
      const exists = await foundClass.hasStudent(studentIdParsed);
      if (!exists) {
        return res
          .status(400)
          .json({ error: "Student does not exist in class" });
      }

      await foundClass.removeStudent(studentIdParsed);
      res.json({ message: "Student removed successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  exportClasses: async (req, res) => {
    try {
      // Lấy danh sách lớp từ database
      const classes = await Class.findAll({
        include: [
          { model: Subject, as: "Subject" },
          { model: Teacher, as: "Teacher" },
        ],
      });

      // Chuẩn bị dữ liệu export dưới dạng mảng đối tượng
      const data = classes.map((cls) => ({
        ID: cls.id,
        TenLop: cls.ten_lop,
        MaLop: cls.ma_lop,
        Subject: cls.subject
          ? `${cls.subject.ten_mon} (${cls.subject.ma_mon})`
          : "",
        Teacher: cls.teacher ? `${cls.teacher.ho_ten}` : "",
      }));

      // Tạo workbook và sheet
      const worksheet = xlsx.utils.json_to_sheet(data);
      const workbook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(workbook, worksheet, "Classes");

      // Ghi file vào buffer
      const buffer = xlsx.write(workbook, { bookType: "xlsx", type: "buffer" });

      res.setHeader(
        "Content-Disposition",
        "attachment; filename=class_list.xlsx"
      );
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.send(buffer);
    } catch (error) {
      console.error("Lỗi export lớp:", error);
      res.status(500).json({ error: "Lỗi export dữ liệu" });
    }
  },

  importStudents: async (req, res, next) => {
  const classId = req.params.id;
  if (!req.file) return res.status(400).json({ error: 'File không được gửi lên' });
  const workbook = xlsx.readFile(req.file.path);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet);
  try {
    // 1. Tạo (hoặc tìm) user + student
    const students = await Promise.all(rows.map(async row => {
      const [user] = await User.findOrCreate({
        where: { username: row.ma_sinh_vien },
        defaults: {
          password: row.password,
          role: "student",
        },
      });
      const [student] = await Student.findOrCreate({
        where: { ma_sinh_vien: row.ma_sinh_vien },
        defaults: {
          user_id: user.id,
          ho_ten: row.ho_ten,
          ngay_sinh: row.ngay_sinh,
          dia_chi: row.dia_chi
        }
      });
      return student;
    }));
    const foundClass = await Class.findByPk(classId);
    if (!foundClass) return res.status(404).json({ error: "Class not found" });

    // Thêm toàn bộ students vào class, Sequelize tự sinh JOIN table student_class
    await foundClass.addStudents(students);
    // 3. Trả về danh sách mới
    const updated = await foundClass.getStudents({
      include: [{ model: User, attributes: ["username"] }],
    });
    res.json({ success: true, students: updated });
  } catch (err) {
    next(err);
  }
}
};
