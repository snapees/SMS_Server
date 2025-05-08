const Attendance = require("../models/attendence.modal");
const moment = require("moment");

module.exports = {
  markAttendance: async (req, res) => {
    try {
      const { studentId, date, status, classId } = req.body;
      const schoolId = req.user.schoolId;

      const newAttendance = new Attendance({
        student: studentId,
        date,
        status,
        class: classId,
        school: schoolId,
      });
      await newAttendance.save();
      res.status(201).json({
        success: true,
        message: "Attendance Marked Successfully",
        newAttendance,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: "Error in Marking Attendance" });
    }
  },

  getAttendance: async (req, res) => {
    try {
      const { studentId } = req.params;
      const attendence = await Attendance.find({ student: studentId }).populate(
        "student"
      );
      res.status(200).json({
        success: true,
        message: "Got Marked Attendance Successfully",
        attendence,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error in Getting Marked Attendance",
      });
    }
  },

  checkAttendance: async (req, res) => {
    const { classId } = req.params;
    try {
      const today = moment().startOf("day");
      const attendenceForToday = await Attendance.findOne({
        class: req.params.classId,
        date: {
          // 00:00 hrs to 23:59
          $gte: today.toDate(),
          $lt: moment(today).endOf("day").toDate(),
        },
      });

      if (attendenceForToday) {
        return res
          .status(200)
          .json({ attendanceTaken: true, message: "Attendance already taken" });
      } else {
        return res.status(200).json({
          attendanceTaken: false,
          message: "No attendance taken yet for today",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error in Checking Attendance",
      });
    }
  },
};
