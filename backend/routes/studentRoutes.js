    const express = require("express");
    const router = express.Router();
    const studentController = require("../controllers/studentController");
    const authMiddleware = require("../middlewares/authMiddleware");

    // Định nghĩa route GET /students
    router.use(authMiddleware);
    router.get("/", studentController.getAllStudents);

    module.exports = router;
