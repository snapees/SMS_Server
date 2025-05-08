const express = require("express");
const authMiddleware = require("../auth/auth");
const {
  createNotice,
  getAllNotices,
  updateNoticeWithId,
  deleteNoticeWithId,
  getTeacherNotices,
  getStudentNotices,
} = require("../controllers/notice.controller");

const router = express.Router();

router.post("/create", authMiddleware(["SCHOOL"]), createNotice);
router.get("/all", authMiddleware(["SCHOOL"]), getAllNotices);
router.get("/teacher", authMiddleware(["TEACHER"]), getTeacherNotices);
router.get("/student", authMiddleware(["STUDENT"]), getStudentNotices);
router.patch("/update/:id", authMiddleware(["SCHOOL"]), updateNoticeWithId);
router.delete("/delete/:id", authMiddleware(["SCHOOL"]), deleteNoticeWithId);

module.exports = router;
