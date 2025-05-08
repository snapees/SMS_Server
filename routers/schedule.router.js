const express = require("express");
const authMiddleware = require("../auth/auth");
const {
  createSchedule,
  getScheduleWithClass,
  updateScheduleWithId,
  deleteScheduleWithId,
  getScheduleWithId,
} = require("../controllers/schedule.controller");

const router = express.Router();

router.post("/create", authMiddleware(["SCHOOL"]), createSchedule);
router.get(
  "/fetch-with-class/:id",
  authMiddleware(["SCHOOL", "TEACHER", "STUDENT"]),
  getScheduleWithClass
);
router.get("/fetch/:id", authMiddleware(["SCHOOL"]), getScheduleWithId);
router.post("/update/:id", authMiddleware(["SCHOOL"]), updateScheduleWithId); // AUTHENTICATED USER CAN ABLE TO UPDATE HIS/HER DATA
router.delete("/delete/:id", authMiddleware(["SCHOOL"]), deleteScheduleWithId); // AUTHENTICATED USER CAN ABLE TO get his data

module.exports = router;
