const express = require("express");
const authMiddleware = require("../auth/auth");
const {
  createClass,
  getAllClasses,
  updateClassWithId,
  deleteClassWithId,
  getSingleClass,
  getAttendeeClass,
} = require("../controllers/class.controller");

const router = express.Router();

router.post("/create", authMiddleware(["SCHOOL"]), createClass);
router.get("/all", authMiddleware(["SCHOOL", "TEACHER"]), getAllClasses);
router.get("/attendee", authMiddleware(["TEACHER"]), getAttendeeClass);
router.get("/single/:id", authMiddleware(["SCHOOL"]), getSingleClass);
router.patch("/update/:id", authMiddleware(["SCHOOL"]), updateClassWithId); // AUTHENTICATED USER CAN ABLE TO UPDATE HIS/HER DATA
router.delete("/delete/:id", authMiddleware(["SCHOOL"]), deleteClassWithId); // AUTHENTICATED USER CAN ABLE TO get his data

module.exports = router;
