const Subject = require("../models/subject.modal");
const Student = require("../models/student.modal");
const Exam = require("../models/examination.modal");
const Schedule = require("../models/schedule.modal");

module.exports = {
  getScheduleWithClass: async (req, res) => {
    // console.log(req.params.id);

    try {
      const classId = req.params.id;
      const schoolId = req.user.schoolId;
      const schedules = await Schedule.find({
        school: schoolId,
        class: classId,
      }).populate(["teacher", "subject"]);
      res.status(200).json({
        success: true,
        message: "Successfully Fetched schedule with class.",
        data: schedules,
      });

      // console.log(allSubjects);
    } catch (error) {
      console.log("Fetching schedule with class", error);
      res.status(500).json({
        success: false,
        message: "Server Error in Fetching schedule with class.",
      });
    }
  },

  createSchedule: async (req, res) => {
    try {
      const newSchedule = new Schedule({
        school: req.user.schoolId,
        teacher: req.body.teacher,
        subject: req.body.subject,
        class: req.body.selectedClass,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
      });
      await newSchedule.save();
      res
        .status(200)
        .json({ success: true, message: "Succesfully Created the Schedule." });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message: "Server Error in Creating Schedule.",
      });
    }
  },

  getScheduleWithId: async (req, res) => {
    // console.log(req.params.id);

    try {
      const Id = req.params.id;
      const schoolId = req.user.schoolId;
      const schedule = (
        await Schedule.find({
          school: schoolId,
          _id: Id,
        })
      )[0];
      res.status(200).json({
        success: true,
        message: "Successfully Fetched schedule with class.",
        data: schedule,
      });

      // console.log(allSubjects);
    } catch (error) {
      console.log("Fetching schedule with class", error);
      res.status(500).json({
        success: false,
        message: "Server Error in Fetching schedule with class.",
      });
    }
  },

  updateScheduleWithId: async (req, res) => {
    try {
      let id = req.params.id;
      await Schedule.findOneAndUpdate({ _id: id }, { $set: { ...req.body } });
      const scheduleAfterUpdate = await Schedule.findOne({ _id: id });
      res.status(200).json({
        success: true,
        message: "Succesfully Updated the Schedule.",
        data: scheduleAfterUpdate,
      });
    } catch (error) {
      console.log("Got error in updating", error);
      res.status(500).json({
        success: false,
        message: "Server Error in Updating Schedule.",
      });
    }
  },

  deleteScheduleWithId: async (req, res) => {
    try {
      let id = req.params.id;
      let schoolId = req.user.schoolId;

      await Schedule.findOneAndDelete({ _id: id, school: schoolId });

      res.status(200).json({
        success: true,
        message: "Succesfully Deleted the Schedule.",
      });
    } catch (error) {
      console.log("Got error in deleting", error);
      res.status(500).json({
        success: false,
        message: "Server Error in Deleting Schedule.",
      });
    }
  },
};
