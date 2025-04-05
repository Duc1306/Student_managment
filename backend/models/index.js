
const User = require("./User");
const Student = require("./Student");
const Teacher = require("./Teacher");
const Subject = require("./Subject");
const Class = require("./Class");
const StudentClass = require("./StudentClass");
const Attendance = require("./Attendance");

// 1 - 1: User - Student
User.hasOne(Student, { foreignKey: "user_id" });
Student.belongsTo(User, { foreignKey: "user_id" });

// 1 - 1: User - Teacher
User.hasOne(Teacher, { foreignKey: "user_id" });
Teacher.belongsTo(User, { foreignKey: "user_id" });

// 1 - n: Teacher - Class
Teacher.hasMany(Class, { foreignKey: "teacher_id" });
Class.belongsTo(Teacher, { foreignKey: "teacher_id" });

// 1 - n: Subject - Class
Subject.hasMany(Class, { foreignKey: "subject_id" });
Class.belongsTo(Subject, { foreignKey: "subject_id" });

// n - n: Student - Class
Student.belongsToMany(Class, {
  through: StudentClass,
  foreignKey: "student_id",
});
Class.belongsToMany(Student, { through: StudentClass, foreignKey: "class_id" });

// Attendance
Student.hasMany(Attendance, { foreignKey: "student_id" });
Attendance.belongsTo(Student, { foreignKey: "student_id" });

Class.hasMany(Attendance, { foreignKey: "class_id" });
Attendance.belongsTo(Class, { foreignKey: "class_id" });

module.exports = {
  User,
  Student,
  Teacher,
  Subject,
  Class,
  StudentClass,
  Attendance,
};
