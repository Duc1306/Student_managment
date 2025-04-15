    const express = require("express");
    const router = express.Router();
    const studentController = require("../controllers/studentController");
    const authMiddleware = require("../middlewares/authMiddleware");

    // Định nghĩa route GET /students
    router.use(authMiddleware);
    router.get("/", studentController.getAllStudents);
    router.put("/:id", (req, res) => {
      
      studentController.updateStudent(req, res);
    });

    module.exports = router;
