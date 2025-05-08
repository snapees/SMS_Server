const express = require("express");
const authMiddleware = require("../auth/auth");
const {
  createSubject,
  getAllSubjects,
  updateSubjectWithId,
  deleteSubjectWithId,
} = require("../controllers/subject.controller");

const router = express.Router();

router.post("/create", authMiddleware(["SCHOOL"]), createSubject);
router.get("/all", authMiddleware(["SCHOOL"]), getAllSubjects);
router.patch("/update/:id", authMiddleware(["SCHOOL"]), updateSubjectWithId); // AUTHENTICATED USER CAN ABLE TO UPDATE HIS/HER DATA
router.delete("/delete/:id", authMiddleware(["SCHOOL"]), deleteSubjectWithId); // AUTHENTICATED USER CAN ABLE TO get his data

module.exports = router;
