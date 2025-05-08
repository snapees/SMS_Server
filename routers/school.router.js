const express = require("express");
const {
  registerSchool,
  getAllSchools,
  loginSchool,
  updateSchool,
  getSchoolOwnData,
} = require("../controllers/school.controller");
const authMiddleware = require("../auth/auth");

const router = express.Router();

router.post("/register", registerSchool);
router.get("/all", getAllSchools);
router.post("/login", loginSchool);
router.patch("/update", authMiddleware(["SCHOOL"]), updateSchool); // AUTHENTICATED USER CAN ABLE TO UPDATE HIS/HER DATA
router.get("/fetch-single", authMiddleware(["SCHOOL"]), getSchoolOwnData); // AUTHENTICATED USER CAN ABLE TO get his data

module.exports = router;
