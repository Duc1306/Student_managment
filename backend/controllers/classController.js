
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
        // Tìm lớp student này học => n-n => ta phải join
        // Cách 1: student.getClasses()
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
        include: [Subject, Teacher] // JOIN thông tin môn học và giáo viên nếu cần
      });
      if (!foundClass) {
        return res.status(404).json({ error: 'Class not found' });
      }

      // Kiểm tra quyền truy cập:
      const role = req.user.role;
      if (role === 'teacher') {
        // Tìm teacher ứng với user hiện tại
        const teacher = await Teacher.findOne({ where: { user_id: req.user.userId } });
        if (!teacher) {
          return res.status(403).json({ error: 'Teacher not found' });
        }
        // Chỉ cho giáo viên xem nếu lớp thuộc trách nhiệm của họ
        if (foundClass.teacher_id !== teacher.id) {
          return res.status(403).json({ error: 'Not your class' });
        }
      } else if (role === 'student') {
        // Tìm student tương ứng
        const student = await Student.findOne({ where: { user_id: req.user.userId } });
        if (!student) {
          return res.status(403).json({ error: 'Student not found' });
        }
        // Kiểm tra student có thuộc lớp này hay không
        const isInClass = await foundClass.hasStudent(student);
        if (!isInClass) {
          return res.status(403).json({ error: 'This class does not belong to you' });
        }
      }
      // Nếu admin, không cần kiểm tra

      // Lấy danh sách sinh viên thực tế qua quan hệ N-N, JOIN thêm thông tin từ bảng User
      const students = await foundClass.getStudents({
        include: [{
          model: User,
          attributes: ['username', 'role']
        }]
      });

      res.json({
        classId: foundClass.id,
        className: foundClass.ten_lop,
        subject: foundClass.Subject ? foundClass.Subject.ten_mon : null,
        teacher: foundClass.Teacher ? foundClass.Teacher.ho_ten : null,
        students
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

};
