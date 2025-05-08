const express = require("express");
const authMiddleware = require("../auth/auth");
const {
  newExamination,
  getAllExaminations,
  getExaminationsByClass,
  deleteExaminationWithId,
  updateExaminationWithId,
} = require("../controllers/examination.controller");

const router = express.Router();

router.post("/create", authMiddleware(["SCHOOL"]), newExamination);
router.get("/all", authMiddleware(["SCHOOL"]), getAllExaminations);
router.get(
  "/class/:id",
  authMiddleware(["SCHOOL", "TEACHER", "STUDENT"]),
  getExaminationsByClass
);
router.post("/update/:id", authMiddleware(["SCHOOL"]), updateExaminationWithId);
router.delete(
  "/delete/:id",
  authMiddleware(["SCHOOL"]),
  deleteExaminationWithId
);

module.exports = router;
