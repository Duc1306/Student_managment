
const { Class, Student, User, Teacher, Subject } = require("../models");

module.exports = {
  getAll: async (req, res) => {
    try {
      const role = req.user.role;
      let whereCondition = {};

      if (role === "teacher") {
        // Tìm teacher.id =?
        const teacher = await Teacher.findOne({
          where: { user_id: req.user.userId },
        });
        if (!teacher) {
          return res.status(403).json({ error: "Teacher not found" });
        }
        whereCondition = { teacher_id: teacher.id };
      } else if (role === "student") {
        // Lấy student
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
      }
      // admin => whereCondition rỗng => lấy hết

      const list = await Class.findAll({
        where: whereCondition,
        include: [Subject, Teacher],
      });
      res.json(list);
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
          password: password , // Mật khẩu đã được mã hóa
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
};
