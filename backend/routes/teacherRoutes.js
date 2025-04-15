const express = require("express");
const router = express.Router();
const teacherController = require("../controllers/teacherController");
const authMiddleware = require("../middlewares/authMiddleware");

router.use(authMiddleware);
router.get("/", teacherController.getAll);
router.put("/:id", (req, res) => {
  
  teacherController.updateTeacher(req, res);
});

module.exports = router;
