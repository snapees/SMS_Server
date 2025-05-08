const express = require("express");
const authMiddleware = require("../auth/auth");
const {
  registerStudent,
  getStudentWithQuery,
  loginStudent,
  updateStudent,
  getStudentOwnData,
  getStudentWithId,
  deleteStudentWithId,
} = require("../controllers/student.controller");

const router = express.Router();

router.post("/register", authMiddleware(["SCHOOL"]), registerStudent);
router.get(
  "/fetch-with-query",
  authMiddleware(["SCHOOL", "TEACHER"]),
  getStudentWithQuery
);
router.post("/login", loginStudent);
router.patch("/update/:id", authMiddleware(["SCHOOL"]), updateStudent); // AUTHENTICATED USER CAN ABLE TO UPDATE HIS/HER DATA
router.get("/fetch-single", authMiddleware(["STUDENT"]), getStudentOwnData); // AUTHENTICATED USER CAN ABLE TO get his data
router.get("/fetch/:id", authMiddleware(["SCHOOL"]), getStudentWithId);
router.delete("/delete/:id", authMiddleware(["SCHOOL"]), deleteStudentWithId);

module.exports = router;
